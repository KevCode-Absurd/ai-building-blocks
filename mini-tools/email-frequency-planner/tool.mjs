// Email frequency planner. The single source of truth for this mini tool.
//
// Maths: profit from email a month = list size x sends a month / 1,000 x sales per 1,000 emails x margin.
// Unsubscribes a month = list size x sends a month x unsubscribe rate per email. Compare today's pace with the new one:
// extra profit = new profit - today's; extra unsubscribes = new - today's; what they were worth = extra unsubscribes x
// the profit one subscriber brings over their stay. Net = extra profit - that worth. A lost subscriber would have to be
// worth less than extra profit / extra unsubscribes for the new pace to win. Standard email funnel sums, written in our own words.

export default {
  slug: "email-frequency-planner",
  name: "See if sending more emails pays once unsubscribes are counted",
  /** The plain name, used where the tool talks about itself. */
  short: "Email frequency",
  headline: "See if sending more emails pays, once the subscribers you lose are counted",
  summary: "Type your list size, how often you send now and plan to, what 1,000 emails earn and your unsubscribe rate. You get the extra profit, the extra people lost and whether you come out ahead.",
  question: "If I send more emails each month, what do the extra sales add, what do the extra unsubscribes cost me, and do I come out ahead?",
  shelf: ["general", "ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  sections: [
    { id: "numbers", label: "Your list today" },
    { id: "plan", label: "The change you are thinking about" },
  ],
  inputs: [
    { id: "listSize", label: "People on your email list", unit: "count", example: 10000, min: 0, max: 1e9, step: 500, help: "Subscribers who can get your emails today.", where: "Your email tool's list or audience page.", tools: ["Klaviyo", "Mailchimp", "Kit", "Your email tool"] },
    { id: "sendsNow", label: "Emails you send each subscriber a month, today", unit: "number", example: 4, min: 0, max: 200, step: 1, help: "Campaigns an average subscriber gets in a month. Leave out automated emails, which do not change here.", where: "Your campaigns sent in the last 30 days.", tools: ["Klaviyo", "Mailchimp", "Kit"] },
    { id: "rpmNow", label: "Sales for every 1,000 emails sent, today", unit: "money", example: 40, min: 0, max: 1e9, step: 1, help: "Revenue from a campaign divided by the emails sent, times 1,000. Average it over your last 10 campaigns.", where: "Your email tool's campaign reports: revenue divided by sent, times 1,000.", tools: ["Klaviyo", "Mailchimp", "Shopify analytics"] },
    { id: "margin", label: "Profit margin on an order", unit: "percent", example: 40, min: 0, max: 100, step: 1, help: "The share of each order you keep after goods, shipping and fees.", where: "The order margin tool, or your profit and loss report.", tools: ["Xero or QuickBooks", "Shopify analytics"] },
    { id: "unsubRate", label: "Share who unsubscribe from each email", unit: "percent", example: 0.2, min: 0, max: 100, step: 0.05, help: "Unsubscribes from one campaign divided by the emails sent, as a percentage. 0.2 means 2 in every 1,000.", where: "Your email tool's campaign reports, averaged over your last 10 campaigns.", tools: ["Klaviyo", "Mailchimp", "Kit"] },
    { id: "subValue", label: "Profit one subscriber brings over their stay", unit: "money", example: 12, min: 0, max: 1e9, step: 1, help: "What an average subscriber is worth to you from now until they leave. The email list value tool works it out.", where: "The email list value tool, or your profit from email a month divided by list size, times the months a subscriber stays.", tools: ["The email list value tool", "A spreadsheet"] },
    { id: "sendsNew", label: "Emails you would send each subscriber a month", unit: "number", example: 8, min: 0, max: 200, step: 1, section: "plan", help: "The new pace you are thinking about.", where: "Your plan.", tools: [] },
    { id: "rpmNew", label: "Sales for every 1,000 emails at the new pace", unit: "money", example: 35, min: 0, max: 1e9, step: 1, section: "plan", help: "Each extra email usually earns a little less than the last. If you do not know, start with today's figure, then try a lower one.", where: "Your own guess, or the figure from a month when you sent at this pace before.", tools: ["Your email tool's campaign reports"] },
  ],
  outputs: [
    { id: "profitNow", label: "Profit from email a month, today", unit: "money", formula: "listSize * sendsNow / 1000 * rpmNow * margin / 100", sum: "{listSize} × {sendsNow} ÷ 1,000 × {rpmNow} × {margin} = {=}", means: "What your campaigns leave you now, before the cost of your email tool." },
    { id: "profitNew", label: "Profit from email a month, at the new pace", unit: "money", formula: "listSize * sendsNew / 1000 * rpmNew * margin / 100", sum: "{listSize} × {sendsNew} ÷ 1,000 × {rpmNew} × {margin} = {=}", means: "The same sum at the new pace, with its own sales per 1,000." },
    { id: "extraProfit", label: "Extra profit a month from the change", unit: "money", formula: "profitNew - profitNow", sum: "{profitNew} − {profitNow} = {=}", means: [
      { if: "extraProfit < 0", text: "Below zero: the new pace earns less, before any unsubscribes are counted." },
      { text: "What the change adds before the people you lose are counted." },
    ] },
    { id: "unsubsNow", label: "People who unsubscribe a month, today", unit: "count", formula: "listSize * sendsNow * unsubRate / 100", sum: "{listSize} × {sendsNow} × {unsubRate} = {=}", means: "At today's pace." },
    { id: "unsubsNew", label: "People who unsubscribe a month, at the new pace", unit: "count", formula: "listSize * sendsNew * unsubRate / 100", sum: "{listSize} × {sendsNew} × {unsubRate} = {=}", means: "More emails, more chances to leave." },
    { id: "extraUnsubs", label: "Extra people lost a month", unit: "count", formula: "unsubsNew - unsubsNow", sum: "{unsubsNew} − {unsubsNow} = {=}", means: "The people the change costs you each month." },
    { id: "lostValue", label: "What those people were worth", unit: "money", formula: "extraUnsubs * subValue", sum: "{extraUnsubs} × {subValue} = {=}", means: "The future profit that leaves with them." },
    { id: "net", label: "Net gain a month from the change", unit: "money", formula: "extraProfit - lostValue", sum: "{extraProfit} − {lostValue} = {=}", means: [
      { if: "net < 0", text: "Below zero: once the lost subscribers are counted, the change loses money." },
      { if: "net = 0", text: "The extra sales and the lost subscribers cancel out." },
      { text: "Above zero: the extra sales are worth more than the people you lose." },
    ] },
    { id: "breakEvenValue", label: "A lost subscriber would have to be worth less than", unit: "money", formula: "IF(extraUnsubs > 0, extraProfit / extraUnsubs, NA())", none: "No extra people lost", sum: "{extraProfit} ÷ {extraUnsubs} = {=}", means: [
      { if: "NOT(HAS(breakEvenValue))", text: "The change loses nobody extra, so there is no limit to check." },
      { text: "If a subscriber is worth more than this over their stay, the change does not pay." },
    ] },
    { id: "shareLostYear", label: "Share of your list that leaves in a year, at the new pace", unit: "percent", formula: "IF(listSize > 0, unsubsNew * 12 / listSize * 100, NA())", none: "No list yet", sum: "{unsubsNew} × 12 ÷ {listSize} = {=}", means: "Before new sign-ups. Above 30% or so, the list shrinks faster than most can refill it." },
  ],
  answer: [
    [
      { if: "listSize = 0", text: "With nobody on your list, nothing changes. Type your list size." },
      { if: "sendsNew = sendsNow", text: "You are sending {sendsNow} emails a month either way, so nothing changes. Type a different number of emails to compare." },
      { if: "net > 0", text: "Going from {sendsNow} to {sendsNew} emails a month adds {extraProfit} of profit and loses {extraUnsubs} more people, worth {lostValue}. You come out {net} ahead each month." },
      { if: "net < 0", text: "Going from {sendsNow} to {sendsNew} emails a month adds {extraProfit} of profit but loses {extraUnsubs} more people, worth {lostValue}. You come out {net:abs} behind each month, once the lost subscribers are counted." },
      { text: "Going from {sendsNow} to {sendsNew} emails a month adds {extraProfit} of profit and loses {extraUnsubs} more people, worth the same. It is a wash." },
    ],
    [
      { if: "AND(HAS(breakEvenValue), net < 0, extraProfit > 0)", text: "It would pay if a subscriber were worth less than {breakEvenValue}, or if fewer people left each email." },
    ],
  ],
  next: [
    { slug: "email-cadence-planner", why: "Plan what each extra email says, so more sends do not mean more of the same." },
    { slug: "email-and-sms-performance-reader", why: "Read last month's numbers to see what is driving unsubscribes." },
    { if: "shareLostYear > 30", slug: "sunset-flow-and-list-cleaner", why: "Stop emailing people who never open, before they unsubscribe." },
  ],
  sources: [
    { what: "Profit from email", how: "Emails sent × sales per 1,000 emails × margin. A standard email revenue sum." },
    { what: "Cost of the people you lose", how: "Extra unsubscribes × what one subscriber is worth over their stay. A standard lifetime value sum." },
  ],
  notes: [
    "Unsubscribes are the same share on every email here. In practice the rate often rises as you send more, so try a higher rate too.",
    "Sales per 1,000 emails at the new pace is your guess until you have tried it. Run the new pace for a month and type the real figure.",
    "People who stop opening but never unsubscribe are not counted. They cost you deliverability, which this sum does not price.",
  ],
};
