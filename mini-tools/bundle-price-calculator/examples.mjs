// Worked examples, each checked by hand. Practice numbers, not any real business's.
// null means "no answer".

export default [
  {
    name: "Two products, 15% saving, margin to spare",
    inputs: { items: 2, fullTotal: 60, cost: 18, shipping: 6, fee: 3, margin: 40, saving: 15 },
    // Lowest price for a 40% margin: (18 + 6) / (1 - 0.03 - 0.40) = 24 / 0.57 = 42.1053. Saving price: 60 x 0.85 = 51.
    // Higher is 51, so it shows 15% off. Fees 51 x 3% = 1.53; profit 51 - 18 - 6 - 1.53 = 25.47; margin 25.47 / 51 = 49.94%.
    // Single sale: one product at 60 / 2 = 30, cost 9: 30 - 9 - 6 - 0.90 = 14.10.
    // Bundles for 100 single sales: 100 x 14.10 / 25.47 = 55.36, so 44.64% fewer.
    expect: { floorPrice: 42.105263, dealPrice: 51, bundlePrice: 51, shows: 15, bundleProfit: 25.47, bundleMargin: 49.941176, singleProfit: 14.1, per100: 55.359246, extraBundles: -44.640754 },
    says: "Set the price at $51.00",
  },
  {
    name: "Three products with no saving",
    inputs: { items: 3, fullTotal: 90, cost: 27, shipping: 6, fee: 0, margin: 30, saving: 0 },
    // Floor: 33 / 0.70 = 47.1429. Saving price 90 x 1 = 90. Price 90, shows 0% off.
    // Profit 90 - 27 - 6 = 57; margin 57 / 90 = 63.33%. Single sale: 30 - 9 - 6 = 15. 100 x 15 / 57 = 26.32 bundles.
    expect: { floorPrice: 47.142857, bundlePrice: 90, shows: 0, bundleProfit: 57, bundleMargin: 63.333333, singleProfit: 15, per100: 26.315789, extraBundles: -73.684211 },
    says: "shows 0% off",
  },
  {
    name: "Shipping is small, so bundles must outsell single sales",
    inputs: { items: 2, fullTotal: 60, cost: 18, shipping: 0, fee: 3, margin: 40, saving: 40 },
    // Floor: 18 / 0.57 = 31.58. Saving price 60 x 0.60 = 36. Price 36. Fees 1.08; profit 36 - 18 - 1.08 = 16.92 (47%).
    // Single sale: 30 - 9 - 0 - 0.90 = 20.10. 100 x 20.10 / 16.92 = 118.79, so 18.79% more bundles.
    expect: { floorPrice: 31.578947, bundlePrice: 36, shows: 40, bundleProfit: 16.92, bundleMargin: 47, singleProfit: 20.1, per100: 118.794326, extraBundles: 18.794326 },
    says: "you need 18.79% more bundles than single sales",
  },
  {
    name: "A loss on every single sale",
    inputs: { items: 2, fullTotal: 40, cost: 45, shipping: 5, fee: 0, margin: 10, saving: 10 },
    // Floor: 50 / 0.90 = 55.56. Saving price 36. Price 55.56, which shows 1 - 55.56 / 40 = -38.89%.
    // Profit 55.56 - 45 - 5 = 5.56. Single sale: 20 - 22.50 - 5 = -7.50, a loss, so no comparison.
    expect: { floorPrice: 55.555556, bundlePrice: 55.555556, shows: -38.888889, bundleProfit: 5.555556, singleProfit: -7.5, per100: null, extraBundles: null },
    says: "no sales comparison",
  },
  {
    name: "Fees and margin take all of the price",
    inputs: { items: 2, fullTotal: 60, cost: 18, shipping: 6, fee: 40, margin: 60, saving: 15 },
    // 1 - 0.40 - 0.60 = 0, so no price can meet it.
    expect: { floorPrice: null, dealPrice: 51, bundlePrice: null, shows: null, bundleProfit: null, bundleMargin: null, per100: null, extraBundles: null },
    says: "no bundle price works",
  },
  {
    name: "A 100% saving is held back by the margin",
    inputs: { items: 2, fullTotal: 60, cost: 18, shipping: 6, fee: 3, margin: 40, saving: 100 },
    // Saving price 60 x 0 = 0. Floor 42.1053 is higher, so that is the price: it shows 1 - 42.1053 / 60 = 29.82% off.
    // Fees 42.1053 x 3% = 1.2632; profit 42.1053 - 24 - 1.2632 = 16.8421 (40%). Single 14.10: 100 x 14.10 / 16.8421 = 83.72.
    expect: { dealPrice: 0, bundlePrice: 42.105263, shows: 29.824561, bundleProfit: 16.842105, bundleMargin: 40, per100: 83.71875, extraBundles: -16.28125 },
    says: "not the 100% you wanted",
  },
];
