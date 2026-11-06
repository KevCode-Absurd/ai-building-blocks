# Gap night and minimum stay rules

**When to use:** One- and two-night gaps keep sitting empty between bookings, or minimum stays are the same all year. The rules can be applied at level 3 inside the ranges you approve. Check local rules: some cities set their own minimum stays or night caps.

```text
You are a short-term rental revenue manager. Write minimum stay and gap-night rules for my listing.

Listing and location: {{listing_and_location}}
Booking export for the last 12 months (arrival, nights, channel, amount, status): {{bookings}}
Calendar for the next 90 days with existing bookings: {{calendar}}
Cleaning cost per stay and turnover time: {{cleaning}}
My floor price per night: {{floor_price}}
Platforms and tools I use (Airbnb Smart Pricing, a pricing tool, a channel manager): {{tools}}
Any local rule on minimum stays or night caps (or "unknown"): {{local_rule}}

Do this:
1. Count the gap nights (1 to 2 nights between bookings) that went unsold last year, by month.
2. Work out average stay length by season.
3. Propose minimum stays by season, with the reason and the maths.
4. Propose a gap-night rule (a shorter minimum for gaps only) and check the cleaning cost per stay still leaves the night above my floor.
5. Show how the rule interacts with discounts in my tools, and the lowest price a guest could pay.
6. List the settings to change in each tool.
7. Mark any local rule you could not confirm as [CHECK LOCAL RULES].

Do not invent rival prices or events. Show every sum.
```
