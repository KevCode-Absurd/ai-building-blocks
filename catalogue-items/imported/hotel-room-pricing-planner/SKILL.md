---
name: hotel-inventory-management
description: When the user wants to optimize hotel room inventory, manage rate strategies, or improve revenue management. Also use when the user mentions "hotel revenue management," "room allocation," "yield management," "dynamic pricing," "overbooking optimization," "distribution channel management," or "hotel capacity planning." For tour operations, see tour-operations. For hospitality procurement, see hospitality-procurement.
---

# Hotel Inventory Management

You are an expert in hotel inventory management and revenue optimization. Your goal is to help maximize hotel revenue through optimal room allocation, dynamic pricing, distribution channel management, and capacity planning while balancing occupancy and average daily rate (ADR).

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** Claude, ChatGPT or Gemini can read pasted bookings and show the maths step by step.
- **A spreadsheet tool:** Google Sheets or Excel can hold your bookings so you paste clean rows.
<!-- /needs -->

## When not to use this skill

- Tour or package planning: use tour-operations.
- Buying for the hotel (linens, food, supplies): use hospitality-procurement.
- No booking history at all (a property that has not opened): ask for a competitor rate sample and flag that every number is a rough guess.

## How to run it

- No code is needed. In a chat, work from the numbers the person gives you and show the maths step by step.
- The Python examples below are for a person who wants to run them. They need Python 3 with numpy, pandas, scipy, pulp and scikit-learn installed.
- Every price, rate, commission, probability and room count in the code examples and the output layout is a placeholder. Never present one as real market data. Use only numbers the person gave you.
- If an input is missing, ask for it once. If it is still missing, mark it MISSING in the answer and say what it would change. Never fill the gap with a made-up figure.

## Initial Assessment

Before optimizing hotel inventory, understand:

1. **Property Characteristics**
   - Property type? (luxury, midscale, budget, resort, limited service)
   - Number of rooms and room types?
   - Location and market segment? (urban, resort, airport, suburban)
   - Seasonal patterns?

2. **Current Performance**
   - Occupancy rate and trends?
   - Average daily rate (ADR)?
   - Revenue per available room (RevPAR)?
   - Booking pace and lead times?

3. **Distribution Channels**
   - Direct bookings? (website, phone, walk-in)
   - OTAs? (Booking.com, Expedia, etc.)
   - GDS? (Amadeus, Sabre, Travelport)
   - Corporate contracts and groups?

4. **Objectives & Constraints**
   - Primary goals? (maximize revenue, occupancy, ADR)
   - Competitive position?
   - Brand standards or restrictions?
   - Technology systems in place? (PMS, RMS, CRS)

---

## Hotel Inventory Framework

### Revenue Management Fundamentals

**Key Metrics:**
- **ADR (Average Daily Rate)**: Total room revenue / Rooms sold
- **Occupancy**: Rooms sold / Rooms available
- **RevPAR (Revenue Per Available Room)**: Total room revenue / Rooms available = ADR × Occupancy
- **TRevPAR (Total RevPAR)**: Total property revenue / Rooms available

**Revenue Optimization Equation:**
```
Total Revenue = Σ (Rate_i × Rooms_Sold_i) across all segments/channels
```

Goal: Maximize Total Revenue subject to capacity constraints

---

## Dynamic Pricing Optimization

### Price Elasticity-Based Pricing

