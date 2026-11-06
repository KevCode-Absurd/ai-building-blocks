// /ops/beta: invite codes for buyers, and staff roles (reviewer, ops).
import { useState } from "preact/hooks";
import { Badge, Button, Card, Field, Input, Loaded, Notice, Page, Select, Table, useLoad } from "../../components.tsx";
import { api, when } from "../../lib/api.ts";
import { useAuth } from "../../lib/auth.tsx";
import type { BetaCodeView, StaffView } from "../../../modules/ops/types.ts";
import { OpsNav, errorText } from "./shared.tsx";

/** Codes stop at the end of their last day in UTC, so show that UTC date, not the local time. */
const lastDay = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

const STATE_WORDS = { active: ["Active", "good"], used_up: ["Used up", "neutral"], expired: ["Expired", "warn"] } as const;

function MakeCodes(props: { onMade: () => void }) {
  const [count, setCount] = useState("5");
  const [uses, setUses] = useState("1");
  const [note, setNote] = useState("");
  const [expires, setExpires] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [made, setMade] = useState<string[] | null>(null);
  const [copied, setCopied] = useState(false);
  return (
    <Card title="Make invite codes">
      <form onSubmit={async e => {
        e.preventDefault(); setBusy(true); setError(null); setMade(null); setCopied(false);
        try {
          const res = await api<{ codes: string[] }>("/api/ops/beta-codes", { body: { count: Number(count), max_uses: Number(uses), note, expires_at: expires || undefined } });
          setMade(res.codes); props.onMade();
        } catch (err) { setError(errorText(err)); } finally { setBusy(false); }
      }}>
        <div class="ops-form-row">
          <Field label="How many codes" id="ops-count"><Input id="ops-count" type="number" min={1} max={100} value={count} onValue={setCount} /></Field>
          <Field label="Uses per code" help="1 means one person per code." id="ops-uses"><Input id="ops-uses" type="number" min={1} max={1000} value={uses} onValue={setUses} /></Field>
          <Field label="Last day it works" help="Codes stop at the end of this day (UTC). Leave empty for no end date." id="ops-expires"><Input id="ops-expires" type="date" value={expires} onValue={setExpires} /></Field>
        </div>
        <Field label="Note" help="Who the codes are for. Only the team sees this." id="ops-code-note"><Input id="ops-code-note" value={note} onValue={setNote} maxLength={200} placeholder="Shopify founders group, November" /></Field>
        {error && <Notice tone="bad">{error}</Notice>}
        <Button type="submit" busy={busy}>Make codes</Button>
      </form>
      {made && (
        <Notice tone="good" title={made.length === 1 ? "Your new code" : `Your ${made.length} new codes`}>
          <div class="ops-codes">{made.map(c => <code>{c}</code>)}</div>
          <p class="small">People enter a code at /invite after they sign in.</p>
          <Button small kind="secondary" onClick={async () => {
            try { await navigator.clipboard.writeText(made.join("\n")); setCopied(true); } catch { setCopied(false); }
          }}>{copied ? "Copied" : "Copy all"}</Button>
        </Notice>
      )}
    </Card>
  );
}

function Codes(props: { state: ReturnType<typeof useLoad<{ codes: BetaCodeView[] }>> }) {
  return (
    <Card title="Invite codes">
      <Loaded state={props.state}>
        {({ codes }) => (
          <Table empty="No codes yet." head={["Code", "Note", "Used", "Status", "Last day", "Made", "Used by"]} rows={codes.map(c => [
            <code>{c.code}</code>, c.note, `${c.uses} of ${c.max_uses}`,
            <Badge tone={STATE_WORDS[c.state][1]}>{STATE_WORDS[c.state][0]}</Badge>,
            c.expires_at ? lastDay(c.expires_at) : "No end date", when(c.created_at),
            c.redeemed.length ? <span class="ops-meta">{c.redeemed.map(r => r.email ?? r.user_id).join(", ")}</span> : "",
          ])} />
        )}
      </Loaded>
    </Card>
  );
}

