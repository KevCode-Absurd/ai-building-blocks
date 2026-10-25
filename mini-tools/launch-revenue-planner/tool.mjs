// Launch revenue planner. The single source of truth for this mini tool.
//
// Maths: people who show up = sign-ups x show-up rate. Buyers = people who show up x buy rate. Sales = buyers x price.
// Refunds = sales x refund rate. Delivery cost = buyers x cost to deliver to one. Profit = sales - refunds - delivery
// - ad spend - other costs. What one sign-up is worth = show-up rate x buy rate x (price x (1 - refund rate) - delivery
// cost): also the most you can pay in ads for one. Sign-ups to break even = (ad spend + other costs) / that, rounded up.
// Standard funnel and break-even sums, written in our own words.

export default {
  slug: "launch-revenue-planner",
  name: "Webinar and launch profit planner",
  /** The plain name, used where the tool talks about itself. */
  short: "Webinar and launch profit planner",
  headline: "Webinar and launch profit planner",
  summary: "Enter sign-ups, attendance, buying and refund rates, price and costs. Estimate buyers, profit and the sign-ups needed to cover costs.",
  question: "How many sign-ups would cover this webinar or launch’s costs?",
  shelf: ["general"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    { id: "signups", label: "Sign-ups", unit: "count", example: 500, min: 0, max: 1e9, step: 50, integer: true, help: "People who register for the webinar, waitlist or launch.", where: "Your registration page or email tool. For a plan, your sign-ups from the last launch.", tools: ["Your webinar tool", "Klaviyo or Mailchimp", "Your landing page tool"] },
    { id: "showRate", label: "Share who show up or see the offer", unit: "percent", example: 40, min: 0, max: 100, step: 5, help: "Of everyone who signed up, the share who attend live, watch the replay or open the sales emails.", where: "Your webinar tool's attendance report, or opens on your sales emails, from the last launch.", tools: ["Your webinar tool", "Your email tool"] },
    { id: "buyRate", label: "Share of those who buy", unit: "percent", example: 5, min: 0, max: 100, step: 0.5, help: "Of the people who saw the offer, the share who pay.", where: "Orders divided by attendees from the last launch.", tools: ["Your checkout", "Your webinar tool"] },
    { id: "price", label: "Price", unit: "money", example: 497, min: 0, max: 1e9, step: 1, help: "What one buyer pays. For payment plans, use the full amount you expect to collect.", where: "Your sales page.", tools: [] },
    { id: "refundRate", label: "Share of buyers who refund", unit: "percent", example: 10, min: 0, max: 100, step: 1, help: "Refunds divided by orders from the last launch. Use 0 if you have no refund window.", where: "Your payment tool's refund report.", tools: ["Stripe", "Your checkout", "Your accounts software"] },
    { id: "deliverCost", label: "Cost to deliver to one buyer", unit: "money", example: 30, min: 0, max: 1e9, step: 5, help: "Payment fees, a welcome kit, onboarding time or a physical product, per buyer. Use 0 for a purely digital offer with no fees.", where: "Your payment fees plus what you spend serving one buyer.", tools: ["Stripe", "Your accounts software"] },
    { id: "adSpend", label: "Ad spend for the launch", unit: "money", example: 2500, min: 0, max: 1e9, step: 100, help: "What you spend on ads to get the sign-ups.", where: "Your ads account, or your launch budget.", tools: ["Meta Ads Manager", "Google Ads", "Your marketing budget"] },
    { id: "fixedCost", label: "Other launch costs", unit: "money", example: 500, min: 0, max: 1e9, step: 100, help: "Webinar software, a designer, a copywriter, a guest's fee. Costs that do not change with sales.", where: "Your quotes and invoices for the launch.", tools: ["Your accounts software"] },
  ],
  outputs: [
    { id: "attendees", label: "People who see the offer", unit: "count", formula: "signups * showRate / 100", sum: "{signups} × {showRate} = {=}", means: "Everyone else signed up and never saw the pitch." },
    { id: "buyers", label: "Buyers", unit: "count", formula: "attendees * buyRate / 100", sum: "{attendees} × {buyRate} = {=}", means: "Orders you can expect at these rates." },
    { id: "grossSales", label: "Sales before refunds", unit: "money", formula: "buyers * price", sum: "{buyers} × {price} = {=}", means: "The headline number. Not what you keep." },
    { id: "refunds", label: "Refunds", unit: "money", formula: "grossSales * refundRate / 100", sum: "{grossSales} × {refundRate} = {=}", means: "Money handed back." },
    { id: "netSales", label: "Sales after refunds", unit: "money", formula: "grossSales - refunds", sum: "{grossSales} − {refunds} = {=}", means: "What the launch really brings in." },
    { id: "deliveryCost", label: "Cost to deliver to all buyers", unit: "money", formula: "buyers * deliverCost", sum: "{buyers} × {deliverCost} = {=}", means: "Counted for every buyer, refunded or not." },
    { id: "profit", label: "Profit from the launch", unit: "money", formula: "netSales - deliveryCost - adSpend - fixedCost", sum: "{netSales} − {deliveryCost} − {adSpend} ads − {fixedCost} other = {=}", means: [
      { if: "profit < 0", text: "A loss of {=:abs} at these numbers." },
      { if: "profit = 0", text: "You break even exactly." },
      { text: "What the launch leaves you, before your own time." },
    ] },
    { id: "costPerSignup", label: "What you pay in ads for one sign-up", unit: "money", formula: "IF(signups > 0, adSpend / signups, NA())", none: "No sign-ups yet", sum: "{adSpend} ÷ {signups} = {=}", means: "Compare it with what a sign-up is worth, below." },
    { id: "valuePerSignup", label: "What one sign-up is worth, and the most to pay for one", unit: "money", formula: "showRate / 100 * buyRate / 100 * (price * (1 - refundRate / 100) - deliverCost)", sum: "{showRate} × {buyRate} × ({price} × (100% − {refundRate}) − {deliverCost}) = {=}", means: [
      { if: "valuePerSignup <= 0", text: "A sign-up is worth nothing at these rates, so no ad price pays." },
      { text: "Pay more than this for a sign-up and the launch loses money on each one." },
    ] },
    { id: "breakEvenSignups", label: "Sign-ups you need to break even", unit: "count", formula: "IF(valuePerSignup > 0, ROUNDUP((adSpend + fixedCost) / valuePerSignup, 0), NA())", none: "No number of sign-ups", sum: "({adSpend} + {fixedCost}) ÷ {valuePerSignup}, rounded up = {=}", means: [
      { if: "NOT(HAS(breakEvenSignups))", text: "Each sign-up is worth nothing, so more sign-ups cannot cover the costs." },
      { text: "At the same ad spend and costs. More sign-ups from the same ads, or cheaper sign-ups, both get you there." },
    ] },
  ],
  answer: [
    [
      { if: "signups = 0", text: "With no sign-ups there is no launch to plan. Type the sign-ups you expect." },
      { if: "NOT(HAS(breakEvenSignups))", text: "At these rates a sign-up is worth nothing, so the launch loses {profit:abs} however many people sign up. Raise the buy rate, the price or the show-up rate first." },
      { if: "profit < 0", text: "At these numbers {signups} sign-ups give {buyers} buyers and {netSales} in sales after refunds, and the launch loses {profit:abs}. You need {breakEvenSignups} sign-ups to break even, or sign-ups cheaper than {costPerSignup}." },
      { if: "profit = 0", text: "At these numbers {signups} sign-ups give {buyers} buyers and {netSales} in sales after refunds, and the launch breaks even exactly." },
      { text: "At these numbers {signups} sign-ups give {buyers} buyers and {netSales} in sales after refunds, leaving {profit} after ads and costs. You break even at {breakEvenSignups} sign-ups, and each sign-up is worth {valuePerSignup}." },
    ],
    [
      { if: "AND(HAS(breakEvenSignups), costPerSignup > valuePerSignup)", text: "You pay {costPerSignup} for a sign-up that is worth {valuePerSignup}, so every sign-up from ads loses money." },
    ],
  ],
  compare: { input: "buyRate", label: "At other buy rates", values: [2, 5, 10], outputs: ["buyers", "profit", "breakEvenSignups"] },
  next: [
    { slug: "thirty-day-launch-planner", why: "Turn the numbers into a 30-day plan to launch, take payment and decide." },
    { slug: "go-or-no-go-launch-checker", why: "Check the plan for the faults that sink launches before you spend on ads." },
    { if: "profit <= 0", slug: "offer-builder", why: "The offer has to convert better. Rebuild it around why buyers hold back." },
  ],
  sources: [
    { what: "Buyers and sales", how: "Sign-ups × show-up rate × buy rate × price. A standard funnel sum." },
    { what: "Sign-ups to break even", how: "Fixed costs ÷ what one sign-up is worth after refunds and delivery. A standard break-even sum." },
  ],
  notes: [
    "Rates from your last launch are the best guide. If this is your first, run the sum at half the rates you hope for too.",
    "Payment plans that are never finished count as refunds here.",
    "Your own time is not counted. Add it to other launch costs if you want it priced.",
  ],
};
