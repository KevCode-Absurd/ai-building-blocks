// /guides and /guides/:slug: how-to guides for agent packs. Public. The markdown is in src/ui/content/guides/ and is
// bundled at build time, so a guide needs no request. Add a guide: write <slug>.md there and list it in GUIDES.
import { useEffect } from "preact/hooks";
import { Button, Page } from "../../components.tsx";
import { Link } from "../../lib/router.tsx";
import { SafeMarkdown } from "./pack-parts.tsx";
import { markdownSummary, markdownTitle } from "./packs.ts";
import { SITE_SUFFIX } from "../../../modules/directory/titles.ts";
import useAPack from "../../content/guides/use-an-agent-pack.md?raw";
import trainYourOwn from "../../content/guides/train-your-own-agent.md?raw";

interface Guide { slug: string; markdown: string; title: string; summary: string }

const GUIDES: Guide[] = [
  { slug: "use-an-agent-pack", markdown: useAPack },
  { slug: "train-your-own-agent", markdown: trainYourOwn },
].map(g => ({ ...g, title: markdownTitle(g.markdown) ?? g.slug.replace(/-/g, " "), summary: firstSentences(markdownSummary(g.markdown), 2) }));

/** The first n sentences, so each card stays short. */
function firstSentences(text: string, n: number): string {
  return text.split(/(?<=[.!?])\s+/).slice(0, n).join(" ");
}

function GuideList() {
  return (
    <ul class="dir-guides">
      {GUIDES.map(g => (
        <li class="dir-guide-card">
          <h2><Link href={`/guides/${g.slug}`}>{g.title}</Link></h2>
          <p>{g.summary}</p>
          <Link href={`/guides/${g.slug}`} class="dir-card-more">Read the guide &rarr;</Link>
        </li>
      ))}
    </ul>
  );
}

export function GuidesPage() {
  return (
    <Page title="Guides" intro="How to load an AI Blocks agent into the AI you already use, and how to train your own.">
      <GuideList />
    </Page>
  );
}

export function GuidePage(props: { params: Record<string, string> }) {
  const guide = GUIDES.find(g => g.slug === props.params.slug);
  useEffect(() => { if (guide) document.title = `${guide.title}${SITE_SUFFIX}`; }, [guide?.slug]);
  if (!guide) return (
    <Page title="We could not find that guide" intro="It may have moved. Here are the guides we have.">
      <GuideList />
    </Page>
  );
  return (
    <main class="page dir-guide">
      <Link href="/guides" class="dir-back">&larr; All guides</Link>
      <article>
        <SafeMarkdown text={guide.markdown} class="dir-guide-body" />
      </article>
      <section class="dir-cta dir-guide-cta">
        <div>
          <h2>Pick an agent to start with</h2>
          <p>Every agent has a free download on its page, and a "Train your own" pack.</p>
        </div>
        <Button href="/agents">Browse agents</Button>
      </section>
    </main>
  );
}
