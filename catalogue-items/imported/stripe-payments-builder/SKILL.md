---
name: "stripe-integration-expert"
description: "Production-grade Stripe integrations: subscriptions with trials and proration, one-time payments, usage-based billing, checkout sessions, idempotent webhook handlers, customer portal, and invoicing. Covers Next.js, Express, and Django patterns. Use when integrating Stripe for the first time, debugging webhook reliability issues, migrating from a different payment provider, or adding usage-based billing to an existing subscription product."
---

# Stripe Integration Expert

**Tier:** POWERFUL  
**Category:** Engineering Team  
**Domain:** Payments / Billing Infrastructure

---

## Overview

Implement production-grade Stripe integrations: subscriptions with trials and proration, one-time payments, usage-based billing, checkout sessions, idempotent webhook handlers, customer portal, and invoicing. Covers Next.js, Express, and Django patterns.

The code below is Next.js (App Router, version 15 or later) with a Prisma-style `db`. Adapt it to the user's framework and database. Do not paste it in unchanged.

---

## Before you write any code

Ask once for anything missing. Never guess a price, a plan name or a Stripe ID.

1. **How do you charge?** One-off, subscription, seat-based or usage-based.
2. **Plans and prices.** Names, amounts, monthly or yearly, trial length. Use placeholder env vars such as `STRIPE_PRO_MONTHLY_PRICE_ID` until the user creates the prices in Stripe.
3. **Stack.** Language, framework, and the database that stores users.

If you have a billing plan from an earlier step, use it to answer questions 1 to 3 and ask only for what it leaves out.
4. **Stripe account in test mode.** Work in test mode only. Never ask the user to paste a secret key into chat. Keys go in a `.env` file the AI does not read.

Stop and say so if the user has no web backend. For a single payment with no app, suggest Stripe Payment Links instead.

---

## What you produce

List these at the end, with the path of each file you made or changed:

- `lib/stripe.ts`: the Stripe client and plan table
- `app/api/billing/checkout/route.ts`: starts a Checkout session
- `app/api/webhooks/stripe/route.ts`: checks the signature and handles events
- `lib/billing.ts`: upgrade, downgrade and proration preview
- `app/api/billing/portal/route.ts`: opens the customer portal
- `lib/subscription.ts`: the "is this user paid up" check
- A database change for `stripeEvent` and the user's Stripe fields
- `.env.example` listing every variable, with no real values
- A numbered test run (see "First test run")

---

## When to Use

- Adding subscription billing to any web app
- Implementing plan upgrades/downgrades with proration
- Building usage-based or seat-based billing
- Debugging webhook delivery failures
- Migrating from one billing model to another

## When not to use

- A single sale or donation with no app: use Stripe Payment Links.
- You need tax, VAT or legal advice. This skill does not give it.
- You want to take live payments straight away. Finish the test run first.

---

## Subscription Lifecycle State Machine

```
trialing ──paid──► active ──cancel──► cancel_pending ──period_end──► canceled
    │                 │                                                  │
    │            downgrade: the new price starts at period end,        reactivate
    │            status stays active, the plan changes at the renewal    │
    │                                                                    │
    └──trial_end without payment──► past_due ──payment_failed 3x──► canceled
                                        │
                                  payment_success
                                        │
                                        ▼
                                     active
```

The names in the diagram are the same as the database status values below.

### DB subscription status values:
`trialing | active | past_due | canceled | cancel_pending | paused | unpaid`

---

## Stripe Client Setup

```typescript
// lib/stripe.ts
import Stripe from "stripe"

// Leave apiVersion out to use the version your installed SDK is built for,
// or pin the version shown in your Stripe dashboard. Do not copy an old date.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  appInfo: {
    name: "myapp",
    version: "1.0.0",
  },
})

// Price IDs by plan (set in env). Replace plan names and features with the user's own.
export const PLANS = {
  starter: {
    monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_STARTER_YEARLY_PRICE_ID!,
    features: ["5 projects", "10k events"],
  },
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
    features: ["Unlimited projects", "1M events"],
  },
} as const
```

---

## Checkout Session (Next.js App Router)

```typescript
// app/api/billing/checkout/route.ts
import { NextResponse } from "next/server"
import { stripe, PLANS } from "@/lib/stripe"
import { getAuthUser } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { priceId, interval = "monthly" } = await req.json()

  // Only accept price IDs that are in PLANS. Never trust a price from the browser.
  const allowedPriceIds: string[] = Object.values(PLANS).flatMap((p) => [p.monthly, p.yearly])
  if (!allowedPriceIds.includes(priceId)) {
    return NextResponse.json({ error: "Unknown price" }, { status: 400 })
  }

  // Get or create Stripe customer
  let stripeCustomerId = user.stripeCustomerId
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    }, { idempotencyKey: `create-customer-${user.id}` }) // a retry cannot create a second customer
    stripeCustomerId = customer.id
    await db.user.update({ where: { id: user.id }, data: { stripeCustomerId } })
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: user.hasHadTrial ? undefined : 14,
      metadata: { userId: user.id },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { userId: user.id },
  })

  return NextResponse.json({ url: session.url })
}
```

