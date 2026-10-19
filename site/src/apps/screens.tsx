// The app screens, drawn in Mercatura's look with HTML and CSS: nothing on them runs.
// Mercatura Ads uses Sprout's example ad results (knowledge/example-businesses/sprout/ad-results.csv);
// any other number is made up to show the layout, and the page says so.
import type { ReactNode } from "react";

// ad name, format, opening line, days live, spend, impressions, link clicks, purchases, revenue (Sprout, example data)
const RAW: [string, string, string, number, number, number, number, number, number][] = [
  ["T1 Tummy", "Video 28s", "Fix the bloated tummy", 30, 4200, 300000, 4950, 198, 8336],
  ["P1 Too expensive", "Image", "“Sprout is too expensive”: here's 61% off to prove otherwise", 21, 3000, 250000, 3750, 112, 3830],
  ["P1 Too expensive, weeks 4 to 6", "Image", "“Sprout is too expensive”: here's 61% off to prove otherwise", 21, 3000, 193500, 1780, 39, 1334],
  ["P2 Don't pay full price", "Image", "Don't pay full price. You don't have to.", 30, 2500, 227300, 5569, 50, 1555],
  ["H1 One step", "Video 20s", "One step I never skip", 16, 1300, 96300, 1300, 44, 2015],
  ["K1 Fiber kids", "Video 15s", "Fiber kids won't fight", 30, 2200, 169200, 2030, 63, 3062],
  ["F1 Fiber question", "Carousel", "Struggling to get enough fiber?", 30, 1800, 138500, 1524, 46, 1858],
  ["S1 Trusted by 1M", "Image", "Trusted by 1M+: take 61% off", 30, 1600, 128000, 1600, 38, 1254],
  ["W1 Muscle", "Image", "Support muscle while you lose weight", 14, 900, 64300, 900, 23, 1024],
  ["R1 Runner", "Image", "The daily nutrition every runner forgets", 30, 1000, 76900, 538, 10, 400],
];
type Verdict = "Scale" | "Watch" | "Cut";
const ADS = RAW.map(([name, format, line, days, spend, impr, clicks, buys, rev], i) => {
  const roas = rev / spend;
  const verdict: Verdict = roas >= 1.5 ? "Scale" : roas >= 1 ? "Watch" : "Cut";
  return { i, name, format, line, days, spend, impr, clicks, buys, rev, roas, cpa: spend / buys, ctr: clicks / impr, verdict, tired: name.includes("weeks 4") };
});
const sum = (k: "spend" | "impr" | "clicks" | "buys" | "rev") => ADS.reduce((a, x) => a + x[k], 0);
const T = { spend: sum("spend"), impr: sum("impr"), clicks: sum("clicks"), buys: sum("buys"), rev: sum("rev") };
const usd = (n: number, d = 0) => `$${n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}`;
const x2 = (n: number) => `${n.toFixed(2)}×`;
const pct = (n: number, d = 1) => `${(n * 100).toFixed(d)}%`;

