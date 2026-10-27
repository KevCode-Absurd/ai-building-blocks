// The friendly name of an input or output type ("brand_brain" is "Brand file"), shared by the site (lib/data.ts) and
// the Worker (server/public-catalogue.ts, which cannot import the browser data module). One list, one name everywhere.
const PORT_NAMES: Record<string, string> = {
  voc_reviews: "Customer reviews", pdp_copy: "Product page copy", ad_copy: "Ad copy", brand_brain: "Brand file",
  competitor_set: "Competitor set", reference_set: "Reference ads", ad_breakdowns: "Ad breakdowns", image_prompt: "Image prompt",
  static_ads: "Image ads", video_ads: "Video ads", performance_sheet: "Performance data", audit_report: "Audit report",
  api_spec: "API spec", ai_model: "AI model", eval_set: "Test set", map_data: "Map data", dataset: "Data files",
  page_speed_report: "Page speed report", me_file: "Your me.md",
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const portLabel = (t: string) => PORT_NAMES[t] ?? cap(t.replace(/_/g, " ").replace(/\b(cta|ugc|vsl|cro|pdp|seo|ai)\b/g, (m) => m.toUpperCase()));
