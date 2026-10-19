// Every mini tool, in the order the Tools page lists them. Each folder holds:
//   tool.mjs      the inputs, formulas, working, meanings and next steps: the single source of truth
//   examples.mjs  worked examples, checked by hand; every way the tool is built must match them
// The engine (engine.mjs) works the formulas out; tools/build-mini-tool.mjs builds the five ways from them.
//
// Tool file format, in short:
//   inputs:  { id, label, unit, example, min, max, step, integer?, help, where, tools[], boards?, section? }
//   name, short, headline, summary, question: the outcome-first card name, the plain name ("Discount calculator"), and copy
//   outputs: { id, label, unit, formula, sum, means, about?, none?, boards?, group?, row?, col?, helper? }
//            formula is spreadsheet-style (see engine.mjs); sum is the working in words, with {name} for a number
//            and {=} for this answer; means is a sentence, or a list of { if, text } where the first that holds is used.
//   answer:  lists of { if, text }; the first that holds in each list is said.
//   next:    { if?, slug, why }: the library listing to use next. Every slug must exist in catalogue-items.
//   presets: boards, like "Any business" and "Online store". An input with boards[] shows only on those.

import discount from "./discount-calculator/tool.mjs";
import discountExamples from "./discount-calculator/examples.mjs";
import deal from "./deal-comparer/tool.mjs";
import dealExamples from "./deal-comparer/examples.mjs";
import margin from "./order-margin/tool.mjs";
import marginExamples from "./order-margin/examples.mjs";
import repeat from "./repeat-customer-profit/tool.mjs";
import repeatExamples from "./repeat-customer-profit/examples.mjs";
import volume from "./creative-volume-planner/tool.mjs";
import volumeExamples from "./creative-volume-planner/examples.mjs";
import pageTest from "./page-test-calculator/tool.mjs";
import pageTestExamples from "./page-test-calculator/examples.mjs";
import aiCost from "./ai-run-cost/tool.mjs";
import aiCostExamples from "./ai-run-cost/examples.mjs";
import hourly from "./hourly-rate/tool.mjs";
import hourlyExamples from "./hourly-rate/examples.mjs";

export const TOOLS = [discount, deal, margin, repeat, volume, pageTest, aiCost, hourly];
export const EXAMPLES = {
  [discount.slug]: discountExamples,
  [deal.slug]: dealExamples,
  [margin.slug]: marginExamples,
  [repeat.slug]: repeatExamples,
  [volume.slug]: volumeExamples,
  [pageTest.slug]: pageTestExamples,
  [aiCost.slug]: aiCostExamples,
  [hourly.slug]: hourlyExamples,
};
/** Where the site lives, for credit links in the download and the embed. */
export const SITE = "https://useaiblocks.com";
