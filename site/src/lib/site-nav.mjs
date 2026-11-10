// The site's links in one place: the app header and footer (SiteHeader.tsx, SiteFooter.tsx) and the plain pages built
// without the app (scripts/lib/site-chrome.mjs) all read these, so every page shows the same header, menu and footer.
// One name per destination: the same words appear in the header, the menu, the footer and each page title.

/** The main sections and the blog: in the header on a laptop, at the top of their menu groups on a phone. [address, label, test id] */
export const MAIN_NAV = [
  ["/#library", "Find a task", "nav-find"],
  ["/roles", "Hire an AI specialist", "nav-roles"],
  ["/compose", "Build a workflow", "nav-compose"],
  ["/tools", "Tools", "nav-tools"],
  ["/minds", "Minds", "nav-minds"],
  ["/blog", "Blog", "nav-blog"],
];

// Every main page is one menu click from anywhere, grouped by what people came to do.
// Each link: [address, label, test id]. Policies and About sit in the footer.
// The menu holds 20 links at most. The format pages (/skills, /prompts, /workflows, /agents) sit under one link,
// "Skills, prompts and workflows" (/which-one), which compares them and links to each. Guides stays in the footer
// and under "All articles and guides".
export const MENU_GROUPS = [
  { id: "find", label: "Find", links: [["/#library", "Find a task", "find"], ["/which-one", "Skills, prompts and workflows", "formats"], ["/minds", "Minds", "minds"], ["/tools", "Tools", "tools"], ["/ai-tools", "AI tool guides", "ai-tools"]] },
  { id: "build", label: "Build", links: [["/compose", "Build a workflow", "compose"], ["/get-it-done", "Get a whole job done", "get-it-done"], ["/from-a-source", "Turn an article or video into a workflow", "source"], ["/apps", "Turn a workflow into an app", "apps"]] },
  { id: "agents", label: "AI agents", links: [["/roles", "Hire an AI specialist", "roles"], ["/teams", "Plan an AI team", "teams"]] },
  { id: "blog", label: "Blog", links: [["/blog", "All articles and guides", "blog"], ["/train-your-own-ai-agent", "Train your own AI agent", "train"], ["/industries", "AI help by business", "industries"]] },
  { id: "your-ai", label: "Your AI", links: [["/api-and-mcp", "Connect your AI", "api-mcp"], ["/me-md", "Your me.md file", "memd"], ["/space", "Team space", "space"]] },
  { id: "help", label: "Help", links: [["/how-it-works", "How it works", "guide"], ["/api-and-mcp#api", "Documentation", "documentation"], ["/support", "Help & contact", "support"]] },
];

/** Pages built only as plain HTML (scripts/lib/trust-pages.mjs): the app opens them with a normal page load. */
export const STATIC_PAGES = ["/industries", "/how-we-test", "/how-we-check-safety"];
/** Plain pages with app pages under them: /skills is plain, /skills/<item> opens in the app (scripts/lib/format-pages.mjs). */
export const STATIC_EXACT = ["/skills", "/prompts", "/workflows", "/agents", "/which-one"];
export const isStaticPage = (to) => STATIC_PAGES.some((p) => to === p || to.startsWith(`${p}/`)) || STATIC_EXACT.includes(String(to).split(/[?#]/)[0]);

// The footer: three short columns, then the policies in the bottom row. [address, label, test id or ""]
export const FOOTER_GROUPS = [
  { label: "Explore", links: [["/#library", "Find a task", ""], ["/roles", "Hire an AI specialist", ""], ["/compose", "Build a workflow", ""], ["/tools", "Tools", ""], ["/minds", "Minds", ""], ["/industries", "AI help by business", "footer-industries"]] },
  { label: "Your AI", links: [["/api-and-mcp", "Connect your AI", "footer-api-mcp"], ["/space", "Team space", ""], ["/api-and-mcp#api", "Documentation", "footer-documentation"]] },
  { label: "Help", links: [["/blog", "Blog", "footer-blog"], ["/guides", "Guides", "footer-guides"], ["/how-we-test", "How we test", "footer-how-we-test"], ["/support", "Help & contact", ""], ["/about", "About AI Blocks", ""]] },
];
export const FOOTER_LINE = "Reusable AI skills and workflows for the work you do.";
