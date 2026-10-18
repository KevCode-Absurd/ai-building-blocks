import { Link } from "react-router-dom";
import { Arrow, RoleMark, useTitle } from "../components";
import { type Block, type Catalogue, ROLES, type Role, adImage, portLabel, useCatalogue, useExamples } from "../lib/data";

// The hero chain and the featured rows name real blocks; if a slug is missing the item is skipped.
const HERO_CHAIN: { slug: string; role: Role; name: string }[] = [
  { slug: "brand-brain-builder", role: "source", name: "Brand brain builder" },
  { slug: "customer-review-mining-to-ad-angles", role: "compress", name: "Review mining to ad angles" },
  { slug: "static-ad-copy-from-brand-brain", role: "make", name: "Static ad copywriter" },
  { slug: "image-prompt-writer", role: "render", name: "Image prompt writer" },
  { slug: "pre-launch-ad-checklist", role: "check", name: "Pre-launch ad check" },
];
const HERO_AD = "example-018";
export const START_HERE = [
  "brand-brain-builder", "customer-review-mining-to-ad-angles", "brand-voice-check", "landing-page-from-brand-brain",
  "video-ad-script-from-customer-research", "meta-ad-policy-check",
];

function pick(c: Catalogue | null, slugs: string[]) {
  return c ? slugs.map((s) => c.bySlug[s]).filter(Boolean) : [];
}

function HeroChain({ c }: { c: Catalogue | null }) {
  const real = (s: string) => c?.bySlug[s];
  return (
    <div className="chain" aria-label="Five blocks connected into a workflow that ends in a finished ad">
      <div className="chain-col">
        {HERO_CHAIN.map((n, i) => {
          const b = real(n.slug);
          return (
            <div key={n.slug}>
              {i > 0 && <div className="chain-link" style={{ animationDelay: `${0.25 + i * 0.32 - 0.1}s` }} />}
              <div className="chain-node" style={{ animationDelay: `${0.25 + i * 0.32}s` }}>
                <div className="role"><RoleMark role={b?.role ?? n.role} /></div>
                <div className="nm">{b?.name ?? n.name}</div>
                <div className="sl">{b?.slug ?? n.slug}</div>
              </div>
            </div>
          );
        })}
      </div>
      <figure className="chain-out" style={{ animationDelay: "1.9s", alignSelf: "center", margin: 0 }}>
        <img src={adImage(HERO_AD, false)} alt="A finished static ad for Grüns, made by this chain" />
        <figcaption>The finished ad. Example made from public info, not affiliated with Grüns.</figcaption>
      </figure>
    </div>
  );
}

function Anatomy({ b }: { b: Block | undefined }) {
  const name = b?.name ?? "Review Mining to Ad Angles";
  return (
    <div className="anatomy">
      <div className="part">
        <span className="tab in" /><span className="tab out" />
        <RoleMark role={b?.role ?? "compress"} />
        <div className="nm">{name}</div>
        <div className="sl">{b?.slug ?? "customer-review-mining-to-ad-angles"}</div>
        <p className="sm">{b?.summary ?? "Reads your customer reviews and returns the problems, doubts and words buyers use, ranked into angles you can write ads from."}</p>
        <div className="ports">
          <div><h5>Goes in</h5>{(b?.inputs ?? [{ type: "voc_reviews", required: true }, { type: "brand_brain", required: false }]).map((p) => <span key={p.type} className={`chip${p.required ? "" : " opt"}`}>{portLabel(p.type)}</span>)}</div>
          <div><h5>Comes out</h5>{(b?.outputs ?? [{ type: "shortlist", required: true }]).map((p) => <span key={p.type} className="chip">{portLabel(p.type)}</span>)}</div>
        </div>
      </div>
      <ul className="callouts">
        <li><b>A plain name</b><span>Every block is named for what it makes. The same name is used in the file, on the canvas and in the handoff, so an agent finds it.</span></li>
        <li><b>In and out</b><span>Each block says what it needs and what it gives back. When one block's output matches the next one's input, they connect.</span></li>
        <li><b>Steps and checks</b><span>Inside is a short SKILL.md: the steps, the exact output, and the checks that fail a weak run. If something is missing it says so instead of guessing.</span></li>
        <li><b>One role</b><span>Each block does one job in a chain, so you can see at a glance what a workflow is missing.</span></li>
      </ul>
    </div>
  );
}

