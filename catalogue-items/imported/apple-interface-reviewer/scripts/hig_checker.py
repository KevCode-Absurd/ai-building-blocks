#!/usr/bin/env python3
"""
Apple HIG Compliance Checker
Quantitative checks for tap targets, contrast, and typography.

Control sizes per platform come from Apple's Human Interface Guidelines,
Accessibility > Mobility (default and minimum control size table):
https://developer.apple.com/design/human-interface-guidelines/accessibility
Contrast minimums are the WCAG Level AA values that the same page says
Accessibility Inspector uses: 4.5:1 for text up to 17 pt, 3:1 for 18 pt
and larger or bold text.

Invalid input never passes: a bad colour, size or platform is reported as an
error, and a batch with any error gets no score.
"""

import sys
import argparse
import json
import re

# platform: (default control size, minimum control size), in points
PLATFORM_SIZES = {
    "ios": (44, 28),
    "ipados": (44, 28),
    "macos": (28, 20),
    "tvos": (66, 56),
    "visionos": (60, 28),
    "watchos": (44, 28),
}

HEX_RE = re.compile(r"^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$")


class InputError(ValueError):
    """Raised for input that cannot be checked."""


def parse_hex(hex_color):
    """Returns (r, g, b) in 0..1 from #RGB or #RRGGBB. Raises InputError otherwise."""
    if not isinstance(hex_color, str) or not HEX_RE.match(hex_color.strip()):
        raise InputError(f"invalid colour {hex_color!r}: use #RGB or #RRGGBB")
    h = hex_color.strip().lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4))


def calculate_luminance(hex_color):
    """Calculates WCAG relative luminance for a given hex color."""
    r, g, b = parse_hex(hex_color)

    def adjust(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b)


def check_contrast(fg, bg):
    """Checks contrast ratio between foreground and background."""
    l1 = calculate_luminance(fg)
    l2 = calculate_luminance(bg)

    if l1 < l2:
        l1, l2 = l2, l1

    ratio = (l1 + 0.05) / (l2 + 0.05)
    return round(ratio, 2)


def contrast_threshold(large):
    """4.5:1 for normal text; 3:1 for text 18 pt and larger, or bold."""
    return 3.0 if large else 4.5


def parse_size(value, label):
    try:
        n = float(value)
    except (TypeError, ValueError):
        raise InputError(f"invalid {label} {value!r}: use a number of points")
    if not (n > 0 and n != float("inf")):
        raise InputError(f"invalid {label} {value!r}: must be a finite number greater than 0")
    return n


def check_target(width, height, platform):
    """Returns (status, message). status is PASSED, BELOW_RECOMMENDED or FAILED."""
    key = str(platform or "").strip().lower()
    if key not in PLATFORM_SIZES:
        raise InputError(
            f"invalid platform {platform!r}: use one of {', '.join(sorted(PLATFORM_SIZES))}")
    w = parse_size(width, "width")
    h = parse_size(height, "height")
    default, minimum = PLATFORM_SIZES[key]
    size = f"{w:g}x{h:g} pt on {key}"
    if w < minimum or h < minimum:
        return "FAILED", f"{size} is under the {minimum}x{minimum} pt minimum (recommended {default}x{default} pt)"
    if w < default or h < default:
        return "BELOW_RECOMMENDED", f"{size} is under the recommended {default}x{default} pt (minimum {minimum}x{minimum} pt)"
    return "PASSED", f"{size} meets the recommended {default}x{default} pt"


def run_batch(data, default_platform=None):
    results = {"score": 100, "complete": True, "violations": [], "errors": []}
    if not isinstance(data, dict) or not isinstance(data.get("checks"), list):
        raise InputError('batch file must be a JSON object with a "checks" list')
    if not data["checks"]:
        raise InputError('"checks" is empty: there is nothing to score')
    platform_all = data.get("platform", default_platform)
    for i, item in enumerate(data["checks"]):
        name = item.get("name", f"element {i + 1}") if isinstance(item, dict) else f"element {i + 1}"
        try:
            if not isinstance(item, dict):
                raise InputError("check must be an object")
            kind = item.get("type")
            if kind == "contrast":
                r = check_contrast(item.get("fg"), item.get("bg"))
                need = contrast_threshold(bool(item.get("large", False)))
                if r < need:
                    results["violations"].append(f"Contrast {r} fails {need}:1 for {name}")
                    results["score"] -= 10
            elif kind == "target":
                status, msg = check_target(item.get("w"), item.get("h"),
                                           item.get("platform", platform_all))
                if status != "PASSED":
                    results["violations"].append(f"Target {msg} for {name}")
                    results["score"] -= 10
            else:
                raise InputError(f"unknown check type {kind!r}: use contrast or target")
        except InputError as e:
            results["errors"].append(f"{name}: {e}")
    if results["errors"]:
        results["score"] = None
        results["complete"] = False
    else:
        results["score"] = max(results["score"], 0)
    return results


def main():
    parser = argparse.ArgumentParser(description="Apple HIG Compliance Checker")
    subparsers = parser.add_subparsers(dest="command", help="Compliance command")

    # Contrast command
    contrast_parser = subparsers.add_parser("contrast", help="Check contrast ratio")
    contrast_parser.add_argument("fg", help="Foreground Hex (e.g. #FFFFFF)")
    contrast_parser.add_argument("bg", help="Background Hex (e.g. #000000)")
    contrast_parser.add_argument("--large", action="store_true",
                                 help="Text is 18 pt or larger, or bold (3:1 minimum)")

    # Target command
    target_parser = subparsers.add_parser("target", help="Check tap target size")
    target_parser.add_argument("width", help="Width in points")
    target_parser.add_argument("height", help="Height in points")
    target_parser.add_argument("--platform", required=True, choices=sorted(PLATFORM_SIZES),
                               help="Platform the control is for")

    # Batch command
    batch_parser = subparsers.add_parser("batch", help="Batch check from JSON")
    batch_parser.add_argument("file", help="Path to JSON file")
    batch_parser.add_argument("--platform", choices=sorted(PLATFORM_SIZES),
                              help="Platform for target checks without their own platform")

    args = parser.parse_args()

    try:
        if args.command == "contrast":
            ratio = check_contrast(args.fg, args.bg)
            need = contrast_threshold(args.large)
            status = "PASSED" if ratio >= need else "FAILED"
            print(f"Contrast Ratio: {ratio} [{status}] (minimum {need}:1)")
            if status == "FAILED":
                print(f"Recommendation: Increase contrast to at least {need}:1 for accessibility.")

        elif args.command == "target":
            status, msg = check_target(args.width, args.height, args.platform)
            print(f"Tap Target: {msg} [{status}]")
            if status != "PASSED":
                print("Recommendation: Expand the hit region to the recommended size for this platform (Apple HIG, Accessibility > Mobility).")

        elif args.command == "batch":
            try:
                with open(args.file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            except (OSError, json.JSONDecodeError) as e:
                raise InputError(f"cannot read batch file: {e}")
            results = run_batch(data, args.platform)
            print(json.dumps(results, indent=2))
            if not results["complete"]:
                sys.exit(2)

        else:
            parser.print_help()
    except InputError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