The route above rejects any `priceId` that is not in `PLANS`. Keep that check. Never take a price from the browser unchecked. The 14-day trial is an example; use the trial length the user gave you, or none.

---

## Subscription Upgrade/Downgrade

```typescript
// lib/billing.ts
export async function changeSubscriptionPlan(
  subscriptionId: string,
  newPriceId: string,
  immediate = false
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const currentItem = subscription.items.data[0]

  if (immediate) {
    // Upgrade: apply immediately with proration
    return stripe.subscriptions.update(subscriptionId, {
      items: [{ id: currentItem.id, price: newPriceId }],
      proration_behavior: "always_invoice",
      billing_cycle_anchor: "unchanged",
    })
  } else {
    // Downgrade: keep the current plan until the period ends, then switch.
    // A subscription schedule does this. Updating the subscription directly would switch now.
    // Check these calls against the Stripe docs for your API version.
    const schedule = await stripe.subscriptionSchedules.create({
      from_subscription: subscriptionId,
    })
    const currentPhase = schedule.phases[0]
    return stripe.subscriptionSchedules.update(schedule.id, {
      end_behavior: "release",
      phases: [
        {
          items: [{ price: currentItem.price.id, quantity: currentItem.quantity }],
          start_date: currentPhase.start_date,
          end_date: currentPhase.end_date,
        },
        {
          items: [{ price: newPriceId, quantity: currentItem.quantity }],
          iterations: 1,
        },
      ],
    })
  }
}

// Preview proration before confirming upgrade
export async function previewProration(subscriptionId: string, newPriceId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const prorationDate = Math.floor(Date.now() / 1000)

  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: subscription.customer as string,
    subscription: subscriptionId,
    subscription_items: [{ id: subscription.items.data[0].id, price: newPriceId }],
    subscription_proration_date: prorationDate,
  })

  return {
    amountDue: invoice.amount_due,
    prorationDate,
    lineItems: invoice.lines.data,
  }
}
```

---

## Complete Webhook Handler (Idempotent)

```typescript
// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import Stripe from "stripe"

// Processed events table to ensure idempotency
async function hasProcessedEvent(eventId: string): Promise<boolean> {
  const existing = await db.stripeEvent.findUnique({ where: { id: eventId } })
  return !!existing
}

async function markEventProcessed(eventId: string, type: string) {
  await db.stripeEvent.create({ data: { id: eventId, type, processedAt: new Date() } })
}

export async function POST(req: Request) {
  const body = await req.text() // raw body: the signature check fails if you parse it first
  // headers() must be awaited on Next.js 15 and later. On older versions the await does no harm.
  const signature = (await headers()).get("stripe-signature")
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Idempotency check
  if (await hasProcessedEvent(event.id)) {
    return NextResponse.json({ received: true, skipped: true })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    await markEventProcessed(event.id, event.type)
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error(`Error processing webhook ${event.type}:`, err)
    // Return 500 so Stripe retries. Don't mark as processed.
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}

// Each handler sets values from Stripe (it never adds to a number),
// so running one twice gives the same result. That is what keeps a retry safe.

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode !== "subscription") return

  const userId = session.metadata?.userId
  if (!userId) throw new Error("No userId in checkout session metadata")

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

  await db.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      subscriptionStatus: subscription.status,
      hasHadTrial: true,
    },
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Find the user by subscription ID, or by customer ID if the subscription is new to us
  const user = await db.user.findFirst({
    where: {
      OR: [
        { stripeSubscriptionId: subscription.id },
        { stripeCustomerId: subscription.customer as string },
      ],
    },
  })
  if (!user) throw new Error(`No user found for subscription ${subscription.id}`)

  await db.user.update({
    where: { id: user.id },
    data: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      subscriptionStatus: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await db.user.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      stripeSubscriptionId: null,
      stripePriceId: null,
      stripeCurrentPeriodEnd: null,
      subscriptionStatus: "canceled",
    },
  })
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return
  const attemptCount = invoice.attempt_count

  await db.user.update({
    where: { stripeSubscriptionId: invoice.subscription as string },
    data: { subscriptionStatus: "past_due" },
  })

  // sendDunningEmail is yours to write: it sends the "your payment failed" email
  // customer_email can be empty, so check it before you send
  if (!invoice.customer_email) return
  if (attemptCount >= 3) {
    await sendDunningEmail(invoice.customer_email, "final")
  } else {
    await sendDunningEmail(invoice.customer_email, "retry")
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return

  await db.user.update({
    where: { stripeSubscriptionId: invoice.subscription as string },
    data: {
      subscriptionStatus: "active",
      stripeCurrentPeriodEnd: new Date(invoice.period_end * 1000),
    },
  })
}
```

