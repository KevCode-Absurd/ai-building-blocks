// /experts/apply: a short application form, then what happens next.
import { useMemo, useState } from "preact/hooks";
import { AREAS, type Area } from "../../../core/types.ts";
import { Button, Card, Field, Input, Notice, Page, Spinner, TextArea, useLoad } from "../../components.tsx";
import { api } from "../../lib/api.ts";
import { useAuth } from "../../lib/auth.tsx";
import {
  AREA_LABELS, WhatNext, canApplyAgain, longDate,
  type Agreement, type CatalogueList, type ExpertMe, type ExpertView, type PublicInviteView,
} from "./shared.tsx";

const MAX_AREAS = 3, MAX_JOBS = 10, MAX_CLAIMS = 5, MAX_SAMPLES = 5;

const isHttps = (v: string) => {
  try { const u = new URL(v); return u.protocol === "https:" && u.hostname.includes("."); } catch { return false; }
};

/** The founding invite in ?invite=<token>, or null. A bad or used link just means applying without it. */
async function loadInvite(token: string): Promise<{ token: string; invite: PublicInviteView } | null> {
  if (!token) return null;
  try {
    const res = await api<{ invite: PublicInviteView }>(`/api/experts/invites/${encodeURIComponent(token)}`);
    return res.invite.state === "open" ? { token, invite: res.invite } : null;
  } catch { return null; }
}

export function ApplyPage(props: { query?: URLSearchParams }) {
  const inviteToken = props.query?.get("invite")?.trim() ?? "";
  const state = useLoad(async () => {
    const [me, invite] = await Promise.all([api<ExpertMe>("/api/experts/me"), loadInvite(inviteToken)]);
    return { ...me, invite };
  }, [inviteToken]);
  const [sent, setSent] = useState<string | null>(null);
  if (sent) return <Sent reviewTime={sent} />;
  if (state.error) return <Page title="Apply as an expert"><Notice tone="bad">{state.error}</Notice></Page>;
  if (!state.data) return <Page title="Apply as an expert"><Spinner /></Page>;
  const ex = state.data.expert;
  if (ex && !canApplyAgain(ex)) return <AlreadyIn expert={ex} />;
  return <ApplyForm me={state.data} invite={state.data.invite} inviteMissing={!!inviteToken && !state.data.invite} onSent={setSent} />;
}

function Sent(props: { reviewTime: string }) {
  return (
    <Page title="Thanks, we got your application" intro="Here is what happens next.">
      <Card><WhatNext reviewTime={props.reviewTime} /></Card>
      <div class="row exp-actions">
        <Button href="/expert">See your status</Button>
        <Button kind="secondary" href="/agents">Meet the agents</Button>
      </div>
    </Page>
  );
}

function AlreadyIn(props: { expert: ExpertView }) {
  const e = props.expert;
  const text = e.status === "approved" ? "You are an approved expert. Your dashboard shows how your agents are doing."
    : e.status === "applied" ? "You have already applied. We will email you when we have reviewed it."
    : e.status === "paused" ? "Your expert account is on hold. Your expert page has the details."
    : `You can apply again from ${longDate(e.can_reapply_at)}.`;
  return (
    <Page title="Apply as an expert">
      <Notice tone="info">{text}</Notice>
      <div class="row">
        <Button href="/expert">{e.status === "approved" ? "Open your dashboard" : "See your status"}</Button>
        {e.status === "approved" && <Button kind="secondary" href="/studio">Build an agent</Button>}
      </div>
    </Page>
  );
}

type Claim = { text: string; evidence_url: string };

