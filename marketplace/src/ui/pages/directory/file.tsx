// /agents/:id/files/*path: one file from an agent's free download, readable in the browser. Public.
// Only paths that the pack's files.json lists open, and only from this site's /packs/ files.
import { useEffect } from "preact/hooks";
import { Button, Page, Spinner, useLoad } from "../../components.tsx";
import { api, ApiError } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import type { AgentProfile } from "./parts.tsx";
import { PackContents, SafeMarkdown } from "./pack-parts.tsx";
import { fetchPackText, fileFormat, fileNames, formatBytes, kindLabel, loadPack, packFileHref, plainFileName, prettyJson, safePackPath, splitFrontmatter, tidyPurpose, type PackFile, type PackInfo } from "./packs.ts";

type Viewer =
  | { kind: "no-agent" }
  | { kind: "no-pack"; agent: AgentProfile }
  | { kind: "no-file"; agent: AgentProfile; pack: PackInfo }
  | { kind: "ok"; agent: AgentProfile; pack: PackInfo; file: PackFile; text: string };

async function loadAgent(id: string): Promise<AgentProfile | null> {
  try { return (await api<{ agent: AgentProfile }>(`/api/agents/${encodeURIComponent(id)}`)).agent; }
  catch (e) { if (e instanceof ApiError && e.status === 404) return null; throw e; }
}

async function loadViewer(id: string, rawPath: string): Promise<Viewer> {
  const path = safePackPath(rawPath);
  const [agent, pack] = await Promise.all([loadAgent(id), loadPack(id)]);
  if (!agent) return { kind: "no-agent" };
  if (!pack || !pack.files.length) return { kind: "no-pack", agent };
  const file = path ? pack.files.find(f => f.path === path) : undefined;
  if (!file) return { kind: "no-file", agent, pack };
  const text = await fetchPackText(packFileHref(id, file));
  return text === null ? { kind: "no-file", agent, pack } : { kind: "ok", agent, pack, file, text };
}

export function AgentFilePage(props: { params: Record<string, string> }) {
  const { id, path } = props.params;
  const state = useLoad(() => loadViewer(id, path), [id, path]);
  const v = state.data;
  if (state.error) return (
    <Page title="We could not load this file" intro="Check your connection, then try again.">
      <div class="row"><Button onClick={state.reload}>Try again</Button><Button kind="secondary" href={`/agents/${encodeURIComponent(id)}`}>Back to the agent</Button></div>
    </Page>
  );
  if (!v || state.loading) return <main class="page"><Spinner label="Loading the file..." /></main>;
  if (v.kind === "no-agent") return (
    <Page title="We could not find that agent" intro="It may have a new name, or it is no longer offered.">
      <Button href="/agents">See all agents</Button>
    </Page>
  );
  const back = `/agents/${encodeURIComponent(id)}`;
  if (v.kind === "no-pack") return (
    <Page title="This download is not ready yet" intro={`${v.agent.name}'s files are not ready to read yet. Check back soon.`}>
      <Button href={back}>Back to {v.agent.name}</Button>
    </Page>
  );
  if (v.kind === "no-file") return (
    <Page title="We could not find that file" intro={`It is not in ${v.agent.name}'s download. Pick a file from the list.`}>
      <div class="row dir-file-missing-actions"><Button href={back}>Back to {v.agent.name}</Button></div>
      <PackContents agentId={id} files={v.pack.files} names={fileNames(v.agent)} />
    </Page>
  );
  return <FileView id={id} agent={v.agent} pack={v.pack} file={v.file} text={v.text} />;
}

function FileView(props: { id: string; agent: AgentProfile; pack: PackInfo; file: PackFile; text: string }) {
  const { id, agent: a, pack, file, text } = props;
  // The file by its plain name; where it sits in the download is one small line under it.
  const names = fileNames(a), name = plainFileName(file.path, names);
  useEffect(() => { document.title = `${name} · ${a.name}, ${a.title} · AI Blocks`; }, [file.path, a.id]);
  const format = fileFormat(file.path);
  const md = format === "markdown" ? splitFrontmatter(text) : null;
  const size = formatBytes(file.bytes);
  return (
    <main class="page dir-file" style={`--dir-accent:${a.accent}`}>
      <Link href={`/agents/${encodeURIComponent(id)}`} class="dir-back">&larr; Back to {a.name}</Link>
      <div class="dir-file-layout">
        <article class="dir-file-main" aria-labelledby="dir-file-title">
          <header class="dir-file-head">
            <p class="eyebrow">{a.name}'s download · {kindLabel(file.kind)}</p>
            <h1 id="dir-file-title" class="dir-file-title">{name}</h1>
            {file.purpose && <p class="dir-file-lede">{tidyPurpose(file.purpose)}</p>}
            <p class="dir-file-where">In the download as <code>{file.path}</code></p>
            <div class="dir-file-actions">
              <a class="btn btn-primary" href={pack.agentZip.path} download>Download this agent</a>
              <a class="btn btn-line btn-sm" href={packFileHref(id, file)} download={file.path.split("/").pop()}>Save this file{size ? ` (${size})` : ""}</a>
            </div>
          </header>
          <div class="dir-file-body">
            {md
              ? <>
                  {md.meta && <pre class="dir-file-meta" aria-label="Skill details"><code>{md.meta}</code></pre>}
                  <SafeMarkdown text={md.body} class="dir-file-prose" />
                </>
              : <pre class="dir-file-pre"><code>{format === "json" ? prettyJson(text) : text}</code></pre>}
          </div>
        </article>
        <aside class="dir-file-side" aria-labelledby="dir-file-side-title">
          <h2 id="dir-file-side-title">Every file in the download</h2>
          <PackContents agentId={id} files={pack.files} current={file.path} compact names={names} />
        </aside>
      </div>
    </main>
  );
}