function Staff() {
  const auth = useAuth();
  const state = useLoad(() => api<StaffView>("/api/ops/staff"), []);
  const [who, setWho] = useState("");
  const [role, setRole] = useState("reviewer");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const change = async (body: Record<string, string>, done: string) => {
    setBusy(true); setError(null); setMessage(null);
    try {
      const res = await api<{ changed: boolean; still_ops_from_settings: boolean }>("/api/ops/staff", { body });
      setMessage(res.still_ops_from_settings ? `${done} They still have ops access, because their id is in the app settings.` : res.changed ? done : "Nothing changed. They already had that role.");
      setRemoving(null); state.reload(); await auth.refreshMe();
    } catch (err) { setError(errorText(err)); } finally { setBusy(false); }
  };

  return (
    <Card title="Staff">
      <p class="muted small">Reviewers judge blind tests at /review. Ops can do everything here, and are reviewers too. People must sign in once before you can add them.</p>
      <form class="ops-form-row" onSubmit={e => {
        e.preventDefault();
        const v = who.trim();
        void change({ action: "add", role, ...(v.includes("@") ? { email: v } : { user_id: v }) }, `Added as ${role === "ops" ? "ops" : "a reviewer"}.`);
      }}>
        <Field label="Email or user id" id="ops-who"><Input id="ops-who" value={who} onValue={setWho} placeholder="name@example.com" /></Field>
        <Field label="Role" id="ops-role"><Select id="ops-role" value={role} onValue={setRole} options={[{ value: "reviewer", label: "Reviewer" }, { value: "ops", label: "Ops" }]} /></Field>
        <div class="ops-form-end"><Button type="submit" busy={busy} disabled={!who.trim()}>Add</Button></div>
      </form>
      {error && <Notice tone="bad">{error}</Notice>}
      {message && <Notice tone="good">{message}</Notice>}
      <Loaded state={state}>
        {s => (
          <>
            <Table empty="No staff added here yet." head={["Person", "Role", "Added by", "Added", ""]} rows={s.staff.map(m => {
              const key = `${m.user_id}:${m.role}`;
              const self = m.user_id === auth.me?.user.id && m.role === "ops";
              return [
                <>{m.email ?? m.user_id}{m.email && <div class="ops-meta"><code>{m.user_id}</code></div>}</>,
                m.role === "ops" ? <Badge tone="info">Ops</Badge> : <Badge>Reviewer</Badge>,
                <span class="ops-meta">{m.granted_by}</span>,
                when(m.created_at),
                self ? <span class="ops-meta">You</span> : removing === key ? (
                  <div class="row">
                    <Button small kind="danger" busy={busy} onClick={() => change({ action: "remove", role: m.role, user_id: m.user_id }, "Removed.")}>Yes, remove</Button>
                    <Button small kind="ghost" onClick={() => setRemoving(null)}>Keep</Button>
                  </div>
                ) : <Button small kind="secondary" onClick={() => setRemoving(key)}>Remove</Button>,
              ];
            })} />
            {s.settings_ops.length > 0 && (
              <p class="ops-meta">Ops from the app settings (change these in the OPS_USER_IDS setting): {s.settings_ops.map(o => o.email ?? o.user_id).join(", ")}.</p>
            )}
          </>
        )}
      </Loaded>
    </Card>
  );
}

function OpsBeta() {
  const codes = useLoad(() => api<{ codes: BetaCodeView[] }>("/api/ops/beta-codes"), []);
  return (
    <Page title="Invites and staff" intro="The beta is invite-only. Buyers need a code to order work." wide>
      <OpsNav />
      <div class="stack ops-stack">
        <MakeCodes onMade={codes.reload} />
        <Codes state={codes} />
        <Staff />
      </div>
    </Page>
  );
}

export { OpsBeta };