---

## Usage-Based Billing

> Current way: report usage with Billing Meters. Create a meter in your Stripe dashboard first, and use its event name below. The older `createUsageRecord` call is kept below as legacy for accounts still on an old API version.

```typescript
// Report usage with a Billing Meter
// [METER EVENT NAME] is the event name you set when you created the meter in Stripe.
export async function reportMeterUsage(stripeCustomerId: string, value: number) {
  await stripe.billing.meterEvents.create({
    event_name: "[METER EVENT NAME]",
    payload: { stripe_customer_id: stripeCustomerId, value: String(value) },
  })
}
```

### Legacy: usage records (older API versions only)

```typescript
// Report usage for metered subscriptions (older API, kept for old accounts)
export async function reportUsage(subscriptionItemId: string, quantity: number) {
  await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
    quantity,
    timestamp: Math.floor(Date.now() / 1000),
    action: "increment",
  })
}

// Example: report API calls in middleware
export async function trackApiCall(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (user?.stripeSubscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId)
    const meteredItem = subscription.items.data.find(
      (item) => item.price.recurring?.usage_type === "metered"
    )
    if (meteredItem) {
      await reportUsage(meteredItem.id, 1)
    }
  }
}
```

---

## Customer Portal

```typescript
// app/api/billing/portal/route.ts
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getAuthUser } from "@/lib/auth"

export async function POST() {
  const user = await getAuthUser()
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No billing account" }, { status: 400 })
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  })

  return NextResponse.json({ url: portalSession.url })
}
```

---

## Testing with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local dev
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger specific events for testing
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_failed

# Test with specific customer
stripe trigger customer.subscription.updated \
  --override subscription:customer=cus_xxx

# View recent events
stripe events list --limit 10

# Test cards (test mode only)
# Success: 4242 4242 4242 4242
# Requires auth: 4000 0025 0000 3155
# Generic decline: 4000 0000 0000 0002
# Insufficient funds: 4000 0000 0000 9995
```

The `brew` line is for Mac. On Windows or Linux, use the install steps on Stripe's own CLI page.

---

## First test run

Give the user these steps in order, and stop at the first one that fails:

1. Create the products and prices in Stripe test mode. Put the price IDs in `.env`.
2. Run the database change, then start the app.
3. Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`. Copy the `whsec_` value it prints into `STRIPE_WEBHOOK_SECRET`.
4. Open the pricing page, start checkout and pay with the success card. Check the user row shows `trialing` or `active`.
5. Run `stripe trigger invoice.payment_failed`. Check the status becomes `past_due`.
6. Send the same event twice. Check the second one is skipped.
7. Pay with the generic decline card. Check the user is told and not upgraded.
8. Downgrade a test subscription to a cheaper plan. Check the plan, the price and the renewal date in Stripe: the new price must start at the end of the current period, not today. Your app should show the old plan until then.

---

## Feature Gating Helper

```typescript
// lib/subscription.ts
export function isSubscriptionActive(user: { subscriptionStatus: string | null, stripeCurrentPeriodEnd: Date | null }) {
  if (!user.subscriptionStatus) return false
  if (user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing") return true
  // Grace period: past_due but not yet expired
  if (user.subscriptionStatus === "past_due" && user.stripeCurrentPeriodEnd) {
    return user.stripeCurrentPeriodEnd > new Date()
  }
  return false
}

// Middleware usage
export async function requireActiveSubscription() {
  const user = await getAuthUser()
  if (!isSubscriptionActive(user)) {
    redirect("/billing?reason=subscription_required")
  }
}
```

---

## Common Pitfalls

- **Webhook delivery order not guaranteed.** Always re-fetch from the Stripe API; never trust event data alone for DB updates.
- **Double-processing webhooks.** Stripe retries on 500; use the idempotency table. Two retries can arrive at once, so make `stripeEvent.id` a unique key.
- **Trial conversion tracking.** Store `hasHadTrial: true` in the DB to prevent trial abuse.
- **Proration surprises.** Always preview proration before an upgrade; show the user the amount before confirming.
- **Customer portal not configured.** Enable its features in the Stripe dashboard under Billing, then Customer portal settings.
- **Missing metadata on checkout.** Always pass `userId` in metadata; you cannot link a subscription to a user without it.
- **Old API calls.** Newer Stripe API versions changed some calls used above: usage records (now Billing Meters), the upcoming-invoice preview and where the period dates live. Check each call against the Stripe docs for the version in use before you ship.

---

## Hand-off note

End your reply with: the files you made, what you assumed, anything you could not check, and this line: "Run the first test run in test mode. Have someone who knows payments review this before you take real money."
