# Habit Testing Framework

Systematic approach to measuring whether your product is forming habits. Based on Nir Eyal's 5% rule of thumb (https://www.nirandfar.com/hooking-users-in-3-steps/): define the expected use first; if fewer than about 5% of users reach it, go back to the product; if more do, study those users. The 5% figure is a starting point for investigation, not proof that use is automatic.

## The Three Questions

### 1. Who Are Your Habitual Users?

**Definition:** Users who engage frequently without external prompts.

**How to identify:**
1. Define your target frequency (daily, weekly, etc.)
2. Filter users who meet that frequency
3. Look for unprompted sessions (not from notifications/emails)
4. Identify the minimum threshold for "habitual"

**Metrics to track:**

| Metric | What It Shows |
|--------|---------------|
| DAU/MAU ratio | Daily engagement rate |
| Organic session % | Sessions without external trigger |
| Session frequency | Times per day/week |
| Return rate | Users who come back within X days |
| Streak length | Consecutive days of usage |

**Cohort analysis:**
- How does habit formation differ by acquisition channel?
- By user demographics?
- By onboarding completion?
- By feature adoption?

### 2. What Are They Doing?

**Goal:** Identify the "Habit Path"—the specific sequence of actions habitual users take.

**Method:**
1. Map the journey of your top 5% engaged users
2. Look for patterns in their behavior
3. Compare to casual/churned users
4. Identify the "aha moment" or key action

**Common patterns to look for:**

| Pattern | Example |
|---------|---------|
| First action | "Downloaded app and immediately posted" |
| Key feature | "Used the X feature within first week" |
| Social action | "Connected with 3+ friends" |
| Investment action | "Created first project/content" |
| Time-of-day pattern | "Always uses during morning commute" |

**The "Aha Moment":**
Find the action that correlates with retention in your own data. Often-quoted company anecdotes (not verified figures, and not targets for your product):
- Facebook: Adding 7 friends in 10 days
- Slack: Sending 2,000 team messages
- Dropbox: Saving 1 file to folder

### 3. Why Are They Doing It?

**Goal:** Understand the internal trigger—what emotion or situation drives habitual use.

**Research methods:**

**User interviews (qualitative):**
- "Walk me through the last time you used [product]"
- "What were you doing right before?"
- "How were you feeling?"
- "What would you have done if [product] didn't exist?"

**Surveys (quantitative):**
- "What emotion best describes when you typically use [product]?"
- "What situation usually prompts you to open [product]?"
- "On a scale of 1-10, how automatic is your usage?"

**Behavioral data:**
- Time of day patterns
- Context signals (location, other apps)
- Trigger-to-action time (how quickly do they respond?)

---

## The 5% Habitual User Test

### Step 1: Define "Habitual"

Choose criteria based on your product:

| Product Type | Habitual Definition |
|--------------|---------------------|
| Social media | Daily use, 5+ sessions/day |
| Productivity tool | 3+ uses/week, unprompted |
| E-commerce | Monthly purchase, weekly browse |
| Fitness app | 4+ workouts/week |
| News app | Daily check, 10+ min/session |

### Step 2: Measure the Population

Calculate what percentage of your user base meets the habitual criteria.

```
Habitual User Rate = (Habitual Users / Total Active Users) × 100
```

| Rate | What it tells you |
|------|--------|
| Under about 5% | Below Eyal's rule-of-thumb floor. Check your expected-use definition, then revisit the product before optimising the hook. |
| About 5% or more | Enough devoted users to study. Move to Step 3. This alone does not show that use is automatic. |

There are no universal bands above 5%. What counts as a healthy share depends on the product, the expected use you chose and the business model, so compare with your own earlier cohorts. To show that use is becoming automatic, look for more than a rate: unprompted sessions, steady use at the same time or in the same situation, and what users say in interviews (Step 3 and "Why Are They Doing It?").

### Step 3: Analyze the Habitual Cohort

What makes these users different?

| Factor | Question |
|--------|----------|
| Acquisition | How did they find you? |
| Onboarding | What did they do in first session? |
| First week | What actions did they take? |
| Feature use | Which features do they use most? |
| Investment | What have they put into the product? |
| Social | Are they connected to other users? |

### Step 4: Replicate the Behavior

Once you know what habitual users do differently:

1. Optimize onboarding to encourage those behaviors
2. Nudge new users toward the Habit Path
3. Test whether guided users form habits faster
4. Iterate based on results

---

## Habit Testing Metrics Dashboard

### Core Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Habitual User Rate | Habitual / Active × 100 | About 5% or more to start studying users (a floor, not a goal) |
| DAU/MAU | Daily Active / Monthly Active | Increasing against your own earlier cohorts (only meaningful for products meant for daily use) |
| Organic Session Rate | Organic / Total Sessions | Increasing |
| Time to Habit | Days from signup to habitual status | Decreasing |
| Habit Path Completion | Users completing key actions | Increasing |

### Cohort Analysis

Track these by cohort (week/month of signup):

| Metric | Week 1 | Week 4 | Week 12 |
|--------|--------|--------|---------|
| Retention rate | | | |
| Habitual user rate | | | |
| Avg sessions/user | | | |
| Habit Path completion | | | |

### Leading Indicators

Early signals that may predict habit formation. The thresholds below are starting guesses; check each against retention in your own data before relying on it:

| Indicator | Threshold | Why It Matters |
|-----------|-----------|----------------|
| First-week return | > 3 visits | Early engagement predicts retention |
| Core action completion | First session | Users who get value stay |
| Investment made | First week | Investment = switching cost |
| Social connection | First month | Social ties increase retention |

---

## When Habits Aren't Forming

### Diagnostic Questions

| Symptom | Possible Cause | Investigation |
|---------|---------------|---------------|
| Under about 5% reach expected use | Weak hook, weak product, or an expected-use definition that does not fit | Check the definition, then audit each phase |
| High churn after Week 1 | Weak first reward | Check onboarding experience |
| Engagement drops after Month 1 | Novelty wore off | Add reward variability |
| Users return only with triggers | No internal trigger | Research user emotions |
| Power users but low mainstream | Too complex | Simplify core action |

### Phase-by-Phase Audit

**Trigger issues:**
- Are external triggers effective (CTR, open rates)?
- Is there a clear internal trigger?
- Are we prompting at the right time?

**Action issues:**
- Is the core action simple enough?
- Are there friction points?
- Is motivation sufficient?

**Reward issues:**
- Is the reward variable?
- Does it satisfy the internal trigger?
- Is it meaningful (not just gamification)?

**Investment issues:**
- Are users putting something in?
- Does investment load the next trigger?
- Are switching costs building?

---

## Testing Interventions

### A/B Test Ideas

| Hypothesis | Test | Success Metric |
|------------|------|----------------|
| Earlier investment = higher retention | Move investment prompt earlier | 30-day retention |
| Better trigger timing = more engagement | Test send times | Trigger-to-action rate |
| Stronger rewards = more returns | Increase reward variability | Session frequency |
| Simplified action = more completions | Reduce steps | Core action completion |

### Experiment Framework

1. **Identify weakest Hook phase** (based on data)
2. **Form hypothesis** about improvement
3. **Design small test** with clear metric
4. **Run for statistical significance**
5. **Implement winner, iterate**