```python
import numpy as np
import pandas as pd
from scipy.optimize import minimize
from datetime import datetime, timedelta

class HotelPricingOptimizer:
    """
    Optimize hotel room pricing based on demand forecasts and price elasticity
    """

    def __init__(self, total_rooms, room_types):
        self.total_rooms = total_rooms
        self.room_types = room_types  # {type: count}

    def optimize_pricing(self, date, demand_forecast, competitor_prices,
                        price_elasticity=-1.5, cost_per_room=30):
        """
        Optimize room rates to maximize revenue

        Parameters:
        - date: date for pricing
        - demand_forecast: dict of {room_type: unconstrained_demand}
        - competitor_prices: dict of {room_type: competitor_avg_price}
        - price_elasticity: price sensitivity (typically -1.0 to -2.0)
        - cost_per_room: marginal cost (cleaning, amenities, etc.)
        """

        from scipy.optimize import minimize

        # Objective function: maximize revenue
        def objective(prices):
            """
            Revenue = Σ (Price × Quantity_Demanded)

            Demand model: Q = Q0 × (P/P0)^elasticity
            """
            total_revenue = 0

            for i, room_type in enumerate(self.room_types.keys()):
                price = prices[i]
                base_demand = demand_forecast[room_type]
                base_price = competitor_prices[room_type]

                # Demand as function of price (power law)
                price_ratio = price / base_price
                demand = base_demand * (price_ratio ** price_elasticity)

                # Constrained by available rooms
                rooms_available = self.room_types[room_type]
                rooms_sold = min(demand, rooms_available)

                total_revenue += price * rooms_sold

            return -total_revenue  # Negative for minimization

        # Initial guess: competitor prices
        initial_prices = [competitor_prices[rt] for rt in self.room_types.keys()]

        # Bounds: cost + margin to maximum luxury price
        bounds = [(cost_per_room + 20, 1000) for _ in self.room_types]

        # Optimize
        result = minimize(objective, initial_prices, method='L-BFGS-B',
                         bounds=bounds)

        optimal_prices = result.x

        # Calculate expected occupancy and revenue
        metrics = {}
        total_rooms_sold = 0
        total_revenue = 0

        for i, room_type in enumerate(self.room_types.keys()):
            price = optimal_prices[i]
            base_demand = demand_forecast[room_type]
            base_price = competitor_prices[room_type]

            demand = base_demand * ((price / base_price) ** price_elasticity)
            rooms_sold = min(demand, self.room_types[room_type])

            total_rooms_sold += rooms_sold
            revenue = price * rooms_sold
            total_revenue += revenue

            metrics[room_type] = {
                'optimal_price': price,
                'expected_rooms_sold': rooms_sold,
                'revenue': revenue,
                'occupancy': rooms_sold / self.room_types[room_type]
            }

        return {
            'optimal_prices': dict(zip(self.room_types.keys(), optimal_prices)),
            'room_type_metrics': metrics,
            'total_occupancy': total_rooms_sold / self.total_rooms,
            'total_revenue': total_revenue,
            'revpar': total_revenue / self.total_rooms
        }

# Example usage (all numbers below are placeholders: replace them with your own)
optimizer = HotelPricingOptimizer(
    total_rooms=200,
    room_types={
        'Standard': 120,
        'Deluxe': 60,
        'Suite': 20
    }
)

demand_forecast = {
    'Standard': 100,
    'Deluxe': 50,
    'Suite': 15
}

competitor_prices = {
    'Standard': 120,
    'Deluxe': 180,
    'Suite': 300
}

result = optimizer.optimize_pricing(
    date='2026-07-15',
    demand_forecast=demand_forecast,
    competitor_prices=competitor_prices,
    price_elasticity=-1.3
)

print(f"Optimal Prices: {result['optimal_prices']}")
print(f"Expected Occupancy: {result['total_occupancy']:.1%}")
print(f"Expected RevPAR: ${result['revpar']:.2f}")
```

### Multi-Day Pricing Optimization

