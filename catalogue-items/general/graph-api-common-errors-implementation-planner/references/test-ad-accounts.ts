/**
 * test-ad-accounts.ts
 *
 * Purpose: Verify your META_ACCESS_TOKEN can list the ad accounts
 *          your Facebook user has access to.
 *
 * Run with: npx tsx scripts/test-ad-accounts.ts
 *
 * Expected output: A JSON array of ad accounts with id, name,
 *                  account_status (1 = active), and currency.
 *
 * If this fails: Your token is invalid, expired, or lacks ads_read scope.
 *                Regenerate from the Graph API Explorer.
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const API_VERSION = 'v24.0'
const GRAPH_API_BASE = `https://graph.facebook.com/${API_VERSION}`

async function testAdAccounts(): Promise<void> {
  const token = process.env.META_ACCESS_TOKEN

  if (!token) {
    console.error('ERROR: META_ACCESS_TOKEN is not set in .env.local')
    process.exit(1)
  }

  console.log(`Testing ad account access with token ending in ...${token.slice(-8)}`)

  const url = `${GRAPH_API_BASE}/me/adaccounts?fields=id,name,account_status,currency,timezone_name&access_token=${token}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.error) {
      console.error('\nMeta API returned an error:')
      console.error(`  Code: ${data.error.code}`)
      console.error(`  Type: ${data.error.type}`)
      console.error(`  Message: ${data.error.message}`)
      console.error('\nCommon causes:')
      if (data.error.code === 190) {
        console.error('  - Token expired. Regenerate from Graph API Explorer.')
      } else if (data.error.code === 200 || data.error.code === 10) {
        console.error('  - Missing ads_read scope. Regenerate with scope selected.')
      }
      process.exit(1)
    }

    if (!data.data || data.data.length === 0) {
      console.warn('\nWARNING: No ad accounts returned.')
      console.warn('Your token is valid but your Facebook user is not admin on any ad account.')
      console.warn('Verify your role at business.facebook.com > Settings > Ad Accounts.')
      process.exit(0)
    }

    console.log(`\nSUCCESS. Found ${data.data.length} ad account(s):\n`)
    data.data.forEach((account: { id: string; name: string; account_status: number; currency: string; timezone_name: string }) => {
      const status = account.account_status === 1 ? 'ACTIVE' : `status_${account.account_status}`
      console.log(`  ${account.id} | ${account.name} | ${status} | ${account.currency} | ${account.timezone_name}`)
    })

    console.log('\nCopy the numeric portion (without "act_" prefix) into META_AD_ACCOUNT_ID in .env.local.')
  } catch (error) {
    console.error('\nNetwork or parse error:', error)
    process.exit(1)
  }
}

testAdAccounts().catch((err) => {
  console.error('Unhandled error:', err)
  process.exit(1)
})