function ApplyForm(props: { me: ExpertMe; invite: { token: string; invite: PublicInviteView } | null; inviteMissing: boolean; onSent: (reviewTime: string) => void }) {
  const auth = useAuth();
  const prev = props.me.expert?.application ?? null;
  const inv = props.invite?.invite ?? null;
  const catalogue = useLoad(() => api<CatalogueList>("/api/catalogue"), []);
  const agreement = useLoad(() => api<{ agreement: Agreement }>("/api/experts/agreement"), []);

  const [name, setName] = useState(prev?.display_name ?? inv?.name ?? auth.me?.user.name ?? "");
  const [headline, setHeadline] = useState(prev?.headline ?? "");
  const [areas, setAreas] = useState<Area[]>((prev?.areas as Area[] | undefined) ?? (inv?.areas as Area[] | undefined)?.slice(0, MAX_AREAS) ?? []);
  const [jobTypes, setJobTypes] = useState<string[]>(prev?.job_types ?? inv?.job_types.slice(0, MAX_JOBS) ?? []);
  const [experience, setExperience] = useState(prev?.experience ?? "");
  const [claims, setClaims] = useState<Claim[]>(prev?.claims?.length ? prev.claims : [{ text: "", evidence_url: "" }]);
  const [samples, setSamples] = useState((prev?.sample_links ?? []).join("\n"));
  const [country, setCountry] = useState(prev?.country ?? "");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const groups = useMemo(() => {
    const list = catalogue.data?.job_types ?? [];
    const order = [...areas, ...AREAS.filter(a => !areas.includes(a))];
    return order.map(area => ({ area, jobs: list.filter(j => j.area === area) })).filter(g => g.jobs.length);
  }, [catalogue.data, areas]);

  const toggleArea = (a: Area) => setAreas(list => list.includes(a) ? list.filter(x => x !== a) : list.length >= MAX_AREAS ? list : [...list, a]);
  const toggleJob = (id: string) => setJobTypes(list => list.includes(id) ? list.filter(x => x !== id) : list.length >= MAX_JOBS ? list : [...list, id]);
  const setClaim = (i: number, patch: Partial<Claim>) => setClaims(list => list.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const sampleList = () => samples.split(/\s*\n\s*/).map(s => s.trim()).filter(Boolean);

  function check(): Record<string, string> {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Fill in your name.";
    if (headline.trim().length < 5) e.headline = "Add one line on what you do and who for.";
    if (!areas.length) e.areas = "Pick at least one area.";
    if (!jobTypes.length) e.jobs = "Pick at least one job.";
    if (experience.trim().length < 40) e.experience = "Tell us a bit more: a few sentences is enough.";
    const filled = claims.filter(c => c.text.trim() || c.evidence_url.trim());
    if (!filled.length) e.claims = "Add at least one claim with a link that shows it.";
    else if (filled.some(c => c.text.trim().length < 5)) e.claims = "Fill in each claim, or remove it.";
    else if (filled.some(c => !isHttps(c.evidence_url.trim()))) e.claims = "Each claim needs a link that starts with https://.";
    const s = sampleList();
    if (s.length > MAX_SAMPLES) e.samples = `Add up to ${MAX_SAMPLES} links.`;
    else if (s.some(l => !isHttps(l))) e.samples = "Each link must start with https://.";
    if (country.trim().length < 2) e.country = "Tell us which country you work from.";
    if (!agree) e.agree = "Tick the box to agree to the draft agreement.";
    return e;
  }

  async function submit(ev: Event) {
    ev.preventDefault();
    const found = check();
    setErrors(found);
    setServerError(null);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      const res = await api<{ expert: ExpertView; review_time: string }>("/api/experts/apply", {
        body: {
          display_name: name.trim(), headline: headline.trim(), areas, job_types: jobTypes, experience: experience.trim(),
          claims: claims.filter(c => c.text.trim() || c.evidence_url.trim()).map(c => ({ text: c.text.trim(), evidence_url: c.evidence_url.trim() })),
          sample_links: sampleList(), country: country.trim(), agree,
          ...(props.invite ? { invite_token: props.invite.token } : {}),
        },
      });
      await auth.refreshMe();
      window.scrollTo(0, 0);
      props.onSent(res.review_time);
    } catch (err: any) {
      setServerError(err?.message ?? "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const hasErrors = Object.keys(errors).length > 0;
  return (
    <Page title="Apply as an expert" intro="Tell us how you work. If we approve you, you turn your method into an AI agent that buyers can hire.">
      {props.me.expert?.status === "rejected" && <Notice tone="info">Your last answers are filled in. Change what our team asked for, then send it again.</Notice>}
      {inv && <Notice tone="good" title={`Welcome, ${inv.first_name}`}>You are applying with your founding invite. We filled in what we know. Check it and add the rest.</Notice>}
      {props.inviteMissing && <Notice tone="info">Your invite link did not work, or it was already used. You can still apply here.</Notice>}
      <form class="exp-form" onSubmit={submit} noValidate>
        <Card title="About you">
          <Field label="Your name" id="exp-name" error={errors.name}>
            <Input id="exp-name" value={name} onValue={setName} maxLength={80} autoComplete="name" />
          </Field>
          <Field label="Headline" id="exp-headline" help="One line on what you do and who for. For example: Conversion copywriter for software companies." error={errors.headline}>
            <Input id="exp-headline" value={headline} onValue={setHeadline} maxLength={140} />
          </Field>
          <Field label="Country you work from" id="exp-country" error={errors.country}>
            <Input id="exp-country" value={country} onValue={setCountry} maxLength={60} autoComplete="country-name" />
          </Field>
        </Card>

        <Card title="What you are good at">
          <fieldset class="exp-fieldset">
            <legend class="field-label">Your areas</legend>
            <p class="field-help">Pick up to {MAX_AREAS}.</p>
            <div class="exp-chips">
              {AREAS.map(a => (
                <button type="button" class="exp-chip" aria-pressed={areas.includes(a)} onClick={() => toggleArea(a)}
                  disabled={!areas.includes(a) && areas.length >= MAX_AREAS}>
                  {AREA_LABELS[a]}
                </button>
              ))}
            </div>
            {errors.areas && <p class="field-error" role="alert">{errors.areas}</p>}
          </fieldset>

          <fieldset class="exp-fieldset">
            <legend class="field-label">Jobs you want to build an agent for</legend>
            <p class="field-help">Pick up to {MAX_JOBS} from our job menu. You can build one agent per job.</p>
            {catalogue.error && <Notice tone="bad">{catalogue.error}</Notice>}
            {!catalogue.data && !catalogue.error && <Spinner label="Loading the job menu..." />}
            {groups.map(g => {
              const picked = g.jobs.filter(j => jobTypes.includes(j.id)).length;
              return (
                <details class="exp-group" open={areas.includes(g.area)}>
                  <summary>
                    <span>{AREA_LABELS[g.area]}</span>
                    {picked > 0 && <span class="badge badge-good">{picked} picked</span>}
                  </summary>
                  <div class="exp-jobs">
                    {g.jobs.map(j => (
                      <label class="exp-job">
                        <input type="checkbox" checked={jobTypes.includes(j.id)} onChange={() => toggleJob(j.id)}
                          disabled={!jobTypes.includes(j.id) && jobTypes.length >= MAX_JOBS} />
                        <span><b>{j.title}</b><span class="muted small">{j.summary}</span></span>
                      </label>
                    ))}
                  </div>
                </details>
              );
            })}
            {errors.jobs && <p class="field-error" role="alert">{errors.jobs}</p>}
          </fieldset>

          <Field label="Your experience" id="exp-experience" help="How many years, what kind of work, and who it was for. A few sentences is enough." error={errors.experience}>
            <TextArea id="exp-experience" value={experience} onValue={setExperience} rows={5} maxLength={3000} />
          </Field>
        </Card>

        <Card title="Proof of your work">
          <fieldset class="exp-fieldset">
            <legend class="field-label">Claims we can check</legend>
            <p class="field-help">Things you have done, each with a link that shows it. Up to {MAX_CLAIMS}.</p>
            {claims.map((c, i) => (
              <div class="exp-claim">
                <Input aria-label={`Claim ${i + 1}`} value={c.text} onValue={v => setClaim(i, { text: v })} maxLength={300}
                  placeholder="What you did, for example: Wrote the launch page for a booking app" />
                <Input aria-label={`Link for claim ${i + 1}`} value={c.evidence_url} onValue={v => setClaim(i, { evidence_url: v })} maxLength={500}
                  placeholder="https://" inputMode="url" type="url" />
                {claims.length > 1 && <Button kind="ghost" small onClick={() => setClaims(list => list.filter((_, j) => j !== i))}>Remove</Button>}
              </div>
            ))}
            {claims.length < MAX_CLAIMS && <Button kind="secondary" small onClick={() => setClaims(list => [...list, { text: "", evidence_url: "" }])}>Add another claim</Button>}
            {errors.claims && <p class="field-error" role="alert">{errors.claims}</p>}
          </fieldset>

          <Field label="Links to samples of your work (optional)" id="exp-samples" help={`One link per line, up to ${MAX_SAMPLES}. Each starts with https://.`} error={errors.samples}>
            <TextArea id="exp-samples" value={samples} onValue={setSamples} rows={3} />
          </Field>
        </Card>

        <Card title="The founding expert agreement">
          {agreement.error && <Notice tone="bad">{agreement.error}</Notice>}
          {agreement.data && (
            <details class="exp-agreement">
              <summary>Read the agreement (draft)</summary>
              <Notice tone="warn" title="This is a draft">{agreement.data.agreement.draft_notice}</Notice>
              {agreement.data.agreement.sections.map(s => (
                <div class="exp-agreement-part"><h3>{s.heading}</h3><p>{s.body}</p></div>
              ))}
            </details>
          )}
          <label class="exp-check">
            <input type="checkbox" checked={agree} onChange={e => setAgree((e.target as HTMLInputElement).checked)} />
            <span>I have read the draft agreement and I agree to it.</span>
          </label>
          {errors.agree && <p class="field-error" role="alert">{errors.agree}</p>}
        </Card>

        {hasErrors && <Notice tone="bad">Fix the items marked in red, then send it again.</Notice>}
        {serverError && <Notice tone="bad">{serverError}</Notice>}
        <div class="row exp-actions">
          <Button type="submit" busy={busy}>Send application</Button>
          <span class="muted small">We will email you within {props.me.review_time}.</span>
        </div>
      </form>
    </Page>
  );
}
