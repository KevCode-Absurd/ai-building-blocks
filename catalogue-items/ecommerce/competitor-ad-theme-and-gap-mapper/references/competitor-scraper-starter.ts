/**
 * Competitor Ad Library Scraper — Starter
 *
 * Scrapes Meta Ad Library for active ads belonging to a list of competitors,
 * then writes each ad into Supabase for downstream classification.
 *
 * This is a starter. It is intentionally minimal. Extend with:
 *   - Playwright auto-scroll to load more ads
 *   - Rate limit backoff on 429 responses
 *   - Screenshot capture per ad
 *   - Video transcript extraction for video ads
 *   - Landing page follow + LP teardown
 *
 * Run:
 *   npx tsx lib/competitor/scrape.ts --brand "Primally Pure" --country US
 */

import { chromium, type Browser, type Page } from 'playwright';
import { supabaseAdmin } from '../supabase/admin';

// -------- Types --------

export interface CompetitorAd {
  ad_id: string;
  competitor_brand: string;
  primary_text: string;
  format: 'static_image' | 'ugc_hifi' | 'ugc_problem_solution' | 'yapper' | 'video_storyboard' | 'unknown';
  cta: string | null;
  landing_url: string | null;
  first_seen: string | null; // ISO date
  estimated_days_running: number | null;
}

export interface ScrapeOptions {
  brand: string;
  country: string; // Meta country code, e.g. "US", "CA", "GB"
  maxAds?: number; // default 5
}

// -------- Scraper --------

export async function scrapeCompetitorAds(options: ScrapeOptions): Promise<CompetitorAd[]> {
  const { brand, country, maxAds = 5 } = options;

  const browser: Browser = await chromium.launch({ headless: true });
  const page: Page = await browser.newPage();

  try {
    // Meta Ad Library search URL
    const url = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${country}&q=${encodeURIComponent(brand)}&search_type=keyword_unordered`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Accept cookie banner if present
    await dismissCookieBanner(page);

    // Wait for ad cards to render
    await page.waitForSelector('[role="article"]', { timeout: 15000 });

    // Auto-scroll a few times to load more ads
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(1500);
    }

    // Extract ad cards
    const ads = await page.$$eval('[role="article"]', (cards, brandName) => {
      return cards.slice(0, 25).map((card, idx) => {
        const text = (card.querySelector('[data-ad-preview="message"]') as HTMLElement)?.innerText
          ?? (card.querySelector('div[dir="auto"]') as HTMLElement)?.innerText
          ?? '';

        const cta = (card.querySelector('a[role="link"][target="_blank"]') as HTMLElement)?.innerText ?? null;
        const landingUrl = (card.querySelector('a[role="link"][target="_blank"]') as HTMLAnchorElement)?.href ?? null;

        // Format detection is coarse; refine later
        const hasVideo = !!card.querySelector('video');
        const format = hasVideo ? 'video_storyboard' : 'static_image';

        return {
          ad_id: `${brandName}_${Date.now()}_${idx}`,
          competitor_brand: brandName,
          primary_text: text,
          format: format as CompetitorAd['format'],
          cta,
          landing_url: landingUrl,
          first_seen: null,
          estimated_days_running: null,
        };
      });
    }, brand);

    return ads.slice(0, maxAds);
  } finally {
    await browser.close();
  }
}

// -------- Helpers --------

async function dismissCookieBanner(page: Page): Promise<void> {
  const banner = await page.$('button:has-text("Accept")');
  if (banner) {
    await banner.click().catch(() => {});
    await page.waitForTimeout(500);
  }
}

// -------- Persistence --------

export async function persistAds(runId: string, ads: CompetitorAd[]): Promise<void> {
  if (ads.length === 0) return;

  const rows = ads.map((ad) => ({
    run_id: runId,
    ad_id: ad.ad_id,
    competitor_brand: ad.competitor_brand,
    primary_text: ad.primary_text,
    format: ad.format,
    cta: ad.cta,
    landing_url: ad.landing_url,
    first_seen: ad.first_seen,
    estimated_days_running: ad.estimated_days_running,
    theme: null, // filled in by classifier in next step
    stage: null,
    tactic: null,
  }));

  const { error } = await supabaseAdmin.from('competitor_ads').insert(rows);
  if (error) {
    throw new Error(`Failed to persist competitor ads: ${error.message}`);
  }
}

// -------- CLI entry --------

async function main() {
  const args = process.argv.slice(2);
  const brandIdx = args.indexOf('--brand');
  const countryIdx = args.indexOf('--country');

  if (brandIdx === -1 || countryIdx === -1) {
    console.error('Usage: npx tsx lib/competitor/scrape.ts --brand "Brand Name" --country US');
    process.exit(1);
  }

  const brand = args[brandIdx + 1];
  const country = args[countryIdx + 1];

  console.log(`Scraping Meta Ad Library for ${brand} (${country})...`);

  const ads = await scrapeCompetitorAds({ brand, country, maxAds: 5 });

  console.log(`Found ${ads.length} ads.`);
  for (const ad of ads) {
    console.log(`  [${ad.format}] ${ad.primary_text.slice(0, 80)}...`);
  }

  // To persist: pass a run_id from the orchestrator
  // await persistAds(runId, ads);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
