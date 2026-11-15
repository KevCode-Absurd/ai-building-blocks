// The business boards' addresses and names, small enough for the site bundle: item pages show "For: <board>" links
// and the org context asks which one fits. src/trust-pages/boards.mjs holds the full boards; a test checks they match.
export const BOARD_NAMES = {
  "ecommerce": "Online stores",
  "amazon-sellers": "Amazon and marketplace sellers",
  "saas": "SaaS",
  "apps": "Apps",
  "courses-and-coaching": "Courses and coaching",
  "content-creators": "Creators and media",
  "agencies-and-freelancers": "Agencies, freelancers and consultants",
  "local-services": "Local businesses and shops",
  "digital-products": "Digital products",
  "ai-automation": "AI and automation businesses",
  "wholesale-and-brands": "Wholesale and product brands",
};
export const boardHref = (slug) => `/industries/${slug}`;
/** The playbook every download carries for this kind of business (written by tools/write-playbooks.mjs). */
export const playbookFile = (slug) => `FOR-${slug.toUpperCase()}.md`;
export const playbookHref = (slug) => `/playbooks/${playbookFile(slug)}`;
