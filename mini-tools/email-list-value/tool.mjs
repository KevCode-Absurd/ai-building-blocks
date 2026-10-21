// Email list value. The single source of truth for this mini tool.
//
// Maths: emails sent a month = list size x emails per subscriber a month. Clicks = emails sent x click rate.
// Orders = clicks x the share of clickers who order. Revenue = orders x order value. Profit = revenue x margin.
// One subscriber's worth a month = profit / list size. Over the months they stay = that x months.
// What you can pay to win a subscriber is capped by what they leave you over their stay.
// Standard email revenue and subscriber value formulas, written in our own words.

export default {
  slug: "email-list-value",
  name: "Know what your email list is worth a month",
  /** The plain name, used where the tool talks about itself. */
  short: "Email list value",
  headline: "Know what your email list is worth a month, and what one more subscriber is worth",
  summary: "Type your list size, how often you send and what your emails achieve. You get the profit your list makes a month, the worth of one subscriber, and the most to pay to win one.",
  question: "What does my email list earn each month, what is one subscriber worth, and how much can I pay to get another?",
  shelf: ["general", "ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    { id: "listSize", label: "People on your email list", unit: "count", example: 10000, min: 0, max: 1e9, step: 500, help: "Subscribers who can get your emails today. Leave out anyone who has opted out.", where: "Your email tool's list or audience page.", tools: ["Klaviyo", "Mailchimp", "Kit", "Your email tool"] },
    { id: "sends", label: "Emails you send each subscriber a month", unit: "number", example: 8, min: 0, max: 200, step: 1, help: "Campaigns plus automated emails an average subscriber gets in a month.", where: "Your email tool's sent count for the last 30 days, divided by your list size.", tools: ["Klaviyo", "Mailchimp", "Kit"] },
    { id: "clickRate", label: "Click rate", unit: "percent", example: 1.5, min: 0, max: 100, step: 0.1, help: "The share of emails sent that get a click. Opens are less reliable, because mail apps can fake them.", where: "Your email tool's reports: average click rate for the last 30 days.", tools: ["Klaviyo", "Mailchimp", "Kit"] },
    { id: "convRate", label: "Share of clickers who order", unit: "percent", example: 3, min: 0, max: 100, step: 0.1, help: "Out of everyone who clicks, the share who buy.", where: "Your orders from email divided by your email clicks, for the last 30 days.", tools: ["Shopify analytics", "Google Analytics", "Klaviyo"] },
    { id: "orderValue", label: "Average order value", unit: "money", example: 60, min: 0, max: 1e9, step: 1, help: "What an order from email brings in.", where: "Revenue from email divided by orders from email.", tools: ["Shopify analytics", "Klaviyo", "Your accounts software"] },
    { id: "margin", label: "Profit margin on an order", unit: "percent", example: 40, min: 0, max: 100, step: 1, help: "The share of each order you keep after goods, shipping and fees, before the cost of getting the customer.", where: "The order margin tool, or your profit and loss report.", tools: ["Xero or QuickBooks", "Shopify analytics", "A spreadsheet of your sales"] },
    { id: "stayMonths", label: "Months a subscriber stays on your list", unit: "months", example: 12, min: 0, max: 600, step: 1, help: "How long an average subscriber keeps getting your emails before they leave or go quiet.", where: "Your email tool's list growth report, or a guess: if half leave in a year, use 12.", tools: ["Klaviyo", "Mailchimp", "A spreadsheet"] },
    { id: "toolCost", label: "What your email tool costs a month", unit: "money", example: 300, min: 0, max: 1e9, step: 10, help: "Your email and text software, plus any paid help with emails.", where: "Your latest bills.", tools: ["Your email tool's billing page", "Your accounts software"] },
  ],
  outputs: [
    { id: "emailsSent", label: "Emails sent a month", unit: "count", formula: "listSize * sends", sum: "{listSize} × {sends} = {=}", means: "Every email counts, even if a subscriber never opens it." },
    { id: "ordersMonth", label: "Orders from email a month", unit: "number", formula: "emailsSent * clickRate / 100 * convRate / 100", sum: "{emailsSent} × {clickRate} click × {convRate} order = {=}", means: "Orders your emails bring in, from clicks that turn into a sale." },
    { id: "revenueMonth", label: "Sales from email a month", unit: "money", formula: "ordersMonth * orderValue", sum: "{ordersMonth} × {orderValue} = {=}", means: "What your list brings in before any costs." },
    { id: "profitMonth", label: "Profit your list makes a month", unit: "money", formula: "revenueMonth * margin / 100", sum: "{revenueMonth} × {margin} margin = {=}", means: "What the orders leave you before the cost of your email tool." },
    { id: "profitAfterTool", label: "Profit after your email tool", unit: "money", formula: "profitMonth - toolCost", sum: "{profitMonth} − {toolCost} = {=}", means: [{ if: "profitAfterTool < 0", text: "A loss: your list does not pay for your email tool at these numbers." }, { text: "What your list leaves you once the tool is paid for." }] },
    { id: "revenuePer1000", label: "Sales for every 1,000 emails sent", unit: "money", formula: "IF(emailsSent > 0, revenueMonth / emailsSent * 1000, 0)", sum: "{revenueMonth} ÷ {emailsSent} × 1,000 = {=}", means: "A number you can compare from one email to the next." },
    { id: "perSubMonth", label: "Profit from one subscriber a month", unit: "smallmoney", formula: "IF(listSize > 0, profitMonth / listSize, 0)", sum: "{profitMonth} ÷ {listSize} = {=}", means: "A subscriber is worth a small amount each month, so it adds up over their stay." },
    { id: "perSubStay", label: "Most to pay to win one subscriber", unit: "smallmoney", formula: "perSubMonth * stayMonths", sum: "{perSubMonth} × {stayMonths} = {=}", means: [{ if: "perSubStay = 0", text: "At these numbers a subscriber leaves you nothing, so no amount is worth paying." }, { text: "Pay more than this to win a subscriber and the list loses money over their stay. It is a ceiling, not a target." }] },
  ],
  answer: [
    [
      { if: "listSize = 0", text: "With nobody on your list, it earns nothing. Type your list size." },
      { if: "profitMonth = 0", text: "At these numbers your list leaves you no profit. Check your click rate, order rate and margin." },
      { text: "Your list makes {profitMonth} profit a month, and {profitAfterTool} once your email tool is paid for. One subscriber leaves you {perSubMonth} a month, and {perSubStay} over their stay." },
    ],
    [
      { if: "perSubStay > 0", text: "Pay up to {perSubStay} to win a subscriber and you break even. Pay less to profit." },
    ],
  ],
  next: [
    { slug: "email-and-sms-performance-reader", why: "Find what to fix in your click rate and order rate." },
    { slug: "engaged-list-expander", why: "Reach more of your list safely, so each subscriber is worth more." },
    { slug: "sunset-flow-and-list-cleaner", why: "Remove people who never engage and keep your rates honest." },
  ],
  sources: [
    { what: "Revenue from email", how: "Emails sent × click rate × order rate × order value. A standard email funnel sum." },
    { what: "Worth of a subscriber", how: "Profit from the whole list ÷ list size, times the months they stay. A standard subscriber value sum." },
  ],
  notes: [
    "It treats every subscriber alike. New subscribers and your best customers often act very differently, so use the result as a ceiling and test it.",
    "It counts sales that come from email clicks only. It says nothing about orders that email caused later without a click.",
  ],
};
