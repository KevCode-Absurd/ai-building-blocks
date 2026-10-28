#!/usr/bin/env python3
"""
autoresearch-agent: Experiment Runner

Executes a single experiment iteration. The AI agent is the loop —
it calls this script repeatedly. The script handles evaluation,
metric parsing, keep/discard decisions, and git rollback on failure.

Safety (AI Blocks adaptation): before anything can be reset, the runner
checks that tracked files have no uncommitted changes, that a baseline was
recorded, that HEAD is exactly one commit on top of the last kept commit,
and that this commit changes only the target file. Rollback goes to that
last kept commit by hash, never to a blind HEAD~1.

Usage:
    python scripts/run_experiment.py --experiment engineering/api-speed --baseline
    python scripts/run_experiment.py --experiment engineering/api-speed --single
    python scripts/run_experiment.py --experiment engineering/api-speed --dry-run
    python scripts/run_experiment.py --experiment engineering/api-speed --single --description "added caching"
"""

import argparse
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path


def find_autoresearch_root():
    """Find .autoresearch/ in project or user home."""
    project_root = Path(".").resolve() / ".autoresearch"
    if project_root.exists():
        return project_root
    user_root = Path.home() / ".autoresearch"
    if user_root.exists():
        return user_root
    return None


def load_config(experiment_dir):
    """Load config.cfg from experiment directory."""
    cfg_file = experiment_dir / "config.cfg"
    if not cfg_file.exists():
        print(f"  Error: no config.cfg in {experiment_dir}")
        sys.exit(1)
    config = {}
    for line in cfg_file.read_text().splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            config[k.strip()] = v.strip()
    return config


def run_git(args, cwd=None, timeout=30):
    """Run a git command safely (no shell injection). Returns (returncode, stdout, stderr)."""
    result = subprocess.run(
        ["git"] + args,
        capture_output=True, text=True,
        cwd=cwd, timeout=timeout
    )
    return result.returncode, result.stdout.strip(), result.stderr.strip()


def get_current_commit(path):
    """Get short hash of current HEAD."""
    _, commit, _ = run_git(["rev-parse", "--short", "HEAD"], cwd=path)
    return commit


def resolve_commit(path, rev):
    """Return the full hash for rev, or None if it does not resolve."""
    code, full, _ = run_git(["rev-parse", "--verify", "--quiet", f"{rev}^{{commit}}"], cwd=path)
    return full if code == 0 and full else None


def tracked_changes(path):
    """List tracked files with uncommitted changes (untracked files are ignored)."""
    _, out, _ = run_git(["status", "--porcelain", "--untracked-files=no"], cwd=path)
    return [l for l in out.splitlines() if l.strip()]


def get_last_kept_commit(experiment_dir):
    """Commit of the most recent 'keep' row (the baseline or last kept change)."""
    tsv = experiment_dir / "results.tsv"
    if not tsv.exists():
        return None
    kept = None
    for line in tsv.read_text().splitlines()[1:]:
        parts = line.split("\t")
        if len(parts) >= 3 and parts[2] == "keep" and parts[1] != "N/A":
            kept = parts[0]
    return kept


def check_safe_to_run(project_root, experiment_dir, target):
    """Guards that must pass before anything can be reset.

    Returns (base_full_hash, None) when it is safe, or (None, reason) when not.
    Safe means: no uncommitted changes to tracked files, a baseline exists,
    HEAD is exactly one commit on top of the last kept commit, and that commit
    changes only the target file.
    """
    root = str(project_root)
    dirty = tracked_changes(root)
    if dirty:
        return None, ("uncommitted changes to tracked files:\n    " + "\n    ".join(dirty[:10]) +
                      "\n  Commit or stash them first. Nothing was reset.")
    kept_short = get_last_kept_commit(experiment_dir)
    if kept_short is None:
        return None, ("no baseline recorded. Run with --baseline on the unchanged file first. "
                      "Nothing was reset.")
    base = resolve_commit(root, kept_short)
    if base is None:
        return None, f"last kept commit {kept_short} is not in this repository. Nothing was reset."
    parent = resolve_commit(root, "HEAD~1")
    if parent != base:
        return None, (f"HEAD is not exactly one commit on top of the last kept commit {kept_short}. "
                      "Commit exactly one change to the target file, on the experiment branch, "
                      "then run again. Nothing was reset.")
    _, changed, _ = run_git(["diff", "--name-only", base, "HEAD"], cwd=root)
    changed_files = [c for c in changed.splitlines() if c.strip()]
    target_norm = Path(target).as_posix() if target else None
    if target_norm and target_norm.startswith("./"):
        target_norm = target_norm[2:]
    if target_norm and any(Path(c).as_posix() != target_norm for c in changed_files):
        return None, ("the experiment commit changes files other than the target "
                      f"({target_norm}): {', '.join(changed_files)}. Nothing was reset.")
    return base, None