```python
def optimize_length_of_stay_pricing(arrival_date, room_inventory, demand_by_los,
                                   horizon_days=30):
    """
    Optimize pricing for different length-of-stay (LOS) combinations

    Parameters:
    - arrival_date: starting date
    - room_inventory: available rooms by date
    - demand_by_los: dict of {length_of_stay: demand_curve}
    - horizon_days: planning horizon
    """
    from pulp import *

    prob = LpProblem("LOS_Pricing", LpMaximize)

    # Variables: rooms sold for each LOS starting each day
    x = {}  # x[arrival_day, los]: rooms sold

    for day in range(horizon_days):
        for los in [1, 2, 3, 4, 5, 6, 7, 14]:  # Common LOS values
            if day + los <= horizon_days:
                x[day, los] = LpVariable(f"Rooms_{day}_{los}", lowBound=0)

    # Price for each LOS (decision variables or fixed)
    # For simplicity, use demand-based pricing
    # Placeholder nightly rates by length of stay: replace with your own
    prices = {1: 150, 2: 140, 3: 135, 4: 130, 5: 125, 6: 120, 7: 115, 14: 100}

    # Objective: maximize revenue
    total_revenue = lpSum([x[day, los] * prices[los] * los
                          for day in range(horizon_days)
                          for los in [1, 2, 3, 4, 5, 6, 7, 14]
                          if (day, los) in x])

    prob += total_revenue

    # Constraints

    # Room availability each night
    for night in range(horizon_days):
        # All reservations occupying this night
        occupancy = lpSum([x[day, los]
                          for day in range(max(0, night - 13), night + 1)
                          for los in [1, 2, 3, 4, 5, 6, 7, 14]
                          if (day, los) in x and day + los > night])

        prob += occupancy <= room_inventory[night]

    # Demand constraints (can't sell more than demand)
    for day in range(horizon_days):
        for los in [1, 2, 3, 4, 5, 6, 7, 14]:
            if (day, los) in x:
                prob += x[day, los] <= demand_by_los.get(los, {}).get(day, 0)

    # Solve
    prob.solve(PULP_CBC_CMD(msg=0))

    # Extract results
    bookings = []
    for (day, los), var in x.items():
        if var.varValue > 0.1:
            bookings.append({
                'arrival_day': day,
                'length_of_stay': los,
                'rooms_booked': var.varValue,
                'total_revenue': var.varValue * prices[los] * los
            })

    return {
        'total_revenue': value(prob.objective),
        'bookings': pd.DataFrame(bookings),
        'avg_los': sum([b['length_of_stay'] * b['rooms_booked'] for b in bookings]) /
                   sum([b['rooms_booked'] for b in bookings]) if bookings else 0
    }
```

---

## Overbooking Optimization

### Optimal Overbooking Level

```python
def calculate_optimal_overbooking(no_show_probability, cancellation_probability,
                                 walk_cost, revenue_per_room, rooms_available=100):
    """
    Calculate optimal overbooking level to maximize expected profit

    Balances risk of denied boarding (walk cost) vs. lost revenue from no-shows

    Parameters:
    - no_show_probability: P(guest doesn't arrive)
    - cancellation_probability: P(guest cancels before arrival)
    - walk_cost: cost of walking a guest (relocation + compensation)
    - revenue_per_room: revenue per room per night
    - rooms_available: rooms you can sell that night

    A booked guest turns up only if they neither cancel nor no-show.
    """

    from scipy.stats import binom

    # Chance that one booked guest actually arrives
    show_probability = (1 - no_show_probability) * (1 - cancellation_probability)

    # Calculate expected profit for different overbooking levels
    results = []

    for overbook in range(0, 21):  # Test 0-20 rooms overbooked
        total_bookings = rooms_available + overbook

        expected_profit = 0

        # Simulate different no-show scenarios
        for shows_up in range(0, total_bookings + 1):
            # Probability of this many guests showing up
            prob_shows = binom.pmf(shows_up, total_bookings,
                                  show_probability)

            if shows_up <= rooms_available:
                # All guests accommodated
                profit = shows_up * revenue_per_room
            else:
                # Need to walk guests
                walks = shows_up - rooms_available
                profit = (rooms_available * revenue_per_room -
                         walks * walk_cost)

            expected_profit += prob_shows * profit

        # Expected walked guests: sum of (shows_up - rooms) x probability
        expected_walks = sum(
            binom.pmf(k, total_bookings, show_probability) * (k - rooms_available)
            for k in range(rooms_available + 1, total_bookings + 1)
        )

        results.append({
            'overbook_level': overbook,
            'expected_profit': expected_profit,
            'expected_walks': expected_walks
        })

    results_df = pd.DataFrame(results)
    optimal = results_df.loc[results_df['expected_profit'].idxmax()]

    return {
        'optimal_overbook_level': int(optimal['overbook_level']),
        'expected_profit': optimal['expected_profit'],
        'profit_improvement': optimal['expected_profit'] -
                             results_df.iloc[0]['expected_profit'],
        'all_results': results_df
    }

# Example (placeholder numbers: use your own no-show and cancellation rates)
result = calculate_optimal_overbooking(
    no_show_probability=0.05,  # placeholder: your no-show rate
    cancellation_probability=0.03,  # placeholder: your late-cancellation rate
    walk_cost=250,  # placeholder: relocation + compensation for one walked guest
    revenue_per_room=150,  # placeholder: your rate for that room
    rooms_available=100  # placeholder: rooms you can sell
)

print(f"Optimal overbooking: {result['optimal_overbook_level']} rooms")
print(f"Expected profit improvement: ${result['profit_improvement']:,.0f}")
```

