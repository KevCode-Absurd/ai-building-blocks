// The one example app on /apps: Mercatura, the app we built on these skills (the Creative Engine repo), saved as
// a static click-through with its Grüns study data (tools/example-app, docs/EXAMPLE-APP.md). Its saved
// source is in this folder (example-app-site/). Production and preview serve it under the same site; the build checks its file budget.
// Nothing in it runs. The open-source starter people install is the separate mercatura-client-starter repo.

export const REPO = "https://github.com/KevCode-Absurd/mercatura-client-starter";
export const TOUR = "/example-app/";

export type Area = { id: string; name: string; line: string; path: string };

/** The parts of the app worth opening first, each with a screenshot in /example-app-shots/<id>.webp. */
export const AREAS: Area[] = [
  { id: "studio", name: "Creative studio", line: "Plan the next ads, then make image ads, product page pictures and photoshoots on the real product.", path: "studio" },
  { id: "scripts", name: "Video scripts", line: "Scripts in 15 styles, each with graded hooks, a voice check and an audit.", path: "scripts" },
  { id: "insights", name: "Customer insights", line: "What buyers say, sorted into ranked themes, every quote linked to where it came from.", path: "insights" },
  { id: "references", name: "Reference ads", line: "A tagged library of ads that worked. Pick one and make your own version.", path: "references" },
  { id: "avatars", name: "Avatars", line: "Ready-made people for video ads, each with a sheet of angles to keep them the same in every shot.", path: "references/avatars" },
  { id: "production", name: "Production", line: "Each video moves from brief to storyboard to clips, with an approval at every step.", path: "production" },
  { id: "landing", name: "Landing pages", line: "Pages built for an ad or a buyer, checked on every save, with speed and security tests.", path: "landing" },
  { id: "seo", name: "SEO", line: "Priorities, audits, articles and the questions AI search answers about the brand.", path: "seo" },
  { id: "brand", name: "Brand brain", line: "Everything every writer is told about the brand: facts, voice, claims, fonts and colours.", path: "brand" },
];

export const SETUP_STEPS: { step: string; what: string }[] = [
  { step: "Install", what: "Node.js 22 or newer and pnpm. Run pnpm install --frozen-lockfile." },
  { step: "Settings", what: "Copy .env.example to .env. Leave mock mode on and every spend cap at 0 while you look around." },
  { step: "Start", what: "Run pnpm run setup, then pnpm dev, and open 127.0.0.1:3000/onboarding." },
  { step: "First brand", what: "Add one brand, its approved facts and photos. Make a small batch and approve it before a big one." },
];
