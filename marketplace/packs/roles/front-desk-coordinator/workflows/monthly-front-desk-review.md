# Monthly front desk review

**Cadence:** Once a month, in the first week. About an hour once the setup is in place.

## Steps

1. **Pull the numbers.** Booking export (attended, no-shows, late cancels, waitlist fills), call logs (missed and abandoned calls, menu options chosen), message logs (failed sends, opt-outs) and new reviews (level 1).
2. **Find the no-show pattern.** Run the `no-show-pattern-from-export` prompt. Compare with last month and with the change made last month, if any.
3. **Check the phone line.** Which menu options are chosen, where callers press 0 or hang up, missed calls by hour. Suggest one change to the menu or staffing, using the `phone-menu-and-call-scripts` skill. *Approval: owner approves menu changes; emergency wording changes need the clinician or vet.*
4. **Reply to reviews.** Use the `privacy-safe-review-replies` skill. At level 3, publish replies to the approved review types; hold the rest with risk notes. *Approval: owner approves held replies.*
5. **Check the messages.** Read a sample of sent reminders for accuracy (dates, places, policy), look at opt-outs and failures, and fix template errors. At level 3, fix typos and dates within the approved wording; anything that changes meaning goes to the owner.
6. **Refresh seasonal content.** Holiday hours, closed messages and hold messages for the coming month. *Approval: owner confirms dates.*
7. **Pick one test.** One change for next month (reminder timing, wording, a waitlist message, a menu change), with how it will be measured.
8. **Report.** One page: no-show and late-cancel rates with arithmetic, waitlist fills, missed calls, opt-outs, reviews answered and held, the test for next month, and the action log.

## Outputs

- Monthly one-page report with figures and arithmetic
- Review replies published or held
- Updated templates and seasonal greetings
- One test for next month
- Action log

## Needs the client's approval

Menu and emergency wording changes, held review replies, any change to fees or policy, new message types, and holiday dates.