def rollback(project_root, base):
    """Return to the last kept commit. Only called after check_safe_to_run passed."""
    code, _, err = run_git(["reset", "--hard", base], cwd=str(project_root))
    if code != 0:
        print(f"  Warning: rollback to {base[:7]} failed: {err[:200]}")


def get_best_metric(experiment_dir, direction):
    """Read the best metric from results.tsv."""
    tsv = experiment_dir / "results.tsv"
    if not tsv.exists():
        return None
    lines = [l for l in tsv.read_text().splitlines()[1:] if "\tkeep\t" in l]
    if not lines:
        return None
    metrics = []
    for line in lines:
        parts = line.split("\t")
        try:
            if parts[1] != "N/A":
                metrics.append(float(parts[1]))
        except (ValueError, IndexError):
            continue
    if not metrics:
        return None
    return min(metrics) if direction == "lower" else max(metrics)


def run_evaluation(project_root, eval_cmd, time_budget_minutes, log_file):
    """Run evaluation with time limit. Output goes to log_file.

    Note: shell=True is intentional here — eval_cmd is user-provided and
    may contain pipes, redirects, or chained commands.
    """
    hard_limit = time_budget_minutes * 60 * 2.5
    t0 = time.time()
    try:
        with open(log_file, "w") as lf:
            result = subprocess.run(
                eval_cmd, shell=True,
                stdout=lf, stderr=subprocess.STDOUT,
                cwd=str(project_root),
                timeout=hard_limit
            )
        elapsed = time.time() - t0
        return result.returncode, elapsed
    except subprocess.TimeoutExpired:
        elapsed = time.time() - t0
        return -1, elapsed


def extract_metric(log_file, metric_grep):
    """Extract metric value from log file."""
    log_path = Path(log_file)
    if not log_path.exists():
        return None
    for line in reversed(log_path.read_text().splitlines()):
        stripped = line.strip()
        if stripped.startswith(metric_grep.lstrip("^")):
            try:
                return float(stripped.split(":")[-1].strip())
            except ValueError:
                continue
    return None


def is_improvement(new_val, old_val, direction):
    """Check if new result is better than old."""
    if old_val is None:
        return True
    if direction == "lower":
        return new_val < old_val
    return new_val > old_val


def log_result(experiment_dir, commit, metric_val, status, description):
    """Append result to results.tsv."""
    tsv = experiment_dir / "results.tsv"
    metric_str = f"{metric_val:.6f}" if metric_val is not None else "N/A"
    with open(tsv, "a") as f:
        f.write(f"{commit}\t{metric_str}\t{status}\t{description}\n")


def get_experiment_count(experiment_dir):
    """Count experiments run so far."""
    tsv = experiment_dir / "results.tsv"
    if not tsv.exists():
        return 0
    return max(0, len(tsv.read_text().splitlines()) - 1)


def get_description_from_diff(project_root):
    """Auto-generate a description from git diff --stat HEAD~1."""
    code, diff_stat, _ = run_git(["diff", "--stat", "HEAD~1"], cwd=str(project_root))
    if code == 0 and diff_stat:
        return diff_stat.split("\n")[0][:50]
    return "experiment"


def read_last_lines(filepath, n=5):
    """Read last n lines of a file (replaces tail shell command)."""
    path = Path(filepath)
    if not path.exists():
        return ""
    lines = path.read_text().splitlines()
    return "\n".join(lines[-n:])


def run_single(project_root, experiment_dir, config, exp_num, dry_run=False, description=None):
    """Run one experiment iteration."""
    direction = config.get("metric_direction", "lower")
    metric_grep = config.get("metric_grep", "^metric:")
    eval_cmd = config.get("evaluate_cmd", "python evaluate.py")
    time_budget = int(config.get("time_budget_minutes", 5))
    metric_name = config.get("metric", "metric")
    log_file = str(experiment_dir / "run.log")

    best = get_best_metric(experiment_dir, direction)
    ts = datetime.now().strftime("%H:%M:%S")

    print(f"\n[{ts}] Experiment #{exp_num}")
    print(f"  Best {metric_name}: {best}")

    # Guards: refuse before running anything that could later reset work
    base, problem = check_safe_to_run(project_root, experiment_dir, config.get("target"))
    if problem:
        print(f"  STOPPED: {problem}")
        return "blocked"

    if dry_run:
        print("  [DRY RUN] Guards passed. Would run evaluation and check metric")
        return "dry_run"

    # Auto-generate description if not provided
    if not description:
        description = get_description_from_diff(str(project_root))

    # Run evaluation
    print(f"  Running: {eval_cmd} (budget: {time_budget}m)")
    ret_code, elapsed = run_evaluation(project_root, eval_cmd, time_budget, log_file)

    commit = get_current_commit(str(project_root))

    # Timeout
    if ret_code == -1:
        print(f"  TIMEOUT after {elapsed:.0f}s — discarding")
        rollback(project_root, base)
        log_result(experiment_dir, commit, None, "crash", f"timeout_{elapsed:.0f}s")
        return "crash"

    # Crash
    if ret_code != 0:
        tail = read_last_lines(log_file, 5)
        print(f"  CRASH (exit {ret_code}) after {elapsed:.0f}s")
        print(f"  Last output: {tail[:200]}")
        rollback(project_root, base)
        log_result(experiment_dir, commit, None, "crash", f"exit_{ret_code}")
        return "crash"

    # Extract metric
    metric_val = extract_metric(log_file, metric_grep)
    if metric_val is None:
        print(f"  Could not parse {metric_name} from run.log")
        rollback(project_root, base)
        log_result(experiment_dir, commit, None, "crash", "metric_parse_failed")
        return "crash"

    delta = ""
    if best is not None:
        diff = metric_val - best
        delta = f" (delta {diff:+.4f})"

    print(f"  {metric_name}: {metric_val:.6f}{delta} in {elapsed:.0f}s")

    # Keep or discard
    if is_improvement(metric_val, best, direction):
        print(f"  KEEP — improvement")
        log_result(experiment_dir, commit, metric_val, "keep", description)
        return "keep"
    else:
        print(f"  DISCARD — no improvement")
        rollback(project_root, base)
        best_str = f"{best:.4f}" if best is not None else "?"
        log_result(experiment_dir, commit, metric_val, "discard",
                   f"no_improvement_{metric_val:.4f}_vs_{best_str}")
        return "discard"


