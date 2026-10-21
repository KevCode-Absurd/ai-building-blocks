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

import t_ad_budget_planner from "./ad-budget-planner/tool.mjs";
import t_ad_budget_planner_ex from "./ad-budget-planner/examples.mjs";
import t_customer_payback from "./customer-payback/tool.mjs";
import t_customer_payback_ex from "./customer-payback/examples.mjs";
import t_price_increase_calculator from "./price-increase-calculator/tool.mjs";
import t_price_increase_calculator_ex from "./price-increase-calculator/examples.mjs";
import t_free_shipping_threshold from "./free-shipping-threshold/tool.mjs";
import t_free_shipping_threshold_ex from "./free-shipping-threshold/examples.mjs";
import t_bundle_price_calculator from "./bundle-price-calculator/tool.mjs";
import t_bundle_price_calculator_ex from "./bundle-price-calculator/examples.mjs";
import t_returns_cost_calculator from "./returns-cost-calculator/tool.mjs";
import t_returns_cost_calculator_ex from "./returns-cost-calculator/examples.mjs";
import t_landed_cost from "./landed-cost/tool.mjs";
import t_landed_cost_ex from "./landed-cost/examples.mjs";
import t_reorder_point from "./reorder-point/tool.mjs";
import t_reorder_point_ex from "./reorder-point/examples.mjs";
import t_email_list_value from "./email-list-value/tool.mjs";
import t_email_list_value_ex from "./email-list-value/examples.mjs";
import t_creator_deal_calculator from "./creator-deal-calculator/tool.mjs";
import t_creator_deal_calculator_ex from "./creator-deal-calculator/examples.mjs";
import t_subscription_revenue_forecast from "./subscription-revenue-forecast/tool.mjs";
import t_subscription_revenue_forecast_ex from "./subscription-revenue-forecast/examples.mjs";
import t_cash_runway from "./cash-runway/tool.mjs";
import t_cash_runway_ex from "./cash-runway/examples.mjs";
import t_meeting_cost from "./meeting-cost/tool.mjs";
import t_meeting_cost_ex from "./meeting-cost/examples.mjs";
import t_hire_or_freelance from "./hire-or-freelance/tool.mjs";
import t_hire_or_freelance_ex from "./hire-or-freelance/examples.mjs";

import t_new_hire_break_even from "./new-hire-break-even/tool.mjs";
import t_new_hire_break_even_ex from "./new-hire-break-even/examples.mjs";
import t_hire_runway_cost from "./hire-runway-cost/tool.mjs";
import t_hire_runway_cost_ex from "./hire-runway-cost/examples.mjs";
import t_agency_or_in_house from "./agency-or-in-house/tool.mjs";
import t_agency_or_in_house_ex from "./agency-or-in-house/examples.mjs";
import t_subscriber_lifetime_value from "./subscriber-lifetime-value/tool.mjs";
import t_subscriber_lifetime_value_ex from "./subscriber-lifetime-value/examples.mjs";
import t_launch_revenue_planner from "./launch-revenue-planner/tool.mjs";
import t_launch_revenue_planner_ex from "./launch-revenue-planner/examples.mjs";
import t_three_tier_pricing from "./three-tier-pricing/tool.mjs";
import t_three_tier_pricing_ex from "./three-tier-pricing/examples.mjs";
import t_early_payment_discount from "./early-payment-discount/tool.mjs";
import t_early_payment_discount_ex from "./early-payment-discount/examples.mjs";
import t_ad_test_size from "./ad-test-size/tool.mjs";
import t_ad_test_size_ex from "./ad-test-size/examples.mjs";
import t_email_frequency_planner from "./email-frequency-planner/tool.mjs";
import t_email_frequency_planner_ex from "./email-frequency-planner/examples.mjs";
import t_content_cost_per_piece from "./content-cost-per-piece/tool.mjs";
import t_content_cost_per_piece_ex from "./content-cost-per-piece/examples.mjs";
import t_ai_time_saved from "./ai-time-saved/tool.mjs";
import t_ai_time_saved_ex from "./ai-time-saved/examples.mjs";
import t_marketplace_unit_margin from "./marketplace-unit-margin/tool.mjs";
import t_marketplace_unit_margin_ex from "./marketplace-unit-margin/examples.mjs";
import t_store_or_marketplace from "./store-or-marketplace/tool.mjs";
import t_store_or_marketplace_ex from "./store-or-marketplace/examples.mjs";
import t_stock_weeks_of_cover from "./stock-weeks-of-cover/tool.mjs";
import t_stock_weeks_of_cover_ex from "./stock-weeks-of-cover/examples.mjs";