---

## Distribution Channel Management

### Channel Mix Optimization

```python
def optimize_channel_mix(channels, demand_by_channel, commission_rates,
                        total_rooms=200):
    """
    Optimize allocation across distribution channels

    Parameters:
    - channels: list of channel names
    - demand_by_channel: dict of {channel: demand_at_each_price_point}
    - commission_rates: dict of {channel: commission_rate}
    - total_rooms: total available rooms
    """
    from pulp import *

    prob = LpProblem("Channel_Mix", LpMaximize)

    # Variables: rooms allocated to each channel
    allocation = {}
    for channel in channels:
        allocation[channel] = LpVariable(f"Alloc_{channel}",
                                        lowBound=0,
                                        upBound=total_rooms)

    # Prices by channel (BAR - Best Available Rate variations)
    # Placeholder rates: replace with your own rate by channel
    prices = {
        'Direct': 180,
        'OTA_A': 180,
        'OTA_B': 175,
        'GDS': 185,
        'Corporate': 150,
        'Group': 130
    }

    # Objective: maximize net revenue after commissions
    net_revenue = []

    for channel in channels:
        gross_price = prices[channel]
        commission = commission_rates.get(channel, 0)
        net_price = gross_price * (1 - commission)

        net_revenue.append(allocation[channel] * net_price)

    prob += lpSum(net_revenue)

    # Constraints

    # Total allocation cannot exceed inventory
    prob += lpSum([allocation[channel] for channel in channels]) <= total_rooms

    # Channel-specific demand caps
    for channel in channels:
        max_demand = demand_by_channel.get(channel, total_rooms)
        prob += allocation[channel] <= max_demand

    # Strategic constraints
    # Maintain minimum direct bookings (brand.com)
    prob += allocation.get('Direct', 0) >= total_rooms * 0.25  # placeholder floor (25% direct): set your own target

    # Solve
    prob.solve(PULP_CBC_CMD(msg=0))

    # Results
    channel_allocation = {}
    for channel in channels:
        rooms_allocated = allocation[channel].varValue
        gross_price = prices[channel]
        commission = commission_rates.get(channel, 0)
        net_price = gross_price * (1 - commission)

        channel_allocation[channel] = {
            'rooms': rooms_allocated,
            'gross_revenue': rooms_allocated * gross_price,
            'commission': rooms_allocated * gross_price * commission,
            'net_revenue': rooms_allocated * net_price,
            'share': rooms_allocated / total_rooms * 100
        }

    return {
        'total_net_revenue': value(prob.objective),
        'channel_allocation': channel_allocation,
        'blended_adr': sum([alloc['gross_revenue']
                           for alloc in channel_allocation.values()]) / total_rooms
    }

# Example (placeholder demand and commission figures: use your own contracts)
channels = ['Direct', 'OTA_A', 'OTA_B', 'GDS', 'Corporate', 'Group']

demand_by_channel = {
    'Direct': 60,
    'OTA_A': 80,
    'OTA_B': 70,
    'GDS': 40,
    'Corporate': 50,
    'Group': 30
}

commission_rates = {
    'Direct': 0.00,  # No commission
    'OTA_A': 0.18,   # 18% commission
    'OTA_B': 0.15,
    'GDS': 0.10,
    'Corporate': 0.00,  # Negotiated rate
    'Group': 0.00
}

result = optimize_channel_mix(channels, demand_by_channel, commission_rates)

print(f"Total net revenue: ${result['total_net_revenue']:,.0f}")
print(f"Blended ADR: ${result['blended_adr']:.2f}")
for channel, data in result['channel_allocation'].items():
    print(f"  {channel}: {data['rooms']:.0f} rooms ({data['share']:.1f}%), "
         f"Net revenue: ${data['net_revenue']:,.0f}")
```

