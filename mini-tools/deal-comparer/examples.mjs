// Worked examples, each checked by hand. Practice numbers, not any real business's.
const item = { price: 30, cost: 9, shipping: 6, fee: 3 };
const rest = { deep: 30, light: 15, giftCost: 4, credit: 10, creditUsed: 60 };

export default [
  {
    name: "Buy 2, get 1 free against 33% off",
    inputs: { ...item, buy: 2, extra: 1, extraOff: 100, ...rest },
    // Full price: 30 - 9 - 6 - 0.90 = 14.10. Deal: 3 items, they pay 30 x 2 = 60, which is 1 - 60 / 90 = 33.33% off.
    // Deal profit: 60 - 27 - 6 - 1.80 = 25.20. One item at 33.33% off: 20 paid; 20 - 9 - 6 - 0.60 = 4.40. Deal keeps 20.80 more.
    // Gift: 30 x 0.70 x 0.97 = 20.37; - 15 = 5.37. Gift deal: 30 x 0.85 x 0.97 = 24.735; - 15 - 4 = 5.735. Gift keeps 0.365 more.
    // Credit: 10 x 60% x 9 / 30 = 1.80. Money off now: 10 x 0.97 = 9.70. Credit saves 7.90.
    expect: { fullProfit: 14.1, dealItems: 3, dealPays: 60, dealOff: 33.333333, dealProfit: 25.2, flatPays: 20, flatProfit: 4.4, dealVsFlat: 20.8, deepProfit: 5.37, giftProfit: 5.735, giftGain: 0.365, cashCost: 9.7, creditCost: 1.8, creditSaves: 7.9 },
    says: "keeps $20.80 more an order than 33.33% off one item",
  },
  {
    name: "Buy 1, get 1 half price",
    inputs: { ...item, buy: 1, extra: 1, extraOff: 50, ...rest },
    // 30 x 1.5 = 45 for 2 items: 1 - 45 / 60 = 25% off. 45 - 18 - 6 - 1.35 = 19.65.
    // One item at 25% off: 22.50; 22.50 - 9 - 6 - 0.675 = 6.825. Deal keeps 12.825 more.
    expect: { dealItems: 2, dealPays: 45, dealOff: 25, dealProfit: 19.65, flatPays: 22.5, flatProfit: 6.825, dealVsFlat: 12.825 },
  },
  {
    name: "A second item at no discount is no deal",
    inputs: { ...item, buy: 1, extra: 1, extraOff: 0, ...rest },
    // 60 for 2 items, 0% off. 60 - 18 - 6 - 1.80 = 34.20 against one full-price item at 14.10.
    expect: { dealPays: 60, dealOff: 0, dealProfit: 34.2, flatProfit: 14.1, dealVsFlat: 20.1 },
  },
  {
    name: "A free item on a thin margin loses money",
    inputs: { price: 10, cost: 6, shipping: 5, fee: 0, buy: 1, extra: 1, extraOff: 100, ...rest },
    // 10 paid for 2 items: 10 - 12 - 5 = -7. One item at 50% off: 5 - 6 - 5 = -6.
    expect: { dealPays: 10, dealOff: 50, dealProfit: -7, flatProfit: -6, dealVsFlat: -1 },
    says: "Buy 1, get 1 loses $7.00 on every order",
  },
  {
    name: "100% off as the deeper discount",
    inputs: { ...item, buy: 2, extra: 1, extraOff: 100, deep: 100, light: 15, giftCost: 4, credit: 10, creditUsed: 60 },
    // 0 paid; 0 - 9 - 6 = -15. The gift deal keeps 5.735 - (-15) = 20.735 more.
    expect: { deepProfit: -15, giftProfit: 5.735, giftGain: 20.735 },
    says: "Some of these deals lose money on every order",
  },
  {
    name: "Credit nobody spends, and credit everybody spends",
    inputs: { ...item, buy: 2, extra: 1, extraOff: 100, deep: 30, light: 15, giftCost: 4, credit: 10, creditUsed: 0 },
    expect: { creditCost: 0, cashCost: 9.7, creditSaves: 9.7 },
  },
  {
    name: "All credit spent",
    inputs: { ...item, buy: 2, extra: 1, extraOff: 100, deep: 30, light: 15, giftCost: 4, credit: 10, creditUsed: 100 },
    // 10 x 100% x 9 / 30 = 3.
    expect: { creditCost: 3, creditSaves: 6.7 },
  },
];
