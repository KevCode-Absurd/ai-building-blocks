// "Upload a trained pack" on /studio: start an agent from a "Train your own" pack the expert trained in their own AI.
// Sends the zip as it is to POST /api/studio/import (src/modules/studio/import.ts); the server checks everything again.
import { useState } from "preact/hooks";
import { Button, Card, Field, Notice, Select } from "../../components.tsx";
import { authHeaders } from "../../lib/auth.tsx";
import { Link } from "../../lib/router.tsx";

/** The server's limit (import.ts). The browser checks it first so a big file fails fast. */
export const MAX_PACK_BYTES = 2 * 1024 * 1024;

interface ImportResult { agentId: string; agent: { id: string; name: string }; playbookChars: number; trimmed: string[]; warnings: string[] }

/** Checks a chosen file before upload: a .zip, not empty, at most 2 MB, starting with the zip signature. */
async function checkZip(file: File): Promise<string | null> {
  if (!/\.zip$/i.test(file.name)) return "Choose the pack's .zip file. Zip the trained folder first if you have not.";
  if (file.size === 0) return "That file is empty. Zip the trained pack folder again and choose the new file.";
  if (file.size > MAX_PACK_BYTES) return "That file is larger than 2 MB, the most a zipped pack can be. Remove large files, such as long examples, then zip it again.";
  const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  if (head[0] !== 0x50 || head[1] !== 0x4b || head[2] !== 0x03 || head[3] !== 0x04) return "That file is not a zip. Zip the trained pack folder and choose the .zip file.";
  return null;
}

export function UploadPack(props: { jobTypes: { id: string; title: string; taken: boolean }[]; onDone: () => void }) {
  const open = props.jobTypes.filter(j => !j.taken);
  const [picked, setJobTypeId] = useState(open[0]?.id ?? "");
  // After an upload the list reloads and that job is taken, so the choice moves to the next open job.
  const jobTypeId = open.some(j => j.id === picked) ? picked : open[0]?.id ?? "";
  const [file, setFile] = useState<File | null>(null);
  const [rights, setRights] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<ImportResult | null>(null);
  const [inputKey, setInputKey] = useState(0);

  const intro = (
    <p class="muted small">Trained your own agent with a "Train your own" pack? Upload the .zip here to start an agent for one of your jobs. <Link href="/guides/train-your-own-agent">How training works</Link>.</p>
  );
  if (!props.jobTypes.length) return null;
  if (!open.length && !done) {
    return <Card title="Upload a trained pack" class="studio-upload">{intro}<p class="muted">You have an agent for every job you were approved for. To add another job, contact us.</p></Card>;
  }

  const pick = async (f: File | null) => {
    setDone(null);
    setError(f ? await checkZip(f) : null);
    setFile(f);
  };

  const upload = async () => {
    if (!file || !jobTypeId) return;
    const problem = await checkZip(file);
    if (problem) { setError(problem); return; }
    setBusy(true); setError(null); setDone(null);
    try {
      const q = new URLSearchParams({ job_type_id: jobTypeId });
      if (rights) q.set("examples_rights", "1");
      let res: Response;
      try {
        res = await fetch(`/api/studio/import?${q}`, { method: "POST", headers: { ...(await authHeaders()), "content-type": "application/zip" }, body: file });
      } catch {
        setError("We could not reach AI Blocks. Check your connection and try again.");
        return;
      }
      const text = await res.text();
      let body: any = null;
      try { body = text ? JSON.parse(text) : null; } catch { /* not JSON */ }
      if (res.status === 201 && body?.agentId) {
        setDone(body as ImportResult);
        setFile(null); setRights(false); setInputKey(k => k + 1);
        props.onDone();
        return;
      }
      setError(res.status >= 400 && res.status < 500 && body?.error?.message
        ? body.error.message
        : "Something went wrong on our side. Try again in a few minutes.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Upload a trained pack" class="studio-upload">
      {intro}
      {done ? (
        <Notice tone="good" title={`${done.agent?.name ?? "Your agent"} is in your studio`}>
          {done.warnings.length > 0 && <ul class="studio-upload-warnings">{done.warnings.map(w => <li>{w}</li>)}</ul>}
          <p class="studio-upload-next"><Link href={`/studio/agents/${encodeURIComponent(done.agentId)}`}>Open {done.agent?.name ?? "the agent"} in the studio</Link></p>
        </Notice>
      ) : null}
      {open.length > 0 && <>
        <Field label="The job" id="studio-upload-job"><Select id="studio-upload-job" value={jobTypeId} onValue={setJobTypeId} options={open.map(j => ({ value: j.id, label: j.title }))} /></Field>
        <Field label="Your trained pack (.zip, up to 2 MB)" id="studio-upload-file">
          {/* A new key clears the chosen file after an upload. */}
          <input key={inputKey} id="studio-upload-file" class="input studio-upload-file" type="file" accept=".zip,application/zip"
            onChange={e => { void pick((e.target as HTMLInputElement).files?.[0] ?? null); }} />
        </Field>
        <label class="studio-check">
          <input type="checkbox" checked={rights} onChange={e => setRights((e.target as HTMLInputElement).checked)} />
          <span>These examples are mine or I have permission to use them, and I have removed personal details</span>
        </label>
        {error && <Notice tone="bad">{error}</Notice>}
        <Button busy={busy} disabled={!file || !jobTypeId || !!error} onClick={() => { void upload(); }}>Upload pack</Button>
        <p class="muted small studio-upload-note">We test your agent against plain AI and review it before it goes live.</p>
      </>}
    </Card>
  );
}
