// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.
// null means "no answer" (no extra people lost, or no list).

export default [
  {
    name: "Doubling sends loses more than it gains",
    inputs: { listSize: 10000, sendsNow: 4, rpmNow: 40, margin: 40, unsubRate: 0.2, subValue: 12, sendsNew: 8, rpmNew: 35 },
    // Today: 10,000 x 4 / 1,000 = 40 thousand emails x 40 = 1,600 sales x 40% = 640 profit. New: 80 x 35 = 2,800 x 40% = 1,120. Extra 480.
    // Unsubscribes: 40,000 x 0.2% = 80 today; 80,000 x 0.2% = 160 new; 80 extra x 12 = 960 lost. Net 480 - 960 = -480.
    // A lost subscriber would have to be worth under 480 / 80 = 6. Share lost a year: 160 x 12 / 10,000 = 19.2%.
    expect: { profitNow: 640, profitNew: 1120, extraProfit: 480, unsubsNow: 80, unsubsNew: 160, extraUnsubs: 80, lostValue: 960, net: -480, breakEvenValue: 6, shareLostYear: 19.2 },
    says: "$480.00 behind each month",
  },
  {
    name: "Cheap subscribers: sending more pays",
    inputs: { listSize: 10000, sendsNow: 4, rpmNow: 40, margin: 40, unsubRate: 0.2, subValue: 4, sendsNew: 8, rpmNew: 35 },
    // Same sales as above: extra 480. 80 extra lost x 4 = 320. Net 160 ahead.
    expect: { extraProfit: 480, extraUnsubs: 80, lostValue: 320, net: 160, breakEvenValue: 6 },
    says: "$160.00 ahead each month",
  },
  {
    name: "No change in sends",
    inputs: { listSize: 10000, sendsNow: 4, rpmNow: 40, margin: 40, unsubRate: 0.2, subValue: 12, sendsNew: 4, rpmNew: 40 },
    // Both sides the same: 640 profit, 80 unsubscribes. Nothing extra, no limit to check. 80 x 12 / 10,000 = 9.6% a year.
    expect: { profitNow: 640, profitNew: 640, extraProfit: 0, extraUnsubs: 0, lostValue: 0, net: 0, breakEvenValue: null, shareLostYear: 9.6 },
    says: "nothing changes",
  },
  {
    name: "Nobody unsubscribes",
    inputs: { listSize: 5000, sendsNow: 2, rpmNow: 50, margin: 50, unsubRate: 0, subValue: 20, sendsNew: 6, rpmNew: 40 },
    // Today 5,000 x 2 / 1,000 = 10 x 50 = 500 x 50% = 250. New 30 x 40 = 1,200 x 50% = 600. Extra 350. Nobody lost, so net 350 and no limit.
    expect: { profitNow: 250, profitNew: 600, extraProfit: 350, unsubsNow: 0, unsubsNew: 0, extraUnsubs: 0, lostValue: 0, net: 350, breakEvenValue: null, shareLostYear: 0 },
    says: "$350.00 ahead each month",
  },
  {
    name: "Sending less: fewer sales, fewer people lost",
    inputs: { listSize: 10000, sendsNow: 8, rpmNow: 35, margin: 40, unsubRate: 0.2, subValue: 12, sendsNew: 4, rpmNew: 40 },
    // The first example in reverse. Today 1,120; new 640; extra -480. Unsubscribes 160 today, 80 new, -80 extra, worth -960. Net -480 - (-960) = 480 ahead.
    // Extra people lost is negative, so there is no limit to show. Share lost a year 80 x 12 / 10,000 = 9.6%.
    expect: { profitNow: 1120, profitNew: 640, extraProfit: -480, extraUnsubs: -80, lostValue: -960, net: 480, breakEvenValue: null, shareLostYear: 9.6 },
    says: "$480.00 ahead each month",
  },
  {
    name: "An empty list",
    inputs: { listSize: 0, sendsNow: 4, rpmNow: 40, margin: 40, unsubRate: 0.2, subValue: 12, sendsNew: 8, rpmNew: 35 },
    // Everything is zero, and there is no list to work a share from.
    expect: { profitNow: 0, profitNew: 0, extraProfit: 0, unsubsNew: 0, net: 0, breakEvenValue: null, shareLostYear: null },
    says: "nobody on your list",
  },
];
