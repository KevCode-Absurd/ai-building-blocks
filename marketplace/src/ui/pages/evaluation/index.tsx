// Pages for the evaluation module. Register each page here; src/ui/pages/index.ts collects them.
// /review: reviewers see one request and two unlabelled drafts, pick the better one, then get the next pair.
import { useState } from "preact/hooks";
import type { NavItem, PageDef } from "../types.ts";
import { Badge, Button, Card, Empty, Field, Loaded, Markdown, Notice, Page, TextArea, useLoad } from "../../components.tsx";
import { api } from "../../lib/api.ts";
import "./evaluation.css";

type Pick = "a" | "b" | "tie";
interface ShownDraft { content: string; format: string }
interface PairToReview { id: string; jobType: string | null; brief: string; a: ShownDraft; b: ShownDraft }
interface NextPair { test: PairToReview | null; waiting: number; done: number }

function prettyJson(text: string): string {
  try { return JSON.stringify(JSON.parse(text), null, 2); } catch { return text; }
}

function DraftBody(props: { draft: ShownDraft }) {
  const { draft } = props;
  if (draft.format === "json") return <pre class="eval-pre">{prettyJson(draft.content)}</pre>;
  if (draft.format === "text") return <div class="eval-text">{draft.content}</div>;
  return <Markdown text={draft.content} />;
}

function DraftColumn(props: { letter: "A" | "B"; draft: ShownDraft }) {
  return (
    <section class="card eval-draft" aria-labelledby={`eval-draft-${props.letter}`}>
      <h2 class="eval-draft-title" id={`eval-draft-${props.letter}`}>Draft {props.letter}</h2>
      <div class="eval-draft-body" tabIndex={0}>
        <DraftBody draft={props.draft} />
      </div>
    </section>
  );
}

function Review() {
  const state = useLoad<NextPair>(() => api<NextPair>("/api/review/blind/next"));
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<Pick | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(0);

  async function choose(pair: PairToReview, pick: Pick) {
    setBusy(pick); setError(null);
    try {
      await api(`/api/review/blind/${encodeURIComponent(pair.id)}`, { body: { pick, reason: reason.trim() } });
      setSaved(n => n + 1);
      setReason("");
      state.reload();
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err?.message ?? "We could not save your pick. Try again.");
      // Someone else closed the pair, or you already judged it: move on to the next one.
      if (err?.status === 409 || err?.status === 404) { setReason(""); state.reload(); }
    } finally {
      setBusy(null);
    }
  }

  const counts = state.data && (
    <div class="eval-counts" aria-live="polite">
      <Badge tone="info">{state.data.waiting} waiting</Badge>
      <Badge>{state.data.done} done by you</Badge>
    </div>
  );

  return (
    <Page
      wide
      title="Review drafts"
      intro="Read the request and both drafts. Then pick the one you would rather send to the client. The drafts have no labels, so judge only what is on the page."
      actions={counts}
    >
      {error && <Notice tone="warn">{error}</Notice>}
      <Loaded state={state}>
        {data => {
          const pair = data.test;
          if (!pair) {
            return (
              <Empty title={saved ? "You are all caught up" : "Nothing to review right now"} action={<Button kind="secondary" onClick={state.reload}>Check again</Button>}>
                {`New pairs show up here when agents finish jobs. You have reviewed ${data.done} ${data.done === 1 ? "pair" : "pairs"} so far.`}
              </Empty>
            );
          }
          const locked = !!busy || state.loading;
          return (
            <div class="eval-review" key={pair.id}>
              {saved > 0 && !error && <Notice tone="good">Saved. Here is the next pair.</Notice>}
              <Card title="The request" class="eval-brief" actions={pair.jobType ? <Badge>{pair.jobType}</Badge> : undefined}>
                <Markdown text={pair.brief} />
              </Card>
              <div class="eval-pair">
                <DraftColumn letter="A" draft={pair.a} />
                <DraftColumn letter="B" draft={pair.b} />
              </div>
              <Card title="Which draft is better?" class="eval-decide">
                <Field label="Why? (optional)" help="One line is enough. It helps us improve the agents." id="eval-reason">
                  <TextArea id="eval-reason" rows={3} maxLength={2000} value={reason} onValue={setReason} placeholder="For example: B answers the price question and A does not." />
                </Field>
                <div class="eval-actions">
                  <Button onClick={() => choose(pair, "a")} busy={busy === "a"} disabled={locked}>A is better</Button>
                  <Button onClick={() => choose(pair, "b")} busy={busy === "b"} disabled={locked}>B is better</Button>
                  <Button kind="secondary" onClick={() => choose(pair, "tie")} busy={busy === "tie"} disabled={locked}>About the same</Button>
                </div>
              </Card>
            </div>
          );
        }}
      </Loaded>
    </Page>
  );
}

export const pages: PageDef[] = [
  { path: "/review", access: "reviewer", component: Review },
];

export const nav: NavItem[] = [
  { label: "Review", href: "/review", group: "main", order: 60, show: me => !!me?.roles.reviewer },
];
