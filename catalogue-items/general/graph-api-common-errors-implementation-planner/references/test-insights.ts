/**
 * test-insights.ts
 *
 * Purpose: Verify your META_ACCESS_TOKEN can pull live insights data
 *          for your configured ad account. Confirms the full path:
 *          token -> env loading -> account ID resolution -> insights endpoint.
 *
 * Run with: npx tsx scripts/test-insights.ts
 *
 * Expected output: Last 7 days of spend, impressions, clicks, CTR, CPM,
 *                  and a sample of conversion actions if any purchases happened.
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const API_VERSION = 'v24.0'
const GRAPH_API_BASE = `https://graph.facebook.com/${API_VERSION}`

interface InsightsRow {
  spend?: string
  impressions?: string
  clicks?: string
  ctr?: string
  cpm?: string
  cpc?: string
  actions?: Array<{ action_type: string; value: string }>
  action_values?: Array<{ action_type: string; value: string }>
}

function extractActionValue(actions: Array<{ action_type: string; value: string }> | undefined, type: string): number {
  if (!actions) return 0
  const match = actions.find((a) => a.action_type === type)
  return match ? Number(match.value) : 0
}

async function testInsights(): Promise<void> {
  const token = process.env.META_ACCESS_TOKEN
  const accountId = process.env.META_AD_ACCOUNT_ID

  if (!token) {
    console.error('ERROR: META_ACCESS_TOKEN not set in .env.local')
    process.exit(1)
  }
  if (!accountId) {
    console.error('ERROR: META_AD_ACCOUNT_ID not set in .env.local')
    console.error('Run test-ad-accounts.ts first to see available accounts.')
    process.exit(1)
  }

  if (accountId.startsWith('act_')) {
    console.error('ERROR: META_AD_ACCOUNT_ID should be the numeric portion ONLY.')
    console.error(`Current value: ${accountId}`)
    console.error('Remove the "act_" prefix. The client adds it automatically.`)
    process.exit(1)
  }

  console.log(`Pulling insights for account act_${accountId}, last 7 days...`)

  const fields = [
    'spend',
    'impressions',
    'clicks',
    'ctr',
    'cpm',
    'cpc',
    'actions',
    'action_values',
  ].join(',')

  const url =
    `${GRAPH_API_BASE}/act_${accountId}/insights` +
    `?fields=${fields}` +
    `&date_preset=last_7d` +
    `&access_token=${token}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.error) {
      console.error('\nMeta API returned an error:')
      console.error(`  Code: ${data.error.code}`)
      console.error(`  Message: ${data.error.message}`)
      process.exit(1)
    }

    if (!data.data || data.data.length === 0) {
      console.warn('\nNo insights returned for the last 7 days.')
      console.warn('Account may have zero spend in this window, or the ad account is inactive.')
      process.exit(0)
    }

    const row: InsightsRow = data.data[0]

    console.log('\nSUCCESS. Last 7 days summary:\n')
    console.log(`  Spend:       $${row.spend ?? '0'}`)
    console.log(`  Impressions: ${row.impressions ?? '0'}`)
    console.log(`  Clicks:      ${row.clicks ?? '0'}`)
    console.log(`  CTR:         ${row.ctr ?? '0'}%`)
    console.log(`  CPM:         $${row.cpm ?? '0'}`)
    console.log(`  CPC:         $${row.cpc ?? '0'}`)

    const purchases = extractActionValue(row.actions, 'purchase')
    const revenue = extractActionValue(row.action_values, 'purchase')
    const addToCart = extractActionValue(row.actions, 'add_to_cart')

    console.log('\n  Conversions (from actions array):')
    console.log(`    Purchases:    ${purchases}`)
    console.log(`    Revenue:      $${revenue.toFixed(2)}`)
    console.log(`    Add to Cart:  ${addToCart}`)

    if (purchases > 0 && Number(row.spend) > 0) {
      const roas = revenue / Number(row.spend)
      const cpa = Number(row.spend) / purchases
      console.log(`    ROAS:         ${roas.toFixed(2)}x`)
      console.log(`    CPA:          $${cpa.toFixed(2)}`)
    }

    // Show rate limit header parsing
    const usageHeader = response.headers.get('x-business-use-case-usage')
    if (usageHeader) {
      try {
        const usage = JSON.parse(usageHeader)
        const firstBm = Object.values(usage)[0] as Array<{ acc_id_util_pct: number }>
        if (firstBm && firstBm[0]) {
          console.log(`\n  Rate limit utilization: ${firstBm[0].acc_id_util_pct}%`)
        }
      } catch {
        // Ignore parse errors on the header.
      }
    }
  } catch (error) {
    console.error('\nNetwork or parse error:', error)
    process.exit(1)
  }
}

testInsights().catch((err) => {
  console.error('Unhandled error:', err)
  process.exit(1)
})