export const TOOLS = [discount, deal, margin, repeat, volume, pageTest, aiCost, hourly, t_ad_budget_planner, t_customer_payback, t_price_increase_calculator, t_free_shipping_threshold, t_bundle_price_calculator, t_returns_cost_calculator, t_landed_cost, t_reorder_point, t_email_list_value, t_creator_deal_calculator, t_subscription_revenue_forecast, t_cash_runway, t_meeting_cost, t_hire_or_freelance, t_new_hire_break_even, t_hire_runway_cost, t_agency_or_in_house, t_subscriber_lifetime_value, t_launch_revenue_planner, t_three_tier_pricing, t_early_payment_discount, t_ad_test_size, t_email_frequency_planner, t_content_cost_per_piece, t_ai_time_saved, t_marketplace_unit_margin, t_store_or_marketplace, t_stock_weeks_of_cover];
export const EXAMPLES = {
  [discount.slug]: discountExamples,
  [deal.slug]: dealExamples,
  [margin.slug]: marginExamples,
  [repeat.slug]: repeatExamples,
  [volume.slug]: volumeExamples,
  [pageTest.slug]: pageTestExamples,
  [aiCost.slug]: aiCostExamples,
  [hourly.slug]: hourlyExamples,
  [t_ad_budget_planner.slug]: t_ad_budget_planner_ex,
  [t_customer_payback.slug]: t_customer_payback_ex,
  [t_price_increase_calculator.slug]: t_price_increase_calculator_ex,
  [t_free_shipping_threshold.slug]: t_free_shipping_threshold_ex,
  [t_bundle_price_calculator.slug]: t_bundle_price_calculator_ex,
  [t_returns_cost_calculator.slug]: t_returns_cost_calculator_ex,
  [t_landed_cost.slug]: t_landed_cost_ex,
  [t_reorder_point.slug]: t_reorder_point_ex,
  [t_email_list_value.slug]: t_email_list_value_ex,
  [t_creator_deal_calculator.slug]: t_creator_deal_calculator_ex,
  [t_subscription_revenue_forecast.slug]: t_subscription_revenue_forecast_ex,
  [t_cash_runway.slug]: t_cash_runway_ex,
  [t_meeting_cost.slug]: t_meeting_cost_ex,
  [t_hire_or_freelance.slug]: t_hire_or_freelance_ex,
  [t_new_hire_break_even.slug]: t_new_hire_break_even_ex,
  [t_hire_runway_cost.slug]: t_hire_runway_cost_ex,
  [t_agency_or_in_house.slug]: t_agency_or_in_house_ex,
  [t_subscriber_lifetime_value.slug]: t_subscriber_lifetime_value_ex,
  [t_launch_revenue_planner.slug]: t_launch_revenue_planner_ex,
  [t_three_tier_pricing.slug]: t_three_tier_pricing_ex,
  [t_early_payment_discount.slug]: t_early_payment_discount_ex,
  [t_ad_test_size.slug]: t_ad_test_size_ex,
  [t_email_frequency_planner.slug]: t_email_frequency_planner_ex,
  [t_content_cost_per_piece.slug]: t_content_cost_per_piece_ex,
  [t_ai_time_saved.slug]: t_ai_time_saved_ex,
  [t_marketplace_unit_margin.slug]: t_marketplace_unit_margin_ex,
  [t_store_or_marketplace.slug]: t_store_or_marketplace_ex,
  [t_stock_weeks_of_cover.slug]: t_stock_weeks_of_cover_ex,
};
/** Where the site lives, for credit links in the download and the embed. */
export const SITE = "https://useaiblocks.com";
