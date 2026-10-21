// Landed cost. The single source of truth for this mini tool.
//
// Maths: goods total = supplier price x units. Duty = duty rate x the amount duty is charged on (the goods, plus freight if
// you say so). Total landed cost = goods + freight + duty + other fees. Cost per unit = total landed cost / units shipped.
// Some units are lost or unsellable, so cost per sellable unit = total landed cost / (units x (1 - lost share)).
// Profit per unit = selling price - cost per sellable unit.
// Standard landed cost formulas, written in our own words. The duty rate is yours to type; this tool never looks one up.

export default {
  slug: "landed-cost",
  name: "Know what one unit really costs on your shelf",
  /** The plain name, used where the tool talks about itself. */
  short: "Landed cost",
  headline: "Know what one unit really costs once it reaches your shelf",
  summary: "Type the supplier price, freight, your duty rate, fees and units in the shipment. You get the true cost of one unit and what it leaves you.",
  question: "What does one unit really cost me after freight, duty and fees, and how much is left when I sell it?",
  shelf: ["general", "ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [
    { id: "general", label: "Any business" },
    { id: "ecommerce", label: "Online store" },
  ],
  inputs: [
    {
      id: "unitPrice", label: "Supplier price for one unit", unit: "smallmoney", example: 8, min: 0, max: 1e9, step: 0.1,
      help: "The price on your supplier's quote or invoice, for one unit, before anything else is added.",
      where: "Your supplier quote or commercial invoice.",
      tools: ["Your supplier quote", "Your purchase order", "Your accounts software"],
    },
    {
      id: "units", label: "Units in the shipment", unit: "count", example: 1000, min: 1, max: 1e9, step: 10, integer: true,
      help: "How many units you paid for in this one shipment.",
      where: "Your purchase order or packing list.",
      tools: ["Your purchase order", "Your packing list"],
    },
    {
      id: "freight", label: "Freight for the whole shipment", unit: "money", example: 1200, min: 0, max: 1e10, step: 50,
      help: "What you pay to move the whole shipment to your door or warehouse, including any insurance on the goods.",
      where: "Your freight forwarder's quote or invoice.",
      tools: ["Your freight forwarder", "Your shipping invoice", "Your shipment tracker"],
    },
    {
      id: "dutyRate", label: "Duty rate", unit: "percent", example: 10, min: 0, max: 500, step: 0.5,
      help: "The import duty rate for your product and route. Type your own rate. Check it with a customs broker before you rely on it.",
      where: "Your customs broker, or your country's tariff lookup, using your product code.",
      tools: ["A customs broker", "Your country's tariff lookup", "Your freight forwarder"],
    },
    {
      id: "dutyOnFreight", label: "Is duty also charged on freight? 1 for yes, 0 for no", unit: "count", example: 1, min: 0, max: 1, step: 1, integer: true,
      help: "Some countries charge duty on goods only. Others charge it on goods plus freight and insurance. Ask your customs broker which applies to you.",
      where: "Your customs broker, or an earlier customs bill.",
      tools: ["A customs broker", "An earlier customs bill"],
    },
    {
      id: "fees", label: "Other fees for the whole shipment", unit: "money", example: 300, min: 0, max: 1e10, step: 50,
      help: "Broker fees, port and handling charges, inspection, packaging and anything else you paid to land the goods. Leave out duty and freight.",
      where: "Your customs broker and forwarder invoices for this shipment.",
      tools: ["Your customs broker invoice", "Your freight forwarder", "Your accounts software"],
    },
    {
      id: "lostShare", label: "Share of units you cannot sell", unit: "percent", example: 3, min: 0, max: 99, step: 0.5,
      help: "Faulty, damaged or lost units, and any spares you keep back. Use 0 if you expect none.",
      where: "Your last inspection report or your returns and write-offs for the same product.",
      tools: ["Your inspection report", "Your stock write-off records", "Your returns report"],
    },
    {
      id: "sellPrice", label: "Price you sell one unit for", unit: "money", example: 25, min: 0, max: 1e9, step: 1,
      help: "Your selling price for one unit, without sales tax. Use 0 to skip the profit lines.",
      where: "Your product listing or price list.",
      tools: ["Your store admin", "Your price list"],
    },
  ],
  outputs: [
    {
      id: "goodsTotal", label: "Goods in the shipment", unit: "money",
      formula: "unitPrice * units",
      sum: "{unitPrice} × {units} = {=}",
      means: "What you pay the supplier, before freight, duty and fees.",
    },
    {
      id: "dutyTotal", label: "Duty on the shipment", unit: "money",
      formula: "(goodsTotal + dutyOnFreight * freight) * dutyRate / 100",
      sum: "({goodsTotal} + {dutyOnFreight} × {freight}) × {dutyRate} = {=}",
      means: [
        { if: "dutyRate = 0", text: "You typed no duty. If that is not right, check the rate with a customs broker." },
        { text: "Based on the rate you typed. Check it with a customs broker, as rates depend on your product code, country and route." },
      ],
    },
    {
      id: "landedTotal", label: "Total landed cost of the shipment", unit: "money",
      formula: "goodsTotal + freight + dutyTotal + fees",
      sum: "{goodsTotal} goods + {freight} freight + {dutyTotal} duty + {fees} fees = {=}",
      means: "Everything you paid to get the goods to your shelf.",
    },
    {
      id: "sellableUnits", label: "Units you can sell", unit: "number",
      formula: "units * (1 - lostShare / 100)",
      sum: "{units} × (100% − {lostShare}) = {=}",
      means: "The units left once the ones you cannot sell are taken out.",
    },
    {
      id: "landedPerUnit", label: "Landed cost per unit shipped", unit: "money",
      formula: "IF(units > 0, landedTotal / units, 0)",
      sum: "{landedTotal} ÷ {units} = {=}",
      means: "The cost of each unit if every one could be sold.",
    },
    {
      id: "costPerSellable", label: "True cost of one unit you can sell", unit: "money",
      formula: "IF(sellableUnits > 0, landedTotal / sellableUnits, NA())",
      none: "No units to sell",
      sum: "{landedTotal} ÷ {sellableUnits} = {=}",
      means: "Use this as the cost per item in your store, so your profit reports are true.",
    },
    {
      id: "addOnShare", label: "How much more than the supplier price", unit: "percent",
      formula: "IF(AND(unitPrice > 0, HAS(costPerSellable)), (costPerSellable - unitPrice) / unitPrice * 100, 0)",
      sum: "({costPerSellable} − {unitPrice}) ÷ {unitPrice} = {=}",
      means: "How far the real cost sits above the quote.",
    },
    {
      id: "profitPerUnit", label: "Profit on one unit sold", unit: "money",
      formula: "IF(AND(sellPrice > 0, HAS(costPerSellable)), sellPrice - costPerSellable, NA())",
      none: "No selling price typed",
      sum: "{sellPrice} − {costPerSellable} = {=}",
      means: [
        { if: "NOT(HAS(profitPerUnit))", text: "Type a selling price to see what each unit leaves you." },
        { if: "profitPerUnit < 0", text: "A loss: you lose {=:abs} on every unit before selling fees, shipping to the customer and ads." },
        { text: "Before selling fees, shipping to the customer and ads, which come off this." },
      ],
    },
    {
      id: "marginPct", label: "Share of the selling price you keep", unit: "percent",
      formula: "IF(AND(sellPrice > 0, HAS(profitPerUnit)), profitPerUnit / sellPrice * 100, NA())",
      none: "No selling price typed",
      sum: "{profitPerUnit} ÷ {sellPrice} = {=}",
      means: "Also before selling fees, shipping to the customer and ads.",
    },
  ],
  answer: [
    [
      { if: "NOT(HAS(costPerSellable))", text: "There are no units left to sell, so there is no cost per unit." },
      { text: "One unit you can sell costs {costPerSellable} on your shelf, {addOnShare} more than the supplier price of {unitPrice}. That adds {freight} freight, {dutyTotal} duty at the rate you typed and {fees} fees over {sellableUnits} sellable units. Check the duty rate with a customs broker." },
    ],
    [
      { if: "NOT(HAS(profitPerUnit))", text: "Type your selling price to see what each unit leaves you." },
      { if: "profitPerUnit < 0", text: "At {sellPrice} each you lose {profitPerUnit:abs} on every unit, before selling fees, delivery to the customer and ads." },
      { text: "At {sellPrice} each you keep {profitPerUnit} a unit, or {marginPct} of the price, before selling fees, delivery to the customer and ads." },
    ],
  ],
  next: [
    { slug: "landed-cost-calculator", why: "Add warehouse, courier and fees per order, and get a go or no-go score." },
    { slug: "inventory-cash-planner", why: "Turn this shipment into the cash you need and when it leaves your account." },
    { slug: "supplier-quote-comparer", why: "Put this cost next to other suppliers' quotes, side by side." },
  ],
  sources: [
    { what: "Landed cost", how: "Goods plus freight, duty and fees, divided by the units you can sell. The standard landed cost sum." },
    { what: "Duty", how: "Your duty rate × the amount duty is charged on. You type the rate. Check it with a customs broker." },
  ],
  notes: [
    "The duty rate is yours to type. Rates depend on your product code, country and route, and some trade deals remove duty. Check with a customs broker.",
    "Sales tax and import taxes you can claim back are left out. Check with a qualified person.",
    "Profit here comes before selling fees, delivery to the customer and ads. It says nothing about what customers will pay.",
  ],
};
