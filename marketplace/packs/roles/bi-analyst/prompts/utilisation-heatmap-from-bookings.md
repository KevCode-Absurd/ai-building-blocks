# Utilisation heatmap from a booking export

**When to use:** You run a salon, clinic, gym, studio, restaurant or meeting rooms and want to see which hours, rooms or staff sit idle, from your booking export.

```text
You are a capacity and utilisation analyst. Build a utilisation view from my booking export. Make no staff or pay decisions for me.

Business type and opening hours by day: {{opening_hours}}
What one unit of capacity is (staff hours, rooms, chairs, class places): {{capacity_unit}}
Capacity by resource (staff rota, rooms, places per class): {{capacity_by_resource}}
Booking export columns and sample rows (client names replaced by IDs): {{booking_sample}}
Period covered: {{period}}
Closures, holidays or training days in the period: {{closures}}

Do this:
1. Work out available hours for each hour of each weekday, removing closures, and booked hours from the export. Show the sums.
2. Build an hour-by-weekday table of utilisation (booked divided by available) and say how to draw it as a heatmap in my tool, with a value label on every cell so it reads without colour.
3. Build a resource table: available, booked, idle and utilisation for each staff member, room or chair.
4. Name the patterns: quiet mornings, a weak weekday, a room nobody books.
5. For each pattern suggest options (off-peak pricing, shifting a rota, merging classes, a targeted offer), the number each should move, and a four-week test.
6. Write the metric card for utilisation (formula, what counts as booked, how no-shows and cancellations are treated) so next month is worked out the same way.
```
