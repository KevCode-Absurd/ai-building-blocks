# Separate price savings from payment timing

Use this calculator when a negotiation changes price, deposit percentage or the quantity on which a deposit is charged. It returns goods values, deposits, remaining goods payments and two explicit decompositions. It does not establish a funded order, accepted terms, full landed cost or profit.

## Declare the actual basis

Copy the illustrative input into context and replace every value and source reference. Declare currency and its verified minor-unit precision. Rates are integer basis points: 3000 means 30%, 1250 means 12.5%. Deposits round half up to the declared currency minor unit. Finer unit-price precision is rejected; agree the invoice calculation before proceeding.

Each side needs the full binding order quantity and the exact quantity whose goods value is the deposit basis. For a 1,000-unit order with a deposit only on a 250-unit release, declare orderQuantity 1000 and depositQuantity 250. Never apply a whole-order percentage to a release without saying so. basisRef identifies the same product/specification, commercial scope and initial payment event. Different references or unequal order/deposit quantities return NOT_COMPARABLE and no savings decomposition. The separate totals remain visible. Obtain a like-for-like quote before claiming a saving; do not relabel different terms to force comparability.

~~~sh
node tools/payment-terms.mjs context/payment-terms.json
~~~

The tool reads one bounded local input and emits JSON to stdout. It does not write files, overwrite evidence or connect to a supplier. Save its output as a new context or output artifact using the host, retaining earlier versions. Paths must stay within the current project; linked paths are rejected.

## Read the quantities correctly

- goodsPriceReduction compares full-order goods prices only. It excludes changes in freight, tax, fees and other costs.
- initialDepositReduction is the difference between the two initial deposits.
- remainingGoodsPaymentsChange is the new remaining goods balance minus the old balance. Positive means more must be paid later.
- priceFirst first changes the price while keeping the old deposit rate, then changes the rate on the new price.
- rateFirst first changes the rate on the old price, then changes the price. These are alternative decompositions, not amounts to combine.
- Each decomposition sums to deposit reduction. Deposit reduction minus the increase in remaining goods payments equals total goods-price reduction.

For example, 100 units changing from 10 to 9 currency units and 40% to 25% deposits reduce goods value by 100 and the deposit by 175. The price-first deposit effects are 40 from price and 135 from rate; the remaining goods balance rises by 75. The full 100 goods saving is not the price component of the 175 deposit change.

Generate final numbers from the saved result. Compare every delivered headline, table and concession explanation with that result, including negative values and the quantity basis. Do not call the total deposit reduction profit, add it to price savings, or subtract the whole-order price saving to invent a deposit-rate effect. The calculator does not check final report prose.

## Finish the negotiation work

Dates, release-specific balance triggers, inspection gates, title/storage liability and the funding schedule still need explicit agreement. Map every proposed instalment to quantity, invoice base and dated event. A 40% payment after inspecting the first release is ambiguous until its quantity base is written down. Reconcile existing purchase obligations separately and test the whole cash forecast before commitment. Unknown equivalence, missing costs or missing authority stay unresolved.
