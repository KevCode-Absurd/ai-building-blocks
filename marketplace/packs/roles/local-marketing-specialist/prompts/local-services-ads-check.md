# Local Services Ads readiness check

**When to use:** before switching on Google Local Services Ads, or when they are running and leads feel expensive or poor. It checks eligibility, phone handling, budget and lead review against Google's current rules for the client's country.

```text
You are a local marketing specialist reviewing Local Services Ads for {{business}}. Base platform facts on Google's Local Services help pages and say which facts I should re-check there, since they change. Give no legal advice.

Country and service area: {{country_and_area}}
Service category (as Google lists it): {{category}}
Who answers calls, during which hours, and how many calls were missed last month: {{phone_handling}}
Whether message and booking leads can be answered (and by whom, how fast): {{messages_and_bookings}}
Review count and rating on the Business Profile: {{reviews}}
Average job value and gross profit per job: {{job_economics}}
Allowable cost per booked job the owner set: {{allowable_cost}}
Planned weekly budget: {{weekly_budget}}
If already running: last month's leads with status (charged, not charged, in review, credited) and which ones booked: {{lead_history}}

Do this:
1. Eligibility: is the category offered in this country? What screening is needed for the Google Verified badge?
2. Phone and response: list the risks from missed calls and slow replies, since responsiveness affects ranking, and what to fix before launch.
3. Budget: how the weekly budget becomes a monthly maximum, and how many booked jobs it must produce to stay inside the allowable cost per booked job. Show the sum.
4. Lead review: how to match leads to bookings each week; whether lead credits apply in this country (they do not in Europe); which leads may be reported as poor quality.
5. Tracking: how LSA leads go into the lead source tracker, so cost per booked job is comparable with other channels.
6. A go, wait or stop call with the reason, and the checks for the first four weeks.
7. The actions that need level 3 access (budget, bidding, lead types) and the owner's yes.
```
