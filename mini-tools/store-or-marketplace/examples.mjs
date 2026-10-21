// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.
// null means "no answer" (no price to divide by).

export default [
  {
    name: "A close call that the marketplace wins by 20 cents",
    inputs: { price: 40, cogs: 12, orders: 300, storeFee: 3, storeShip: 6, storeAd: 10, marketFee: 15, marketFulfil: 7, marketAd: 4 },
    // Store: 40 x 3% = 1.20 + 6 + 10 = 17.20; keeps 40 - 12 - 17.20 = 10.80 (27%). Marketplace: 6 + 7 + 4 = 17; keeps 11 (27.5%).
    // Gap -0.20 an order, -60 a month. Fee at which both keep the same: (40 - 12 - 7 - 4 - 10.80) / 40 = 6.20 / 40 = 15.5%.
    expect: { storeCosts: 17.2, storeKept: 10.8, storePct: 27, marketCosts: 17, marketKept: 11, marketPct: 27.5, gap: -0.2, gapMonth: -60, matchFee: 15.5 },
    says: "the marketplace keeps $0.20 more",
  },
  {
    name: "Cheaper ads on your store make it win",
    inputs: { price: 40, cogs: 12, orders: 300, storeFee: 3, storeShip: 6, storeAd: 5, marketFee: 15, marketFulfil: 7, marketAd: 4 },
    // Store costs 1.20 + 6 + 5 = 12.20; keeps 15.80 (39.5%). Marketplace still keeps 11. Gap 4.80, 1,440 a month. Match fee (40 - 12 - 7 - 4 - 15.80) / 40 = 1.20 / 40 = 3%.
    expect: { storeCosts: 12.2, storeKept: 15.8, storePct: 39.5, marketKept: 11, gap: 4.8, gapMonth: 1440, matchFee: 3 },
    says: "your store keeps $4.80 more",
  },
  {
    name: "No price typed",
    inputs: { price: 0, cogs: 12, orders: 300, storeFee: 3, storeShip: 6, storeAd: 10, marketFee: 15, marketFulfil: 7, marketAd: 4 },
    // Store costs 0 + 6 + 10 = 16; keeps -28. Marketplace costs 11; keeps -23. Gap -5, -1,500 a month. No shares of a zero price.
    expect: { storeCosts: 16, storeKept: -28, storePct: null, marketCosts: 11, marketKept: -23, marketPct: null, gap: -5, gapMonth: -1500, matchFee: null },
    says: "Type the price of one order",
  },
  {
    name: "Both keep exactly the same",
    inputs: { price: 40, cogs: 12, orders: 300, storeFee: 3, storeShip: 6, storeAd: 10, marketFee: 15, marketFulfil: 7, marketAd: 4.2 },
    // Marketplace costs 6 + 7 + 4.20 = 17.20, the same as the store. Both keep 10.80. Gap 0. Match fee (40 - 12 - 7 - 4.20 - 10.80) / 40 = 6 / 40 = 15%, the fee it has now.
    expect: { marketCosts: 17.2, marketKept: 10.8, gap: 0, gapMonth: 0, matchFee: 15 },
    says: "both keep $10.80 an order",
  },
  {
    name: "Goods so dear that both channels lose",
    inputs: { price: 40, cogs: 30, orders: 300, storeFee: 3, storeShip: 6, storeAd: 10, marketFee: 15, marketFulfil: 7, marketAd: 4 },
    // Store keeps 40 - 30 - 17.20 = -7.20. Marketplace keeps 40 - 30 - 17 = -7. Gap -0.20. Match fee (40 - 30 - 7 - 4 + 7.20) / 40 = 15.5%.
    expect: { storeKept: -7.2, marketKept: -7, gap: -0.2, gapMonth: -60, matchFee: 15.5 },
    says: "Neither channel keeps anything",
  },
  {
    name: "No orders yet",
    inputs: { price: 40, cogs: 12, orders: 0, storeFee: 3, storeShip: 6, storeAd: 5, marketFee: 15, marketFulfil: 7, marketAd: 4 },
    // Same 4.80 gap an order as the second example, but 0 orders, so 0 a month.
    expect: { gap: 4.8, gapMonth: 0, matchFee: 3 },
    says: "$0.00 a month at 0 orders",
  },
];