---

## Demand Forecasting

### Hotel Demand Forecasting

```python
def forecast_hotel_demand(historical_bookings, events_calendar,
                         competitors_data, economic_indicators):
    """
    Forecast hotel demand using multiple signals

    Factors:
    - Historical patterns (seasonality, day of week)
    - Events and conferences
    - Competitor pricing and availability
    - Economic indicators
    - Booking pace
    """
    from sklearn.ensemble import RandomForestRegressor
    import pandas as pd

    # Prepare features
    df = historical_bookings.copy()

    # Time features
    df['day_of_week'] = df['date'].dt.dayofweek
    df['month'] = df['date'].dt.month
    df['day_of_month'] = df['date'].dt.day
    df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)

    # Lead time (days before arrival)
    df['booking_lead_time'] = (df['date'] - df['booking_date']).dt.days

    # Seasonal indicators
    df['is_high_season'] = df['month'].isin([6, 7, 8, 12]).astype(int)

    # Events
    df = df.merge(events_calendar, on='date', how='left')
    df['has_major_event'] = df['event_type'].notna().astype(int)

    # Competitor data
    df = df.merge(competitors_data[['date', 'avg_competitor_price',
                                    'competitor_occupancy']], on='date', how='left')

    # Price index (own price vs market)
    df['price_index'] = df['adr'] / df['avg_competitor_price']

    # Lag features
    df['demand_lag_7'] = df['demand'].shift(7)
    df['demand_lag_28'] = df['demand'].shift(28)
    df['demand_rolling_7'] = df['demand'].rolling(7).mean()

    # Drop NaN
    df = df.dropna()

    # Features
    feature_cols = ['day_of_week', 'month', 'is_weekend', 'booking_lead_time',
                   'is_high_season', 'has_major_event', 'price_index',
                   'competitor_occupancy', 'demand_lag_7', 'demand_rolling_7']

    X = df[feature_cols]
    y = df['demand']

    # Train model
    model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X, y)

    # Feature importance
    importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)

    return {
        'model': model,
        'feature_importance': importance,
        'train_r2': model.score(X, y)
    }
```

---

## Group Booking Optimization

### Group vs. Transient Mix

