/**
 * test-ads-library.ts
 *
 * Purpose: Verify your META_AD_LIBRARY_TOKEN can query the Ad Library API.
 *          Runs a sample search for a well-known brand to confirm data flow.
 *
 * Run with: npx tsx scripts/test-ads-library.ts
 *
 * Expected output: Up to 5 active ads for the search term with page names
 *                  and creative body snippets.
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const API_VERSION = 'v25.0'
const GRAPH_API_BASE = `https://graph.facebook.com/${API_VERSION}`

// Change this to any brand you want to test against.
const SEARCH_TERM = 'Nike'
const COUNTRIES = ['US']

interface AdLibraryResult {
  id: string
  page_name?: string
  ad_creative_bodies?: string[]
  ad_snapshot_url?: string
  publisher_platforms?: string[]
  ad_delivery_start_time?: string
}

async function testAdsLibrary(): Promise<void> {
  const token = process.env.META_AD_LIBRARY_TOKEN

  if (!token) {
    console.error('ERROR: META_AD_LIBRARY_TOKEN not set in .env.local')
    console.error('This is a separate token from META_ACCESS_TOKEN.')
    console.error('See the "Getting Facebook Ads Library API" lesson.')
    process.exit(1)
  }

  console.log(`Testing Ad Library API with search: "${SEARCH_TERM}" in ${COUNTRIES.join(',')}`)

  const fields = [
    'id',
    'page_name',
    'ad_creative_bodies',
    'ad_snapshot_url',
    'publisher_platforms',
    'ad_delivery_start_time',
  ].join(',')

  const url =
    `${GRAPH_API_BASE}/ads_archive` +
    `?search_terms=${encodeURIComponent(SEARCH_TERM)}` +
    `&ad_type=ALL` +
    `&ad_reached_countries=${encodeURIComponent(JSON.stringify(COUNTRIES))}` +
    `&fields=${fields}` +
    `&limit=5` +
    `&access_token=${token}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.error) {
      console.error('\nMeta Ad Library API returned an error:')
      console.error(`  Code: ${data.error.code}`)
      console.error(`  Message: ${data.error.message}`)

      if (data.error.code === 613) {
        console.error('\nThis is error 613 (rate limit). Back off for an hour.')
      } else if (data.error.message?.toLowerCase().includes('identity')) {
        console.error('\nYour Facebook account is not ID-verified.')
        console.error('Complete verification at facebook.com/ID.')
        console.error('Or use the Apify fallback (see Getting Ads Library API lesson).')
      } else if (data.error.code === 190) {
        console.error('\nToken expired or invalid. Regenerate as a Personal User Access Token.')
      }
      process.exit(1)
    }

    if (!data.data || data.data.length === 0) {
      console.warn(`\nNo ads returned for "${SEARCH_TERM}".`)
      console.warn('Either the brand has no active ads in those countries, or the search term is too narrow.')
      process.exit(0)
    }

    console.log(`\nSUCCESS. Found ${data.data.length} active ad(s) for "${SEARCH_TERM}":\n`)

    data.data.forEach((ad: AdLibraryResult, idx: number) => {
      const body = ad.ad_creative_bodies?.[0]?.slice(0, 120) ?? '(no body text)'
      const platforms = ad.publisher_platforms?.join(', ') ?? 'unknown'
      console.log(`  ${idx + 1}. ${ad.page_name ?? 'Unknown page'}`)
      console.log(`     ID: ${ad.id}`)
      console.log(`     Started: ${ad.ad_delivery_start_time ?? 'unknown'}`)
      console.log(`     Platforms: ${platforms}`)
      console.log(`     Copy: ${body}${body.length >= 120 ? '...' : ''}`)
      if (ad.ad_snapshot_url) {
        console.log(`     Snapshot: ${ad.ad_snapshot_url}`)
      }
      console.log('')
    })
  } catch (error) {
    console.error('\nNetwork or parse error:', error)
    process.exit(1)
  }
}

testAdsLibrary().catch((err) => {
  console.error('Unhandled error:', err)
  process.exit(1)
})
