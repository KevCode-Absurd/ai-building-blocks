// Shared by the app and prerenderer so visitors and search engines read the same policies.
export const SUPPORT_EMAIL = "hello@useaiblocks.com";
export const OPERATOR = "Kevin Mark";
export const POLICY_DATE = "5 November 2026";
// Public profiles for AI Blocks, listed once here. Each one goes into the site's structured data (Organization sameAs) and
// the footer. Add only real, confirmed profiles, for example { label: "YouTube", url: "https://www.youtube.com/@name" }.
// Left empty on purpose until the handles are confirmed.
export const SOCIAL_PROFILES = [];
export const emailLink = (subject = "AI Blocks support") => `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;

// Navigation needs names and addresses, not the full policy documents.
export const INFO_PAGES = [
  {
    "path": "/support",
    "label": "Help & contact"
  },
  {
    "path": "/about",
    "label": "About AI Blocks"
  },
  {
    "path": "/privacy",
    "label": "Privacy policy"
  },
  {
    "path": "/terms",
    "label": "Terms of service"
  },
  {
    "path": "/cookies",
    "label": "Cookies & storage"
  },
  {
    "path": "/ai-disclaimer",
    "label": "AI disclaimer"
  }
];
export const infoPage = path => INFO_PAGES.find(page => page.path === path);