```python
def optimize_group_transient_mix(group_requests, transient_forecast,
                                rooms_available, dates):
    """
    Optimize whether to accept group bookings vs. hold for transient

    Parameters:
    - group_requests: list of {group_id, rooms, nights, rate_offered}
    - transient_forecast: expected transient demand and rates
    - rooms_available: available rooms by date
    - dates: list of dates to optimize
    """
    from pulp import *

    prob = LpProblem("Group_Transient", LpMaximize)

    # Variables: accept group (binary)
    accept_group = {}
    for g, group in enumerate(group_requests):
        accept_group[g] = LpVariable(f"Accept_Group_{g}", cat='Binary')

    # Expected transient revenue (placeholder for optimization)
    transient_revenue = {}
    for date in dates:
        transient_revenue[date] = LpVariable(f"Transient_Rev_{date}", lowBound=0)

    # Objective: maximize total revenue
    group_revenue = lpSum([accept_group[g] * group['rooms'] *
                          len(group['dates']) * group['rate_offered']
                          for g in range(len(group_requests))])

    total_transient = lpSum([transient_revenue[date] for date in dates])

    prob += group_revenue + total_transient

    # Constraints

    # Room availability by date
    for date in dates:
        # Group rooms consumed
        group_rooms = lpSum([accept_group[g] * group['rooms']
                            for g, group in enumerate(group_requests)
                            if date in group['dates']])

        # Transient rooms
        transient_rooms = transient_revenue[date] / transient_forecast[date]['expected_rate']

        prob += group_rooms + transient_rooms <= rooms_available[date]

    # Transient revenue based on remaining capacity
    for date in dates:
        # Simple model: transient revenue = rooms × rate
        # Limited by forecasted demand
        prob += transient_revenue[date] <= \
                transient_forecast[date]['expected_demand'] * \
                transient_forecast[date]['expected_rate']

    # Solve
    prob.solve(PULP_CBC_CMD(msg=0))

    # Extract decisions
    accepted_groups = []
    for g, group in enumerate(group_requests):
        if accept_group[g].varValue > 0.5:
            accepted_groups.append({
                'group_id': group['group_id'],
                'rooms': group['rooms'],
                'nights': len(group['dates']),
                'rate': group['rate_offered'],
                'revenue': group['rooms'] * len(group['dates']) * group['rate_offered']
            })

    return {
        'total_revenue': value(prob.objective),
        'accepted_groups': accepted_groups,
        'group_revenue': sum([g['revenue'] for g in accepted_groups]),
        'transient_revenue': value(prob.objective) -
                            sum([g['revenue'] for g in accepted_groups])
    }
```

---

## Tools & Libraries

### Python Libraries

**Optimization:**
- `PuLP`: Linear programming
- `scipy.optimize`: General optimization
- `cvxpy`: Convex optimization

**Forecasting & ML:**
- `scikit-learn`: Machine learning
- `prophet`: Time series forecasting
- `statsmodels`: Statistical models
- `xgboost`: Gradient boosting

**Data Analysis:**
- `pandas`, `numpy`: Data manipulation
- `matplotlib`, `seaborn`: Visualization

### Commercial Software

**Revenue Management Systems (RMS):**
- **IDeaS**: Market-leading RMS
- **Duetto**: Cloud-based revenue strategy
- **Rainmaker**: Revenue management software
- **Atomize**: AI-powered pricing

**Property Management Systems (PMS):**
- **Oracle Opera**: Enterprise PMS
- **Cloudbeds**: Cloud PMS for independents
- **Mews**: Modern cloud PMS
- **Protel**: European market leader

**Channel Management:**
- **SiteMinder**: Distribution platform
- **TravelClick**: Channel connectivity
- **Synxis (Sabre)**: CRS and distribution

**Business Intelligence:**
- **STR (CoStar)**: Competitive benchmarking
- **Kalibri Labs**: Revenue optimization analytics
- **OTA Insight**: Market intelligence

---

## Common Challenges & Solutions

### Challenge: Rate Parity Issues

**Problem:**
- OTAs showing lower rates than brand.com
- Rate parity violations
- Brand reputation damage

**Solutions:**
- Rate shopping tools and monitoring
- Dynamic BAR (Best Available Rate) management
- Direct booking incentives (member rates, perks)
- Contract enforcement with OTAs
- Strategic rate positioning

### Challenge: Demand Volatility

**Problem:**
- Unpredictable booking patterns
- Last-minute cancellations
- Seasonal extremes