export default function Home() {
  useTitle("");
  const c = useCatalogue();
  const ex = useExamples();
  const general = c?.blocks.filter((b) => b.category === "general") ?? [];
  const ecom = c?.blocks.filter((b) => b.category === "ecommerce" || b.addon) ?? [];
  const featured = pick(c, START_HERE);
  const flows = c?.blocks.filter((b) => b.category === "orchestrator").slice(0, 3) ?? [];
  const shelfList = (list: Block[]) => [...list].sort((a, b) => Number(b.category === "ecommerce") - Number(a.category === "ecommerce") || b.usedIn - a.usedIn || a.name.localeCompare(b.name)).slice(0, 5);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1 className="display">Tested parts for the work you do with AI.</h1>
            <p className="lede">A free library of skills, prompts and checks for any business. Keep the ones you like, connect them on a canvas, and download a handoff that Claude can run step by step.</p>
            <div className="hero-actions">
              <Link to="/library" className="btn btn-primary">Browse the library <Arrow /></Link>
              <Link to="/canvas" className="btn btn-quiet">Build a workflow</Link>
            </div>
            <p className="hero-note">Free, no account needed. What you save stays in your browser.</p>
          </div>
          <HeroChain c={c} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h1">Every block does one job, and says exactly how.</h2>
            <p className="lede">Prompts, skills and checks, each small enough to read in a few minutes and strict enough to give the same quality every time.</p>
          </div>
          <Anatomy b={c?.bySlug["customer-review-mining-to-ad-angles"]} />
          <div className="principles" style={{ marginTop: 96, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            {ROLES.map((r) => (
              <div key={r.id}>
                <h4><RoleMark role={r.id}>{r.name}</RoleMark></h4>
                <p>{r.does}.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h1">General first. Then made for your industry.</h2>
            <p className="lede">General blocks work for any digital business. Industry versions add the inputs, examples and wording a store, a SaaS or a service needs, without forking the block.</p>
          </div>
          <div className="shelves">
            <Link to="/library?category=general" className="shelf shelf-general">
              <span className="big">{general.length || "·"}</span>
              <h3 className="h3" style={{ marginTop: 18 }}>General</h3>
              <p className="body" style={{ margin: "10px 0 36px" }}>Brand, research, copy, pages, video and checks for any business.</p>
              <ul>{shelfList(general).map((b) => <li key={b.slug}><span>{b.name}</span><span>{b.slug}</span></li>)}</ul>
            </Link>
            <Link to="/library?category=ecommerce" className="shelf shelf-ecom">
              <span className="big">{ecom.length || "·"}</span>
              <h3 className="h3" style={{ marginTop: 18 }}>Ecommerce</h3>
              <p className="body" style={{ margin: "10px 0 36px" }}>Product photos, product pages, offers and ads for online stores. The first industry board; SaaS is next.</p>
              <ul>{shelfList(ecom).map((b) => <li key={b.slug}><span>{b.name}</span><span>{b.slug}</span></li>)}</ul>
            </Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h2 className="h1">Start here.</h2>
              <p className="lede">Six blocks most businesses can use this week, each in a few minutes.</p>
            </div>
            <div className="rows">
              {featured.map((b) => (
                <Link key={b.slug} to={`/blocks/${b.slug}`} className="row">
                  <RoleMark role={b.role} />
                  <span className="nm">{b.name}</span>
                  <span className="sm">{b.summary}</span>
                  <span className="arrow"><Arrow size={20} /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h1">Connect blocks. Download the handoff.</h2>
            <p className="lede">Put blocks on the canvas in the order you want. The download is made by plain code from your layout, so it's the same every time.</p>
          </div>
          <div className="steps">
            <div className="step"><span className="n">1</span><h3>Drag blocks in</h3><p>Pick from the library or your kits. Start from a ready-made workflow if you like.</p></div>
            <div className="step"><span className="n">2</span><h3>Connect them</h3><p>Draw a line from one block's output to the next block's input. A dashed line means the types don't quite match.</p></div>
            <div className="step"><span className="n">3</span><h3>Hand it to Claude</h3><p>Download one folder: the handoff, the workflow file and every skill. Upload it and say "follow HANDOFF.md".</p></div>
          </div>
          <div className="handoff-preview">
            <div className="tree">
              <b>weekly-ads-handoff/</b><br />
              ├─ <b>HANDOFF.md</b><br />
              ├─ workflow.json<br />
              ├─ README.txt<br />
              └─ skills/<br />
              &nbsp;&nbsp;&nbsp;├─ brand-brain-builder/SKILL.md<br />
              &nbsp;&nbsp;&nbsp;├─ customer-review-mining-to-ad-angles/SKILL.md<br />
              &nbsp;&nbsp;&nbsp;└─ image-prompt-writer/SKILL.md
            </div>
            <pre>{`# Handoff: Weekly ads

This pack runs 3 building blocks in order and ends with: image prompt.

## Before you start
- Brand brain, for step 1
- Voc reviews, for step 2

## Steps
### Step 1: Brand Brain Builder
- Skill: skills/brand-brain-builder/SKILL.md
- Produces: brand brain
- Before moving on: run the skill's Checks.

### Step 2: Review Mining to Ad Angles
- Reads: the output of step 1
…`}</pre>
          </div>
        </div>
      </section>

      {flows.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h2 className="h1">Or start from a ready-made workflow.</h2>
              <p className="lede">Each one is a chain of library blocks you can open on the canvas and change.</p>
            </div>
            <div className="rows">
              {flows.map((b) => (
                <Link key={b.slug} to={`/blocks/${b.slug}`} className="row">
                  <span className="small">{b.steps.length} steps</span>
                  <span className="nm">{b.name}</span>
                  <span className="sm">{b.summary}</span>
                  <span className="arrow"><Arrow size={20} /></span>
                </Link>
              ))}
            </div>
            <p style={{ marginTop: 28 }}><Link className="link" to="/workflows">See all workflows</Link></p>
          </div>
        </section>
      )}

      {ex && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h2 className="h1">What the blocks make.</h2>
              <p className="lede">Ads made with these blocks for one public test brand, reviewed by hand. More brands are added as examples, so you can see what you'd get for yours.</p>
            </div>
            <div className="gallery">
              {ex.ads.slice(0, 16).map((a) => (
                <figure key={a.id}>
                  <img src={adImage(a.id)} alt={a.title} loading="lazy" width={a.w} height={a.h} />
                  <figcaption><span>{a.title}</span><span>{a.style}</span></figcaption>
                </figure>
              ))}
            </div>
            <p className="disclaimer">{ex.note} Test brand: Grüns.</p>
          </div>
        </section>
      )}

      <section className="section" id="testing">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h1">How we test a block before it's listed.</h2>
            <p className="lede">Built on the ideas in Chip Huyen's <i>AI Engineering</i>. A block earns its place by beating the simple way.</p>
          </div>
          <div className="principles">
            <div><h4>Code checks what code can check</h4><p>Prices, claim IDs, lengths and required parts are checked by code on every run, not by a model's opinion.</p></div>
            <div><h4>A judge from a different lab</h4><p>Quality is graded by a model from a lab that wrote no part of the work, calibrated against human grades first.</p></div>
            <div><h4>It must beat a plain request</h4><p>Every block is compared with the same task asked in one sentence. If it doesn't clearly win, it isn't listed.</p></div>
            <div><h4>Honest about test size</h4><p>Each page says how many cases a block was tested on, and the tests always include hard and tricky cases.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="closing">
            <div>
              <h2 className="h1">Start with one block.</h2>
              <p className="lede">Copy it into your AI, see what it does, then add the next one.</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/library" className="btn btn-primary">Browse the library <Arrow /></Link>
              <Link to="/canvas" className="btn btn-quiet">Open the canvas</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
