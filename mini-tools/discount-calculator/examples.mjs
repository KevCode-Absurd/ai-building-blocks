// Worked examples, each checked by hand. Every way the tool is built (site, download, spreadsheet, AI code)
// must give these answers, or it doesn't ship. Practice numbers, not any real business's.
// null means "no answer" (a loss no volume can make up).

export default [
  {
    name: "20% off, any business",
    preset: "general",
    inputs: { price: 60, cost: 24, shipping: 0, fee: 0, roas: 0, discount: 20 },
    // 60 - 24 = 36 at full price. 60 x 0.8 = 48; 48 - 24 = 24 at the discount.
    // 100 x 36 / 24 = 150 orders, so 50% more sales.
    expect: { profitFull: 36, salePrice: 48, profitSale: 24, profitChange: -12, ordersNeeded: 150, extraSales: 50 },
    says: "you need to sell 50% more",
  },
  {
    name: "0% off changes nothing",
    preset: "general",
    inputs: { price: 60, cost: 24, shipping: 0, fee: 0, roas: 0, discount: 0 },
    // 60 - 24 = 36 both ways; 100 x 36 / 36 = 100 orders, 0% more.
    expect: { profitFull: 36, salePrice: 60, profitSale: 36, profitChange: 0, ordersNeeded: 100, extraSales: 0 },
    says: "With no discount you keep $36.00",
  },
  {
    name: "100% off loses the whole cost of the order",
    preset: "general",
    inputs: { price: 60, cost: 24, shipping: 0, fee: 0, roas: 0, discount: 100 },
    // 60 x 0 = 0 paid; 0 - 24 = -24 on every order. No number of orders makes that up.
    expect: { salePrice: 0, profitSale: -24, profitChange: -60, ordersNeeded: null, extraSales: null },
    says: "you lose $24.00 on every order",
  },
  {
    name: "A loss on every order even at full price",
    preset: "general",
    inputs: { price: 20, cost: 25, shipping: 0, fee: 0, roas: 0, discount: 10 },
    // 20 - 25 = -5 at full price. 20 x 0.9 = 18; 18 - 25 = -7 at the discount.
    expect: { profitFull: -5, salePrice: 18, profitSale: -7, profitChange: -2, ordersNeeded: null, extraSales: null },
    says: "You lose $5.00 on every order even at full price",
  },
  {
    name: "Online store, 10% off",
    preset: "ecommerce",
    inputs: { price: 60, cost: 24, shipping: 6, fee: 3, roas: 3, discount: 10 },
    // Ads: 60 / 3 = 20 an order. Fees at full price: 60 x 3% = 1.80.
    // Full price: 60 - 24 - 6 - 1.80 - 20 = 8.20.
    // At 10% off: 54 paid; fees 54 x 3% = 1.62; kept before ads 54 - 24 - 6 - 1.62 = 22.38; after ads 22.38 - 20 = 2.38.
    // Orders: 100 x 8.20 / 2.38 = 344.5378...; 244.54% more. Break-even ROAS: 54 / 22.38 = 2.4129...
    expect: { adCost: 20, feeFull: 1.8, profitFull: 8.2, salePrice: 54, feeSale: 1.62, keptSale: 22.38, profitSale: 2.38, profitChange: -5.82, ordersNeeded: 344.537815, extraSales: 244.537815, breakEvenRoas: 2.412869 },
    says: "you need to sell 244.54% more",
  },
  {
    name: "Online store, 20% off turns a profit into a loss",
    preset: "ecommerce",
    inputs: { price: 60, cost: 24, shipping: 6, fee: 3, roas: 3, discount: 20 },
    // 48 paid; fees 1.44; kept 48 - 24 - 6 - 1.44 = 16.56; after 20 of ads: -3.44. Break-even ROAS: 48 / 16.56 = 2.8986...
    expect: { profitFull: 8.2, salePrice: 48, feeSale: 1.44, keptSale: 16.56, profitSale: -3.44, ordersNeeded: null, extraSales: null, breakEvenRoas: 2.898551 },
    says: "you lose $3.44 on every order",
  },
  {
    name: "Online store with no ads",
    preset: "ecommerce",
    inputs: { price: 60, cost: 24, shipping: 6, fee: 3, roas: 0, discount: 20 },
    // No ads, so 0 an order. Full: 60 - 24 - 6 - 1.80 = 28.20. Sale: 16.56. 100 x 28.20 / 16.56 = 170.2899...
    expect: { adCost: 0, profitFull: 28.2, profitSale: 16.56, ordersNeeded: 170.289855, extraSales: 70.289855, breakEvenRoas: 2.898551 },
  },
  {
    name: "Online store, 100% off: no return on ad spend can pay",
    preset: "ecommerce",
    inputs: { price: 60, cost: 24, shipping: 6, fee: 3, roas: 3, discount: 100 },
    // 0 paid, 0 fees; kept 0 - 24 - 6 = -30; after ads -50.
    expect: { salePrice: 0, feeSale: 0, keptSale: -30, profitSale: -50, ordersNeeded: null, breakEvenRoas: null },
    says: "you lose $50.00 on every order",
  },
];