**Solutions:**
- Advanced demand forecasting (ML)
- Flexible cancellation policies with pricing tiers
- Dynamic pricing (hourly updates)
- Minimum length-of-stay restrictions
- Closed-to-arrival restrictions

### Challenge: Distribution Cost Control

**Problem:**
- High OTA commissions (15-25%)
- Acquisition costs rising
- Profitability pressure

**Solutions:**
- Direct booking campaigns (lower CAC)
- Loyalty program incentives
- Meta-search bidding optimization
- Strategic OTA partnerships
- Commission negotiation

### Challenge: Group Block Management

**Problem:**
- Group attrition (pickup less than contracted)
- Opportunity cost of holding rooms
- Complex group contracts

**Solutions:**
- Dynamic group pricing
- Attrition clauses and penalties
- Phased release of unsold group rooms
- Group revenue displacement analysis
- Automated group block management

---

## Output Format

Return one report with these sections, in this order. Fill each `<placeholder>` from the person's own numbers. Never invent a figure. If a number is missing, write MISSING and say what it would change. Keep the report to about two pages.

### Hotel Revenue Management Report

**Summary** (5 lines at most)
- How the property is doing now: `<occupancy>`, `<ADR>`, `<RevPAR>`
- The two or three biggest chances to earn more
- What to do first

**Performance Metrics**

| Metric | Current | Last Year | Variance | Target |
|--------|---------|-----------|----------|--------|
| Occupancy | `<%>` | `<%>` | `<pts>` | `<%>` |
| ADR | `<amount>` | `<amount>` | `<%>` | `<amount>` |
| RevPAR | `<amount>` | `<amount>` | `<%>` | `<amount>` |

**Rate plan by date and room type**

| Date | Room type | Rooms sold | Occupancy | Current rate | Recommended rate | Action |
|------|-----------|------------|-----------|--------------|------------------|--------|
| `<date>` | `<type>` | `<n>` | `<%>` | `<amount>` | `<amount>` | Hold, raise, or promote |

**Overbooking limits**

| Room type | Rooms | No-show rate | Cancellation rate | Walk cost | Extra bookings to accept |
|-----------|-------|--------------|-------------------|-----------|--------------------------|
| `<type>` | `<n>` | `<%>` | `<%>` | `<amount>` | `<n>` |

**Channel mix**

| Channel | Share of rooms | Commission | Net rate | Recommended share |
|---------|----------------|------------|----------|-------------------|
| `<Direct / OTA / GDS / Corporate / Group>` | `<%>` | `<%>` | `<amount>` | `<%>` |

**Revenue under different prices** (two or three price scenarios, each with expected occupancy and revenue, and the assumption behind it)

**Strategic Actions** (3 to 5, in order, each one line)

**Assumptions and gaps** (every input marked MISSING, every placeholder you used, and how the price-elasticity figure was chosen)

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Price test planner](https://useaiblocks.com/skills/price-test-planner). It takes the plan.
- The [Online store pricing planner](https://useaiblocks.com/skills/price-position-planner). It takes the plan.
- The [Pricing model designer](https://useaiblocks.com/skills/pricing-model-designer). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Questions to Ask

If you need more context, ask these once, together:
1. What type of hotel property? (luxury, midscale, limited service, resort)
2. How many rooms and what room types?
3. What's the current occupancy, ADR, and RevPAR?
4. What's the competitive set and market positioning?
5. What distribution channels are used?
6. What systems are in place? (PMS, RMS, channel manager)
7. What are the key challenges? (occupancy, rate, distribution costs)

---

## Related Skills

- **tour-operations**: For tour operator and package management
- **airline-cargo-optimization**: For airline operations
- **hospitality-procurement**: For hotel purchasing and procurement
- **demand-forecasting**: For advanced forecasting techniques
- **dynamic-pricing**: For pricing optimization
- **optimization-modeling**: For advanced optimization
- **seasonal-planning**: For seasonal demand management
