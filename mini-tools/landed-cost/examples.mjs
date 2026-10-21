// Worked examples, each checked by hand. Practice numbers, not any real figures or rates.
// null means "no answer".

export default [
  {
    name: "A 1,000-unit shipment with 10% duty on goods and freight",
    inputs: { unitPrice: 8, units: 1000, freight: 1200, dutyRate: 10, dutyOnFreight: 1, fees: 300, lostShare: 3, sellPrice: 25 },
    // Goods 8 x 1,000 = 8,000. Duty: (8,000 + 1,200) x 10% = 920. Landed: 8,000 + 1,200 + 920 + 300 = 10,420.
    // Per unit shipped: 10,420 / 1,000 = 10.42. Sellable: 1,000 x 97% = 970. Per sellable: 10,420 / 970 = 10.742268.
    // Over the quote: (10.742268 - 8) / 8 = 34.278%. Profit: 25 - 10.742268 = 14.257732. Share: 14.257732 / 25 = 57.031%.
    expect: { goodsTotal: 8000, dutyTotal: 920, landedTotal: 10420, sellableUnits: 970, landedPerUnit: 10.42, costPerSellable: 10.742268, addOnShare: 34.27835, profitPerUnit: 14.257732, marginPct: 57.030928 },
    says: "One unit you can sell costs $10.74",
  },
  {
    name: "Duty on goods only",
    inputs: { unitPrice: 8, units: 1000, freight: 1200, dutyRate: 10, dutyOnFreight: 0, fees: 300, lostShare: 3, sellPrice: 25 },
    // Duty: 8,000 x 10% = 800. Landed: 8,000 + 1,200 + 800 + 300 = 10,300. Per sellable: 10,300 / 970 = 10.618557.
    // Profit: 25 - 10.618557 = 14.381443.
    expect: { dutyTotal: 800, landedTotal: 10300, costPerSellable: 10.618557, profitPerUnit: 14.381443 },
  },
  {
    name: "No duty, no losses, no selling price",
    inputs: { unitPrice: 5, units: 200, freight: 100, dutyRate: 0, dutyOnFreight: 0, fees: 0, lostShare: 0, sellPrice: 0 },
    // Goods 1,000. Landed 1,000 + 100 = 1,100. Per unit 5.50. Over the quote: 0.50 / 5 = 10%. No price, so no profit.
    expect: { goodsTotal: 1000, dutyTotal: 0, landedTotal: 1100, landedPerUnit: 5.5, costPerSellable: 5.5, addOnShare: 10, profitPerUnit: null, marginPct: null },
    says: "Type your selling price",
  },
  {
    name: "A loss on every unit",
    inputs: { unitPrice: 10, units: 100, freight: 500, dutyRate: 20, dutyOnFreight: 0, fees: 100, lostShare: 10, sellPrice: 12 },
    // Goods 1,000. Duty 200. Landed: 1,000 + 500 + 200 + 100 = 1,800. Sellable 90. Per sellable 20.
    // Over the quote: (20 - 10) / 10 = 100%. Profit: 12 - 20 = -8. Share: -8 / 12 = -66.667%.
    expect: { landedTotal: 1800, sellableUnits: 90, costPerSellable: 20, addOnShare: 100, profitPerUnit: -8, marginPct: -66.666667 },
    says: "you lose $8.00 on every unit",
  },
  {
    name: "A free sample with only freight and duty",
    inputs: { unitPrice: 0, units: 50, freight: 100, dutyRate: 10, dutyOnFreight: 1, fees: 0, lostShare: 0, sellPrice: 5 },
    // Goods 0. Duty: (0 + 100) x 10% = 10. Landed 110. Per unit 2.20. The quote is 0, so the share over it is 0.
    // Profit: 5 - 2.20 = 2.80. Share: 2.80 / 5 = 56%.
    expect: { goodsTotal: 0, dutyTotal: 10, landedTotal: 110, costPerSellable: 2.2, addOnShare: 0, profitPerUnit: 2.8, marginPct: 56 },
  },
  {
    name: "Half the units cannot be sold",
    inputs: { unitPrice: 2, units: 1000, freight: 0, dutyRate: 5, dutyOnFreight: 0, fees: 0, lostShare: 50, sellPrice: 3 },
    // Goods 2,000. Duty 100. Landed 2,100. Per unit 2.10. Sellable 500. Per sellable 4.20.
    // Over the quote: (4.20 - 2) / 2 = 110%. Profit: 3 - 4.20 = -1.20. Share: -1.20 / 3 = -40%.
    expect: { landedTotal: 2100, sellableUnits: 500, landedPerUnit: 2.1, costPerSellable: 4.2, addOnShare: 110, profitPerUnit: -1.2, marginPct: -40 },
  },
];