def run_baseline(project_root, experiment_dir, config):
    """Measure the unchanged target and record it as the first 'keep' row.

    Never resets anything. Every later comparison starts from this row.
    """
    root = str(project_root)
    if get_last_kept_commit(experiment_dir) is not None:
        print("  A baseline is already recorded. Nothing to do.")
        return "exists"
    dirty = tracked_changes(root)
    if dirty:
        print("  STOPPED: uncommitted changes to tracked files. Commit or stash them, then run --baseline.")
        return "blocked"
    metric_grep = config.get("metric_grep", "^metric:")
    eval_cmd = config.get("evaluate_cmd", "python evaluate.py")
    time_budget = int(config.get("time_budget_minutes", 5))
    log_file = str(experiment_dir / "run.log")
    print(f"  Measuring baseline: {eval_cmd} (budget: {time_budget}m)")
    ret_code, elapsed = run_evaluation(project_root, eval_cmd, time_budget, log_file)
    if ret_code != 0:
        print(f"  Baseline run failed (exit {ret_code}) after {elapsed:.0f}s. Fix the eval command first.")
        return "crash"
    metric_val = extract_metric(log_file, metric_grep)
    if metric_val is None:
        print(f"  Could not parse {config.get('metric', 'metric')} from run.log. Fix the eval output first.")
        return "crash"
    commit = get_current_commit(root)
    log_result(experiment_dir, commit, metric_val, "keep", "baseline")
    print(f"  BASELINE {metric_val:.6f} recorded at {commit}")
    return "baseline"


def main():
    parser = argparse.ArgumentParser(description="autoresearch-agent runner")
    parser.add_argument("--experiment", help="Experiment path: domain/name (e.g. engineering/api-speed)")
    parser.add_argument("--baseline", action="store_true",
                        help="Measure the unchanged target once and record it (run this first)")
    parser.add_argument("--single", action="store_true", help="Run one experiment iteration")
    parser.add_argument("--dry-run", action="store_true", help="Show what would happen")
    parser.add_argument("--description", help="Description of the change (auto-generated from git diff if omitted)")
    parser.add_argument("--path", default=".", help="Project root")
    args = parser.parse_args()

    project_root = Path(args.path).resolve()
    root = find_autoresearch_root()

    if root is None:
        print("No .autoresearch/ found. Run setup_experiment.py first.")
        sys.exit(1)

    if not args.experiment:
        print("Specify --experiment domain/name")
        sys.exit(1)

    experiment_dir = root / args.experiment
    if not experiment_dir.exists():
        print(f"Experiment not found: {experiment_dir}")
        print("Run: python scripts/setup_experiment.py --list")
        sys.exit(1)

    config = load_config(experiment_dir)

    print(f"\n  autoresearch-agent")
    print(f"  Experiment: {args.experiment}")
    print(f"  Target: {config.get('target', '?')}")
    print(f"  Metric: {config.get('metric', '?')} ({config.get('metric_direction', '?')} is better)")
    print(f"  Budget: {config.get('time_budget_minutes', '?')} min/experiment")
    print(f"  Mode: {'baseline' if args.baseline else 'dry-run' if args.dry_run else 'single'}")

    if args.baseline:
        outcome = run_baseline(project_root, experiment_dir, config)
        sys.exit(0 if outcome in ("baseline", "exists") else 1)

    exp_num = get_experiment_count(experiment_dir) + 1
    outcome = run_single(project_root, experiment_dir, config, exp_num, args.dry_run, args.description)
    if outcome == "blocked":
        sys.exit(2)


if __name__ == "__main__":
    main()