/* ---------- parts ---------- */
const Kpi = ({ label, value, note }: { label: string; value: string; note?: string }) => (
  <div className="mc-kpi"><span>{label}</span><b>{value}</b>{note && <i>{note}</i>}</div>
);
const Card = ({ title, children, span, tone }: { title?: string; children: ReactNode; span?: 4 | 6 | 8 | 12; tone?: "dark" | "soft" }) => (
  <section className={`mc-card${tone ? ` ${tone}` : ""}`} style={span ? { gridColumn: `span ${span}` } : undefined}>
    {title && <h4>{title}</h4>}
    {children}
  </section>
);
const Chip = ({ children, tone }: { children: ReactNode; tone?: "good" | "warn" | "bad" | "blue" }) => <span className={`mc-chip${tone ? ` ${tone}` : ""}`}>{children}</span>;
const Btn = ({ children, ghost }: { children: ReactNode; ghost?: boolean }) => <span className={`mc-btn${ghost ? " mc-ghost" : ""}`}>{children}</span>;
const Bars = ({ rows, unit = "" }: { rows: [string, number][]; unit?: string }) => {
  const max = Math.max(...rows.map((r) => r[1]));
  return (
    <div className="mc-bars">
      {rows.map(([l, v]) => (
        <div key={l}><span>{l}</span><i style={{ width: `${(v / max) * 100}%` }} /><b>{unit === "$" ? usd(v) : unit === "x" ? x2(v) : `${v}${unit}`}</b></div>
      ))}
    </div>
  );
};
const Table = ({ head, rows }: { head: string[]; rows: ReactNode[][] }) => (
  <div className="mc-table-wrap">
    <table className="mc-table">
      <thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
    </table>
  </div>
);
const tone = (v: Verdict) => (v === "Scale" ? "good" : v === "Watch" ? "warn" : "bad");
/** A stand-in for the ad's picture: the brand's green, the format and the opening line. */
const Thumb = ({ ad, small }: { ad: (typeof ADS)[number]; small?: boolean }) => (
  <div className={`mc-thumb f${ad.i % 4}${small ? " small" : ""}`} aria-hidden="true">
    <span className="mc-thumb-fmt">{ad.format}</span>
    <span className="mc-thumb-line">{ad.line}</span>
  </div>
);
const Grid = ({ children }: { children: ReactNode }) => <div className="mc-grid">{children}</div>;
const Head = ({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) => (
  <div className="mc-head"><div><h3>{title}</h3>{sub && <p>{sub}</p>}</div>{right && <div className="mc-head-r">{right}</div>}</div>
);
const Dates = () => <div className="mc-dates"><Chip>Last 30 days</Chip><Chip>Compare: on</Chip><Chip>Filters · 1</Chip></div>;

/* ---------- Mercatura Ads ---------- */
const best = [...ADS].sort((a, b) => b.roas - a.roas);
const bySpend = [...ADS].sort((a, b) => b.spend - a.spend);

function Overview() {
  const sales = 61200; // made up: website sales for the same 30 days
  return (
    <>
      <Head title="Overview" sub="Sprout · last 30 days" right={<Dates />} />
      <Grid>
        <Card span={8} tone="dark">
          <div className="mc-hero-num"><span>Website sales</span><b>{usd(sales)}</b><i>up 8% on the 30 days before</i></div>
          <div className="mc-spark" aria-hidden="true">{[38, 42, 40, 47, 45, 52, 49, 55, 51, 58, 60, 57, 63, 61].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
        </Card>
        <Card span={4} title="Money flow">
          <div className="mc-kpis col"><Kpi label="Ad spend" value={usd(T.spend)} /><Kpi label="Sales the ads claim" value={usd(T.rev)} /><Kpi label="Sales per $1 of ads" value={usd(sales / T.spend, 2)} /></div>
        </Card>
        <Card span={4} title="Where sales come from"><Bars unit="%" rows={[["Ads", 40], ["Search", 24], ["Email and texts", 21], ["Direct", 15]]} /></Card>
        <Card span={4} title="Best day to spend"><Bars unit="x" rows={[["Mon", 1.31], ["Tue", 1.22], ["Wed", 1.08], ["Thu", 1.02], ["Fri", 0.94], ["Sat", 1.12], ["Sun", 1.27]]} /></Card>
        <Card span={4} title="Alerts">
          <ul className="mc-list">
            <li><Chip tone="bad">Tired</Chip> “Too expensive” fell from {x2(ADS[1].roas)} to {x2(ADS[2].roas)} in its second three weeks.</li>
            <li><Chip tone="warn">Gap</Chip> Kids gummies sell well, but only one ad shows them.</li>
            <li><Chip tone="good">Lean in</Chip> {best[0].name} returns {x2(best[0].roas)}. It can take more budget.</li>
          </ul>
        </Card>
        <Card span={12} title="Top ads by spend">
          <div className="mc-strip">{bySpend.slice(0, 5).map((a) => <div key={a.i} className="mc-strip-ad"><Thumb ad={a} small /><b>{a.name}</b><span>{usd(a.spend)} · {x2(a.roas)}</span></div>)}</div>
        </Card>
      </Grid>
    </>
  );
}

function Gallery() {
  return (
    <>
      <Head title="Ad gallery" sub={`${ADS.length} ads · last 30 days`} right={<Btn ghost>Export CSV</Btn>} />
      <div className="mc-kpis">
        <Kpi label="Spend" value={usd(T.spend)} /><Kpi label="Purchase value" value={usd(T.rev)} /><Kpi label="Purchases" value={String(T.buys)} />
        <Kpi label="Cost per purchase" value={usd(T.spend / T.buys, 2)} /><Kpi label="Return" value={x2(T.rev / T.spend)} /><Kpi label="Link click rate" value={pct(T.clicks / T.impr, 2)} />
      </div>
      <div className="mc-filters"><Chip tone="blue">Top by spend</Chip><Chip>Format: all</Chip><Chip>Verdict: all</Chip><Chip>Min spend $500</Chip><Chip>Campaign: all</Chip></div>
      <div className="mc-ads">
        {bySpend.map((a, n) => (
          <article key={a.i} className="mc-ad">
            <div className="mc-ad-pic"><Thumb ad={a} /><span className="mc-rank">#{n + 1} by spend</span><span className={`mc-corner ${tone(a.verdict)}`}>{a.verdict}</span></div>
            <b className="mc-ad-name">{a.name}</b>
            <div className="mc-chips"><Chip tone={tone(a.verdict)}>{a.verdict}</Chip><Chip>{a.format}</Chip>{a.tired && <Chip tone="bad">Tired</Chip>}{a.line.includes("61%") && <Chip>Sale</Chip>}</div>
            <dl className="mc-ad-stats"><div><dt>Spend</dt><dd>{usd(a.spend)}</dd></div><div><dt>Purchases</dt><dd>{a.buys}</dd></div><div><dt>Cost each</dt><dd>{usd(a.cpa, 2)}</dd></div><div><dt>Return</dt><dd>{x2(a.roas)}</dd></div></dl>
            <span className="mc-ad-more"><span className="mc-box" />Compare <span className="mc-link">View more</span></span>
          </article>
        ))}
      </div>
    </>
  );
}

function AdUpClose() {
  const a = ADS[1], b = ADS[2];
  return (
    <>
      <Head title="Ad gallery" sub="View more" />
      <div className="mc-panel-wrap">
        <div className="mc-dim" aria-hidden="true">{bySpend.slice(0, 4).map((x) => <Thumb key={x.i} ad={x} small />)}</div>
        <aside className="mc-panel">
          <div className="mc-panel-top"><Thumb ad={a} small /><div><b>{a.name}</b><p>{a.line}</p><div className="mc-chips"><Chip tone="warn">Watch</Chip><Chip tone="bad">Tired</Chip><Chip>Sale</Chip></div></div></div>
          <h4>Results, first three weeks and the next three</h4>
          <Table head={["", "Weeks 1 to 3", "Weeks 4 to 6"]} rows={[["Return", x2(a.roas), x2(b.roas)], ["Cost per purchase", usd(a.cpa, 2), usd(b.cpa, 2)], ["Link click rate", pct(a.ctr, 2), pct(b.ctr, 2)], ["Purchases", a.buys, b.buys]]} />
          <h4>Why it performed this way <Chip tone="blue">AI</Chip></h4>
          <div className="mc-ai">
            <p><b>Why:</b> it names the doubt buyers already have (the price) and answers it with the deal in the same line.</p>
            <p><b>Keep:</b> the quote-style opening. It stops people who think it costs too much.</p>
            <p><b>Test next:</b> the same opening with the price per day instead of the discount.</p>
            <p><b>Watch out:</b> the click rate halved in weeks 4 to 6. The same people saw it too often.</p>
          </div>
          <h4>New versions of this ad <Chip tone="blue">AI</Chip></h4>
          <div className="mc-variants">{["Price per day", "Before and after the deal", "A buyer's text message"].map((v, i) => <div key={v} className={`mc-var f${i}`}><span>{v}</span></div>)}</div>
          <div className="mc-row"><Btn>Make 3 versions</Btn><Btn ghost>Add note</Btn></div>
        </aside>
      </div>
    </>
  );
}

function Plan() {
  const tests = [
    { t: "Kids gummies, a second ad", why: `${ADS[5].name} returns ${x2(ADS[5].roas)}, and it's the only kids ad.`, test: "Two new kids videos with a parent talking to camera.", money: "$600 over 7 days", win: "Return above 1.3× after 40 purchases", stop: "Cost per purchase above $45 after $300" },
    { t: "Price per day, not % off", why: "Discount ads tire fast: one fell by two thirds after three weeks.", test: "The “too expensive” opening, with “$1.78 a day” instead of “61% off”.", money: "$500 over 7 days", win: "Click rate holds above 1.4% in week 2", stop: "Return below 0.9× after $250" },
    { t: "Move spend to Monday and Sunday", why: "Monday and Sunday return the most per dollar.", test: "Shift 15% of Friday's budget to Monday and Sunday.", money: "No new spend, 14 days", win: "Same sales for less spend", stop: "Weekly sales drop more than 5%" },
  ];
  return (
    <>
      <Head title="Action plan" sub="Tests to run this week, best first" />
      <div className="mc-tests">
        {tests.map((x, i) => (
          <article key={x.t} className="mc-test">
            <div className="mc-test-top"><span className="mc-n">{i + 1}</span><b>{x.t}</b><Chip>{x.money}</Chip></div>
            <dl><div><dt>Why</dt><dd>{x.why}</dd></div><div><dt>The test</dt><dd>{x.test}</dd></div><div><dt>Win rule</dt><dd>{x.win}</dd></div><div><dt>Stop rule</dt><dd>{x.stop}</dd></div></dl>
            <div className="mc-row"><Btn>Add to tests</Btn><Btn ghost>Copy brief</Btn><Btn ghost>Make the creative</Btn></div>
          </article>
        ))}
      </div>
    </>
  );
}

function Buyer() {
  return (
    <>
      <Head title="Buyer desk" sub="What to change in the ad account today. This screen never changes it for you." />
      <Grid>
        <Card span={12} title="Morning brief">
          <ul className="mc-list"><li>Spend yesterday was on plan. Return held at {x2(T.rev / T.spend)}.</li><li>One ad is tired. Pause it and start its new version.</li><li>Sunday is next. Move budget in tonight.</li></ul>
        </Card>
        <Card span={12} title="Budget moves">
          <Table head={["Campaign", "Now a day", "New a day", "Move", "Why"]} rows={[
            ["Prospecting · video", "$140", "$170", <Chip tone="good">Lean in</Chip>, `Best return in the account (${x2(best[0].roas)})`],
            ["Prospecting · kids", "$70", "$85", <Chip tone="good">Lean in</Chip>, "Steady cost per purchase"],
            ["Retargeting · offers", "$100", "$100", <Chip tone="warn">Watch</Chip>, "Fine, but tiring"],
            ["Prospecting · images", "$120", "$80", <Chip tone="bad">Cut</Chip>, "Two ads below 0.8×"],
          ]} />
        </Card>
        <Card span={12} title="Ad check-up">
          <Table head={["Ad", "What's wrong", "Fix"]} rows={[[ADS[2].name, "Seen too often, clicks halved", "Pause; start the price-per-day version"], [ADS[9].name, "Few clicks for the spend", "Cut, or test a new opening line"]]} />
        </Card>
      </Grid>
    </>
  );
}

function Health() {
  const checks: [string, string, "good" | "warn" | "bad"][] = [["Tracking", "Orders match within 6%", "good"], ["Tired ads", "1 ad seen too often", "bad"], ["Changes", "3 changes this week", "warn"], ["Set-up", "Learning is fine", "good"], ["What sells", "Videos with a face win", "good"]];
  return (
    <>
      <Head title="Account health" sub="Five checks, once a week" />
      <div className="mc-checks">{checks.map(([n, s, t], i) => <div key={n} className={`mc-check${i === 1 ? " on" : ""}`}><Chip tone={t}>{t === "good" ? "OK" : t === "warn" ? "Look" : "Fix"}</Chip><b>{n}</b><span>{s}</span></div>)}</div>
      <Card title="Tired ads: how often each person saw it, and clicks over 4 weeks">
        <Table head={["Ad", "Seen per person", "Week 1", "Week 2", "Week 3", "Week 4"]} rows={[
          [ADS[1].name, "3.9", "1.7%", "1.5%", "1.1%", <Chip tone="bad">0.8%</Chip>],
          [ADS[0].name, "2.1", "1.6%", "1.7%", "1.6%", "1.6%"],
          [ADS[5].name, "1.8", "1.1%", "1.2%", "1.2%", "1.3%"],
        ]} />
        <p className="mc-small">Next in the queue for the creative team: two new versions of “Too expensive”.</p>
      </Card>
    </>
  );
}

function Studio() {
  return (
    <>
      <Head title="Creative studio" sub="Every new ad starts here" />
      <Grid>
        <Card span={6} title="Brand kit">
          <dl className="mc-dl">
            <div><dt>Voice</dt><dd>Warm, a bit cheeky, never preachy</dd></div>
            <div><dt>Claims we can use</dt><dd>60+ ingredients · 6 g of fiber in one pack</dd></div>
            <div><dt>Avoid</dt><dd>“Cures”, “detox”, any weight-loss promise</dd></div>
            <div><dt>Photos</dt><dd>Real hands, bright daylight, the pack open</dd></div>
          </dl>
        </Card>
        <Card span={6} title="Make versions from a reference">
          <div className="mc-drop"><span>Drop, paste or choose an image</span></div>
          <div className="mc-row"><Chip tone="blue">A layout to borrow</Chip><Chip>The product to show</Chip></div>
          <div className="mc-row"><Btn>Make 4 versions</Btn></div>
        </Card>
        <Card span={12} title="Test tracker">
          <Table head={["Test", "From ad", "Launched", "Status", "Result so far"]} rows={[["Price per day", ADS[1].name, "Mon", <Chip tone="warn">Running</Chip>, "Click rate 1.6%"], ["Parent to camera", ADS[5].name, "Tue", <Chip tone="warn">Running</Chip>, "Too early"], ["Runner, new opening", ADS[9].name, "Last week", <Chip tone="bad">Stopped</Chip>, "Hit the stop rule"]]} />
        </Card>
      </Grid>
    </>
  );
}

function Rivals() {
  return (
    <>
      <Head title="Competitors" sub="What they run right now, from the public ad library" />
      <div className="mc-filters"><Chip tone="blue">All brands</Chip><Chip>Rival A · 42</Chip><Chip>Rival B · 18</Chip><Chip>Rival C · 9</Chip></div>
      <Card title="Brands side by side">
        <Table head={["Brand", "Live ads", "Mostly", "Longest live", "New in 14 days", "Pushes an offer"]} rows={[["Rival A", 42, "Video", "212 days", 11, "Yes"], ["Rival B", 18, "Image", "96 days", 3, "Yes"], ["Rival C", 9, "Carousel", "41 days", 4, "No"]]} />
      </Card>
      <Card title="Ideas worth borrowing">
        <ul className="mc-list">
          <li><Chip tone="blue">Score 8</Chip> Rival A's “doctor explains the label” video: live 212 days, 14 versions. A sign it works, not proof.</li>
          <li><Chip tone="blue">Score 6</Chip> Rival B's side-by-side with a powder: live 96 days, 6 versions.</li>
        </ul>
        <div className="mc-row"><Btn ghost>Use as reference</Btn></div>
      </Card>
    </>
  );
}

function Report() {
  return (
    <>
      <Head title="Client report" right={<div className="mc-row"><Chip tone="blue">Client view</Chip><Chip>Team view</Chip><Btn>Download report</Btn></div>} />
      <div className="mc-paper">
        <p className="mc-eyebrow">Prepared for Sprout by Your Agency</p>
        <h3 className="mc-serif">Your month in one page</h3>
        <div className="mc-kpis"><Kpi label="Ad spend" value={usd(T.spend)} /><Kpi label="Purchases from ads" value={String(T.buys)} /><Kpi label="Return" value={x2(T.rev / T.spend)} /></div>
        <h4>Ads that worked</h4><p>{best.slice(0, 2).map((a) => `${a.name} (${x2(a.roas)})`).join(" and ")}.</p>
        <h4>What we'll do next</h4><p>Give the best video more budget, add a second kids ad, and test the price per day.</p>
        <h4>Your to-do list</h4><p>Approve two new scripts by Thursday.</p>
      </div>
    </>
  );
}

/* ---------- Mercatura Creative Studio ---------- */
function CsHome() {
  const steps = ["Build the brand brain", "Read the brand's look", "Add product photos", "Write your first scripts", "Bring in what customers say", "Read the insights", "Make the first image ads"];
  return (
    <>
      <div className="mc-hello"><h3 className="mc-serif big">What are we making today?</h3>
        <div className="mc-ask">Five video ads for Sprout Kids, for busy parents<span>Say it or type it. Ctrl + Enter makes it.</span></div>
        <div className="mc-row"><Chip>Product: Kids</Chip><Chip>Buyer: busy parents</Chip><Chip>Angle: no fights</Chip><Chip>Offer: first order</Chip><Chip>Format: selfie video</Chip></div>
      </div>
      <ol className="mc-steps">{steps.map((s, i) => <li key={s} className={i < 3 ? "done" : i === 3 ? "now" : ""}><span>{i + 1}</span>{s}</li>)}</ol>
      <Grid>
        <Card span={6} title="Needs you"><ul className="mc-list"><li>3 scripts wait for approval</li><li>1 image set is ready to review</li></ul></Card>
        <Card span={6} title="Working now"><div className="mc-progress"><i style={{ width: "62%" }} /></div><p className="mc-small">Writing 5 scripts · step 3 of 5</p></Card>
      </Grid>
    </>
  );
}
function CsBrain() {
  return (
    <>
      <Head title="Brand brain" sub="Sprout" right={<Chip tone="good">82% complete</Chip>} />
      <div className="mc-tabs"><b>Who they are</b><span>What they offer</span><span>Where they stand</span><span>Against them</span></div>
      <Grid>
        <Card span={8} title="What every writer is told">
          <ul className="mc-list"><li>Sprout makes daily greens gummies in single packs. No water, no shaker.</li><li>People quit supplements because they're unpleasant. Sprout is one they want to eat.</li><li>Say “supports”, never “cures”. Quote the label for numbers.</li></ul>
        </Card>
        <Card span={4} title="How complete it is"><Bars unit="%" rows={[["Facts", 95], ["Voice", 90], ["Offers", 70], ["Proof", 60]]} /></Card>
        <Card span={12} title="Read the website"><div className="mc-input">sprout.example</div><div className="mc-row"><Btn>Read the website</Btn><Btn ghost>Paste what you have</Btn></div></Card>
      </Grid>
    </>
  );
}
function CsInsights() {
  return (
    <>
      <Head title="Insights" sub="From 20 reviews" right={<Btn ghost>Re-cluster</Btn>} />
      <Card title="Themes, strongest first">
        <Table head={["Theme", "How often", "How strong", "A quote"]} rows={[
          ["I can finally stick with it", "6", <Chip tone="good">High</Chip>, "“The one thing I've been able to stick to.”"],
          ["Better digestion", "5", <Chip tone="good">High</Chip>, "“Feel lighter, less bloated.”"],
          ["Tastes like a treat", "4", <Chip tone="warn">Medium</Chip>, "“Like mixed berries!”"],
          ["Costs a lot", "3", <Chip tone="warn">Medium</Chip>, "From review sites"],
        ]} />
        <p className="mc-small">Every quote links to where it came from.</p>
      </Card>
    </>
  );
}
function CsScripts() {
  return (
    <>
      <Head title="Scripts" sub="A script is 6 choices" right={<Btn>Write scripts</Btn>} />
      <Table head={["Script", "Format", "Status", "Checks", "Read time"]} rows={[
        ["No more shaker bottle", "Selfie video", <Chip tone="good">Approved</Chip>, "All passed", "24 s"],
        ["The one I stick to", "Selfie video", <Chip tone="warn">Needs you</Chip>, "1 failed: a claim", "21 s"],
        ["Fiber kids won't fight", "Kids video", <Chip tone="warn">Needs you</Chip>, "All passed", "15 s"],
        ["Price per day", "Image", <Chip>Draft</Chip>, "Not run", "-"],
      ]} />
      <Card title="Check that failed"><p>“Fixes your gut” is a health claim the label doesn't back. Try “supports digestion”.</p><div className="mc-row"><Btn>Use the fix</Btn><Btn ghost>Keep mine</Btn></div></Card>
    </>
  );
}
function CsCreate() {
  return (
    <>
      <Head title="Create" sub="Find your next creative direction" right={<Btn>Plan my next ads</Btn>} />
      <div className="mc-tiles">{["A batch of 100 static ads", "An image set from one script", "A video from a script", "A carousel"].map((t, i) => <div key={t} className={`mc-tile f${i}`}><b>{t}</b><span>Start</span></div>)}</div>
      <Card title="Your creations"><div className="mc-strip">{bySpend.slice(0, 5).map((a) => <div key={a.i} className="mc-strip-ad"><Thumb ad={a} small /><b>{a.format}</b><span>Approved</span></div>)}</div></Card>
    </>
  );
}
function CsProduction() {
  const cols: [string, string[]][] = [["Draft", ["Runner, new opening"]], ["Queued", ["Kids, parent to camera"]], ["Running", ["The one I stick to"]], ["Waiting for approval", ["No more shaker bottle"]], ["Approved", ["Fiber kids won't fight"]]];
  return (
    <>
      <Head title="Production" sub="Paid steps run only when you click" right={<Btn>Make assets</Btn>} />
      <div className="mc-board">{cols.map(([c, items]) => <div key={c} className="mc-col"><h5>{c}</h5>{items.map((x) => <div key={x} className="mc-job"><b>{x}</b><span>Brief → script → images → storyboard → clips</span></div>)}</div>)}</div>
    </>
  );
}

/* ---------- Mercatura Landing Pages ---------- */
function LpIntake() {
  return (
    <>
      <Head title="What are we improving?" sub="CRO Studio" />
      <Grid>
        <Card span={8} title="Start from"><div className="mc-input">The ad: “No more shaker bottle”</div><div className="mc-row"><Chip tone="blue">An ad</Chip><Chip>A page</Chip><Chip>A product</Chip></div><div className="mc-row"><Btn>Start</Btn></div></Card>
        <Card span={4} title="Recent projects"><ul className="mc-list"><li>Kids page · version B</li><li>First-order offer page</li></ul></Card>
      </Grid>
    </>
  );
}
function LpBench() {
  return (
    <>
      <Head title="Workbench" sub="The page's argument, one line per section" right={<div className="mc-row"><Chip tone="blue">Laptop 1440</Chip><Chip>Phone 390</Chip></div>} />
      <div className="mc-ab">
        {["A", "B"].map((v) => (
          <div key={v} className="mc-page"><span className="mc-page-tag">Version {v}</span>
            <div className="mc-page-hero"><b>{v === "A" ? "Greens you'll want to eat" : "No shaker. No chalk. Just a pack of gummies."}</b><span className="mc-btn">Try it for $29.99</span></div>
            <i /><i /><i className="short" />
          </div>
        ))}
      </div>
      <div className="mc-row"><Btn>Replace this section with B</Btn><Btn ghost>Keep A</Btn></div>
    </>
  );
}
function LpMatch() {
  return (
    <>
      <Head title="Ad to page match" sub="Does the page keep the ad's promise?" />
      <Table head={["The ad promised", "Where the page keeps it", "Match"]} rows={[["No shaker bottle", "Hero, first line", <Chip tone="good">Same words</Chip>], ["$29.99 first order", "Price box", <Chip tone="warn">Small print missing</Chip>], ["Kids like it too", "Not on the page", <Chip tone="bad">Missing</Chip>]]} />
      <Card title="Fix"><p>Add the kids line under the hero, and show that $29.99 needs the text sign-up.</p></Card>
    </>
  );
}
function LpExport() {
  return (
    <>
      <Head title="Checks and export" />
      <div className="mc-checks">{([["Page speed", "Loads in 1.9 s on a phone", "good"], ["Claims", "All backed by the label", "good"], ["Security", "No problems", "good"], ["Offer terms", "Shown next to the price", "warn"]] as [string, string, "good" | "warn"][]).map(([n, s, t]) => <div key={n} className="mc-check"><Chip tone={t}>{t === "good" ? "OK" : "Look"}</Chip><b>{n}</b><span>{s}</span></div>)}</div>
      <div className="mc-row"><Btn>Run the checks</Btn><Btn ghost>Export to Shopify</Btn></div>
    </>
  );
}

/* ---------- Mercatura SEO ---------- */
function SeoOverview() {
  return (
    <>
      <Head title="Your next best actions" sub="SEO · Sprout" />
      <ol className="mc-steps vertical">{["Answer “greens gummies vs powder”: people search it and no page of yours answers it", "Fix the product page title: it doesn't say “gummies”", "Add the ingredient list as text, not only in a picture"].map((s, i) => <li key={s} className={i === 0 ? "now" : ""}><span>{i + 1}</span>{s}</li>)}</ol>
      <Card title="Growth plan"><Bars unit="" rows={[["Articles", 6], ["Page fixes", 9], ["New pages", 2]]} /></Card>
    </>
  );
}
function SeoAudit() {
  return (
    <>
      <Head title="Audits" right={<Btn>Audit a page</Btn>} />
      <Table head={["Page", "What's wrong", "Fix", "Effect"]} rows={[["Product page", "Title doesn't say what it is", "Put “greens gummies” first", <Chip tone="good">High</Chip>], ["Kids page", "No answer to “how many a day”", "Add a short FAQ", <Chip tone="warn">Medium</Chip>], ["Ingredients", "Facts only in an image", "Add them as text", <Chip tone="warn">Medium</Chip>]]} />
    </>
  );
}
function SeoBlog() {
  return (
    <>
      <Head title="Blog studio" sub="A blog with a reason to exist" />
      <Grid>
        <Card span={4} title="The search"><div className="mc-input">greens gummies vs powder</div><p className="mc-small">Who asks: people who gave up on powders</p></Card>
        <Card span={8} title="Draft">
          <h3 className="mc-serif">Greens gummies or powder: which one will you still take in a month?</h3>
          <p>Most people don't stop greens because of what's in them. They stop because of the shaker…</p>
          <div className="mc-row"><Chip tone="good">Voice: OK</Chip><Chip tone="good">Claims: OK</Chip><Btn>Approve</Btn></div>
        </Card>
      </Grid>
    </>
  );
}
function SeoAi() {
  return (
    <>
      <Head title="AI answers" sub="What AI assistants say when someone asks about you" />
      <Table head={["Question", "What AI said", "Right?"]} rows={[["Is Sprout vegan?", "Yes, it uses pectin, not gelatin", <Chip tone="good">Right</Chip>], ["How much fiber is in Sprout?", "3 g per pack", <Chip tone="bad">Wrong: 6 g</Chip>], ["Is Sprout good for kids?", "Didn't know there's a kids line", <Chip tone="warn">Missing</Chip>]]} />
      <Card title="Help AI shopping tools check your facts"><p>Put the fiber count and the kids line on the product page as plain text, so tools that shop for people can read them.</p></Card>
    </>
  );
}

/* ---------- Mercatura, combined ---------- */
function MOnboarding() {
  return (
    <>
      <Head title="Start with your first client" />
      <Grid>
        <Card span={6} title="Add a brand"><div className="mc-input">Sprout</div><div className="mc-row"><Btn>Add brand</Btn></div></Card>
        <Card span={6} title="Then add"><ol className="mc-steps vertical small">{["The website", "Approved facts and prices", "Product photos", "Reviews and support tickets", "Brand guide"].map((s, i) => <li key={s} className={i === 0 ? "now" : ""}><span>{i + 1}</span>{s}</li>)}</ol></Card>
        <Card span={12} tone="soft"><p className="mc-small">This copy runs on your computer for one person. The starter pack shows how to add sign-in and teams.</p></Card>
      </Grid>
    </>
  );
}
function MSwitch() {
  return (
    <>
      <Head title="Switch apps" sub="Same brand, three jobs" />
      <div className="mc-tiles">{[["Creative Studio", "Scripts, image ads, videos"], ["Landing Pages", "Pages that keep the ad's promise"], ["SEO", "Plans, audits, articles, AI answers"]].map(([n, s], i) => <div key={n} className={`mc-tile f${i}`}><b>{n}</b><span>{s}</span></div>)}</div>
      <div className="mc-filters"><Chip>Data · soon</Chip><Chip>Ad monitoring · soon</Chip><Chip>Retention · soon</Chip></div>
    </>
  );
}
function MShared() {
  return (
    <>
      <Head title="What they share" sub="Fix a fact once, and every app uses it" />
      <div className="mc-share">
        <div className="mc-hub"><b>Brand brain</b><span>Personas · Offers · Insights · Spend caps</span></div>
        {["Creative Studio", "Landing Pages", "SEO"].map((n) => <div key={n} className="mc-spoke">{n}</div>)}
      </div>
    </>
  );
}
function MSettings() {
  return (
    <>
      <Head title="Settings" right={<div className="mc-row"><Chip tone="blue">Normal</Chip><Chip>Advanced</Chip></div>} />
      <Grid>
        <Card span={6} title="Steps: which model runs each one"><Table head={["Step", "Model"]} rows={[["Read the website", "A fast, cheap model"], ["Write scripts", "Claude"], ["Check claims", "Claude"], ["Images", "An image model"]]} /></Card>
        <Card span={6} title="Spend caps"><Table head={["Cap", "Now"]} rows={[["Text, this month", "$0 (mock mode)"], ["Images", "0"], ["Video", "$0"]]} /><p className="mc-small">At 0, nothing paid runs. Raise a cap when you're ready.</p></Card>
      </Grid>
    </>
  );
}

export const SCREENS: Record<string, () => JSX.Element> = {
  overview: Overview, gallery: Gallery, ad: AdUpClose, plan: Plan, buyer: Buyer, health: Health, studio: Studio, rivals: Rivals, report: Report,
  "cs-home": CsHome, "cs-brain": CsBrain, "cs-insights": CsInsights, "cs-scripts": CsScripts, "cs-create": CsCreate, "cs-production": CsProduction,
  "lp-intake": LpIntake, "lp-bench": LpBench, "lp-match": LpMatch, "lp-export": LpExport,
  "seo-overview": SeoOverview, "seo-audit": SeoAudit, "seo-blog": SeoBlog, "seo-ai": SeoAi,
  "m-onboarding": MOnboarding, "m-switch": MSwitch, "m-shared": MShared, "m-settings": MSettings,
};
