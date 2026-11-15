// Worked example of a composed plan: the brief, research and plan an orchestrator might produce for rising CPA.
// Illustrative only. Sources show the shape; a real engagement researches fresh and cites what it actually read.
// Tests check every specialist and item it names exists in the catalogue.
export default {
  "request": "Our Meta ads CPA keeps going up and profit is shrinking",
  "brief": {
    "outcome": "Bring Meta purchase CPA back under break-even and toward the target, without losing new-customer volume or margin.",
    "deliverable": "A checked plan, built and launched, with an honest readout",
    "done": [
      "Measurement checked, or its limits stated",
      "Diagnosis with every hypothesis marked and evidenced",
      "Owner-chosen plan with reasons recorded",
      "Ads and page fixes built and checked",
      "Changes launched with owner approval and read back",
      "Experiments registered before launch and closed with a verdict",
      "Learnings saved for the next round"
    ],
    "metric": {
      "name": "Purchase CPA",
      "direction": "decrease",
      "unit": "INR per purchase",
      "baseline": 1450,
      "baseline_source": "reported",
      "target": 1100
    },
    "deadline": "January 2027",
    "guardrails": [
      "Purchase or new-customer volume does not fall more than the owner allows",
      "Contribution margin per order stays above break-even",
      "No change to brand claims without proof on file"
    ],
    "limits": [
      "Budget ceiling 7 lakh a month",
      "No discounts above 15%"
    ],
    "assets": [
      "Website and product pages"
    ],
    "connections": [
      {
        "name": "Meta Ads MCP",
        "access": "live",
        "status": "connected"
      },
      {
        "name": "Shopify MCP",
        "access": "read",
        "status": "connected"
      }
    ],
    "data_home": "A CSV in this project (the owner asked us to choose)",
    "technical_level": "Prefers ready changes to review, not instructions",
    "decides": "The owner",
    "unknowns": [
      "What changed around August, when costs rose"
    ],
    "answers": [
      {
        "question": "Which ad platforms, and how much a month?",
        "answer": "Meta, about 6 lakh a month"
      },
      {
        "question": "What was CPA before, what is it now, since when?",
        "answer": "From 900 to 1450 since August"
      },
      {
        "question": "Average order value, margin and break-even CPA?",
        "answer": "AOV 2400, margin 60%, break-even about 1400"
      },
      {
        "question": "What CPA counts as fixed, by when?",
        "answer": "Under 1100 by January"
      }
    ]
  },
  "research": {
    "approach": "Practitioners treat a rising CPA as a measurement question before a media question: they confirm tracking and reconcile platform purchases with real orders, check the landing page, and only then break cost down by segment, format, creative age and auction cost. Fixes are launched as controlled tests with one change each, read on enough volume, and fed into the next round.",
    "sources": [
      {
        "id": "web-meta",
        "kind": "web",
        "title": "Meta Business Help Center",
        "ref": "https://www.facebook.com/business/help",
        "note": "Platform documentation for Pixel, Conversions API, attribution settings, the learning phase and ad policies."
      },
      {
        "id": "web-vitals",
        "kind": "web",
        "title": "Web Vitals",
        "ref": "https://web.dev/articles/vitals",
        "note": "Google guidance on the page speed measures that affect conversion."
      },
      {
        "id": "cat-tracking",
        "kind": "catalogue",
        "title": "Set up tracking you can trust before you scale",
        "ref": "set-up-tracking-you-can-trust-before-you-scale"
      },
      {
        "id": "cat-bottleneck",
        "kind": "catalogue",
        "title": "Ad account bottleneck auditor",
        "ref": "ad-account-bottleneck-auditor"
      },
      {
        "id": "cat-test",
        "kind": "catalogue",
        "title": "Meta test campaign planner",
        "ref": "meta-test-campaign-planner"
      },
      {
        "id": "owner",
        "kind": "owner",
        "title": "Owner answers",
        "ref": "BRIEF.md"
      }
    ],
    "steps": [
      {
        "id": "s-context",
        "name": "Know the brand and offer",
        "why": "Creative and page judgements need the brand voice, proof and audience first.",
        "sources": [
          "owner",
          "cat-bottleneck"
        ]
      },
      {
        "id": "s-gather",
        "name": "Pull comparable before and after data",
        "why": "A rise is only visible against the period before it, at ad level with breakdowns.",
        "sources": [
          "cat-bottleneck",
          "owner"
        ]
      },
      {
        "id": "s-tracking",
        "name": "Check tracking and reconcile with real orders",
        "why": "Lost or double-counted events make CPA look worse or better than it is.",
        "sources": [
          "web-meta",
          "cat-tracking"
        ]
      },
      {
        "id": "s-site",
        "name": "Check the landing page and ad-to-page match",
        "why": "Slow or mismatched pages turn good clicks into lost sales.",
        "sources": [
          "web-vitals",
          "cat-bottleneck"
        ]
      },
      {
        "id": "s-diagnose",
        "name": "Break cost down by segment, format, creative age and auction",
        "why": "Each cause needs a different fix, and several can act at once.",
        "sources": [
          "cat-bottleneck",
          "web-meta"
        ]
      },
      {
        "id": "s-creative",
        "name": "Refresh creative with distinct concepts",
        "why": "Worn-out or look-alike ads raise cost even when targeting is right.",
        "sources": [
          "cat-bottleneck",
          "web-meta"
        ]
      },
      {
        "id": "s-test",
        "name": "Launch changes as controlled tests",
        "why": "One change per test, created paused, read on enough volume.",
        "sources": [
          "cat-test",
          "web-meta"
        ]
      }
    ],
    "pitfalls": [
      {
        "text": "Rebuilding creative while tracking is broken, so every later number misleads.",
        "sources": [
          "cat-tracking"
        ]
      },
      {
        "text": "Calling segment winners on too little volume.",
        "sources": [
          "cat-bottleneck"
        ]
      },
      {
        "text": "Editing ad sets so often they keep re-entering the learning phase.",
        "sources": [
          "web-meta"
        ]
      }
    ]
  },
  "plan": {
    "name": "Bring paid acquisition cost back down",
    "capabilities": [
      {
        "id": "ads-read",
        "access": "read",
        "via": "mcp",
        "name": "Read ad results (Meta Ads MCP)",
        "why": "Read campaign, ad set and ad results with breakdowns."
      },
      {
        "id": "store-read",
        "access": "read",
        "via": "mcp",
        "name": "Read store orders (Shopify MCP)",
        "why": "Reconcile platform purchases with real orders, new versus returning."
      },
      {
        "id": "analytics-read",
        "access": "read",
        "via": "browser",
        "name": "Measure the landing pages (browser, PageSpeed)",
        "why": "Check site sessions, conversion rate and page speed."
      },
      {
        "id": "ad-library",
        "access": "read",
        "via": "mcp",
        "name": "Search the ad library (Meta Ads MCP)",
        "why": "See the brand's and rivals' live ads for congruence and gap checks."
      },
      {
        "id": "creative-generate",
        "access": "draft",
        "via": "mcp",
        "name": "Draft images and video (generation MCP)",
        "why": "Make static images and video drafts from approved briefs."
      },
      {
        "id": "ads-write",
        "access": "live",
        "via": "mcp",
        "name": "Create and switch on ads (Meta Ads MCP)",
        "why": "Create paused campaigns, ad sets and ads, then switch on only what the owner approves."
      }
    ],
    "data": [
      {
        "id": "ad-results",
        "name": "Ad results by day with breakdowns",
        "why": "The base for every trend, segment and creative finding.",
        "fields": [
          "date",
          "campaign",
          "ad set",
          "ad",
          "spend",
          "impressions",
          "reach",
          "frequency",
          "clicks",
          "purchases",
          "purchase value",
          "age",
          "gender",
          "placement",
          "platform",
          "creative format"
        ],
        "routes": [
          {
            "kind": "MCP",
            "how": "Read with the ad platform MCP: at least 90 days, daily, with age/gender and placement breakdowns."
          },
          {
            "kind": "CSV",
            "how": "Ads Manager → Reports → daily, at ad level, breakdowns by age, gender and placement; export as CSV."
          }
        ],
        "required_for": [
          "evidence",
          "diagnosis"
        ],
        "alternative": "Weekly campaign-level totals support trend findings only; segment and creative findings stay unknown."
      },
      {
        "id": "orders",
        "name": "Store orders",
        "why": "Checks whether platform purchases match real orders, and splits new from returning customers.",
        "fields": [
          "order date",
          "order value",
          "discount",
          "new or returning",
          "utm source",
          "utm campaign"
        ],
        "routes": [
          {
            "kind": "MCP",
            "how": "Read orders for the same period with the store MCP."
          },
          {
            "kind": "CSV",
            "how": "Store admin → Orders → export for the same dates."
          }
        ],
        "required_for": [
          "integrity-tracking"
        ],
        "alternative": "Without orders, CPA stays platform-reported and the measurement check is marked limited."
      },
      {
        "id": "tracking-setup",
        "name": "Tracking setup",
        "why": "Broken or double-counted events make every other number wrong.",
        "fields": [
          "pixel id",
          "conversions API status",
          "event match quality",
          "deduplication",
          "attribution setting"
        ],
        "routes": [
          {
            "kind": "MCP",
            "how": "Meta Ads MCP: ads_get_datasets, ads_get_dataset_quality, ads_get_dataset_stats."
          },
          {
            "kind": "ASK",
            "how": "Screenshots of Events Manager overview and data sources."
          }
        ],
        "required_for": [
          "integrity-tracking"
        ]
      },
      {
        "id": "landing-pages",
        "name": "Landing page links",
        "why": "Needed for speed, checkout and ad-to-page congruence checks.",
        "fields": [
          "url of each page ads send traffic to"
        ],
        "routes": [
          {
            "kind": "URL",
            "how": "Read from the ads' destination links, or ask the owner."
          }
        ],
        "required_for": [
          "integrity-site"
        ]
      }
    ],
    "stages": [
      {
        "id": "intake",
        "kind": "intake",
        "name": "Pin down the problem",
        "goal": "Turn the owner's words into a measured problem, a target, limits and the data we can reach. Writes BRIEF.md.",
        "owner": {
          "role": "media-buyer"
        },
        "gate": "none",
        "from_steps": [],
        "uses": []
      },
      {
        "id": "context",
        "kind": "context",
        "name": "Build or reuse the org context",
        "goal": "Know what the business sells, to whom, with what proof and in what voice, so every later output fits the brand.",
        "owner": {
          "role": "brand-file-from-website"
        },
        "depends_on": [
          "intake"
        ],
        "outputs": [
          {
            "id": "brand-check",
            "name": "Org context check",
            "format": "markdown",
            "path": "context/BRAND-CHECK.md"
          }
        ],
        "checks": [
          {
            "id": "sources",
            "name": "Every brand fact names its source and date",
            "required": true
          },
          {
            "id": "claims",
            "name": "Claims are sorted into approved, pending and banned",
            "required": true
          }
        ],
        "gate": "none",
        "from_steps": [
          "s-context"
        ],
        "uses": [
          "website-brand-brain-builder",
          "product-page-brand-profile-extractor"
        ]
      },
      {
        "id": "evidence",
        "kind": "evidence",
        "name": "Gather the data in one place",
        "goal": "Pull ad results and orders for comparable periods into one working dataset where the owner wants it.",
        "owner": {
          "role": "media-buyer"
        },
        "data": [
          "ad-results"
        ],
        "needs": [
          "ads-read",
          "store-read"
        ],
        "depends_on": [
          "intake"
        ],
        "outputs": [
          {
            "id": "dataset",
            "name": "Working dataset",
            "format": "csv",
            "path": "evidence/dataset.csv"
          },
          {
            "id": "evidence-notes",
            "name": "What was pulled and how",
            "format": "markdown",
            "path": "evidence/EVIDENCE.md"
          }
        ],
        "checks": [
          {
            "id": "periods",
            "name": "Covers the period before costs rose and the period after",
            "required": true
          },
          {
            "id": "totals",
            "name": "Spend and purchase totals match the platform's own totals",
            "required": true
          },
          {
            "id": "breakdowns",
            "name": "Age, gender, placement and creative breakdowns are present or their absence is noted",
            "required": true
          }
        ],
        "gate": "none",
        "from_steps": [
          "s-gather"
        ],
        "uses": [
          "meta-results-review-agent",
          "ad-sales-drop-analyst"
        ]
      },
      {
        "id": "integrity-tracking",
        "kind": "integrity",
        "name": "Check the numbers can be trusted",
        "goal": "Verify Pixel and Conversions API, deduplication, event match quality and attribution, and reconcile platform purchases with real orders.",
        "owner": {
          "role": "paid-media-tracking-specialist"
        },
        "data": [
          "orders",
          "tracking-setup"
        ],
        "needs": [
          "ads-read",
          "store-read"
        ],
        "depends_on": [
          "evidence"
        ],
        "outputs": [
          {
            "id": "tracking",
            "name": "Measurement check",
            "format": "markdown",
            "path": "integrity/TRACKING.md"
          }
        ],
        "checks": [
          {
            "id": "reconcile",
            "name": "Platform purchases and store orders agree within 10%, or the gap is explained",
            "required": true
          },
          {
            "id": "dedup",
            "name": "Browser and server events are deduplicated",
            "required": true
          },
          {
            "id": "attribution",
            "name": "Attribution setting is recorded and the same across compared periods",
            "required": true
          },
          {
            "id": "verdict",
            "name": "Ends with CHECKED, LIMITED or UNRELIABLE and what that means for diagnosis",
            "required": true
          }
        ],
        "gate": "none",
        "from_steps": [
          "s-tracking"
        ],
        "uses": [
          "set-up-tracking-you-can-trust-before-you-scale",
          "meta-server-tracking-checker",
          "meta-event-matching-evidence-reviewer"
        ]
      },
      {
        "id": "integrity-site",
        "kind": "integrity",
        "name": "Check the site and ad-to-page match",
        "goal": "Find drop-off from slow pages or a broken checkout, and score whether each page keeps the promise its ads make.",
        "owner": {
          "role": "cro-specialist"
        },
        "data": [
          "landing-pages"
        ],
        "needs": [
          "analytics-read",
          "ad-library"
        ],
        "depends_on": [
          "context"
        ],
        "outputs": [
          {
            "id": "site",
            "name": "Site and congruence check",
            "format": "markdown",
            "path": "integrity/SITE-AND-CONGRUENCE.md"
          }
        ],
        "checks": [
          {
            "id": "speed",
            "name": "Mobile load measured on the real pages ads send traffic to",
            "required": true
          },
          {
            "id": "congruence",
            "name": "Each top ad has a congruence score with the reasons",
            "required": true
          },
          {
            "id": "checkout",
            "name": "Checkout tested end to end, or marked not tested",
            "required": true
          }
        ],
        "gate": "none",
        "from_steps": [
          "s-site"
        ],
        "uses": [
          "page-speed-fixer",
          "landing-page-auditor",
          "ad-and-page-match-checker",
          "ad-library-teardown-counter"
        ]
      },
      {
        "id": "diagnosis",
        "kind": "diagnosis",
        "name": "Find what is really driving cost up",
        "goal": "Test the hypothesis library against the data: segments, formats, creative fatigue, concept diversity, timing, auction costs and the landing page. Keep competing explanations.",
        "owner": {
          "role": "media-buyer"
        },
        "data": [
          "ad-results"
        ],
        "depends_on": [
          "evidence",
          "integrity-tracking",
          "integrity-site",
          "context"
        ],
        "outputs": [
          {
            "id": "diagnosis",
            "name": "Diagnosis",
            "format": "markdown",
            "path": "diagnosis/DIAGNOSIS.md"
          },
          {
            "id": "hypotheses",
            "name": "Hypothesis verdicts",
            "format": "json",
            "path": "diagnosis/hypotheses.json"
          }
        ],
        "checks": [
          {
            "id": "verdicts",
            "name": "Every listed hypothesis is SUPPORTED, REFUTED or UNKNOWN, with evidence",
            "required": true
          },
          {
            "id": "volume",
            "name": "Segment findings meet a minimum volume, or are marked low-confidence",
            "required": true
          },
          {
            "id": "weighted",
            "name": "Totals are spend-weighted, not averages of averages",
            "required": true
          },
          {
            "id": "alternatives",
            "name": "Each main finding names at least one competing explanation",
            "required": true
          }
        ],
        "gate": "none",
        "from_steps": [
          "s-diagnose"
        ],
        "support": [
          "paid-media-auditor",
          "creative-evidence-review-agent"
        ],
        "uses": [
          "ad-account-bottleneck-auditor",
          "six-pattern-ad-performance-diagnoser",
          "ad-performance-early-warning-reviewer",
          "winners-and-losers-ad-comparer",
          "meta-creative-similarity-risk-reviewer",
          "cohort-funnel-reader"
        ]
      },
      {
        "id": "options",
        "kind": "options",
        "name": "Rank what to change",
        "goal": "Turn supported findings into 5 to 15 ranked recommendation cards, fewer if the evidence supports fewer.",
        "owner": {
          "role": "media-buyer"
        },
        "depends_on": [
          "diagnosis"
        ],
        "outputs": [
          {
            "id": "recommendations",
            "name": "Recommendation cards",
            "format": "markdown",
            "path": "options/RECOMMENDATIONS.md"
          },
          {
            "id": "recommendations-json",
            "name": "Recommendation cards as data",
            "format": "json",
            "path": "options/recommendations.json"
          }
        ],
        "checks": [
          {
            "id": "evidence",
            "name": "Every card cites the finding it rests on",
            "required": true
          },
          {
            "id": "fields",
            "name": "Every card has expected direction, effort, confidence, risk and how it will be measured",
            "required": true
          },
          {
            "id": "order",
            "name": "Cards are ranked, with measurement fixes first when tracking is not CHECKED",
            "required": true
          }
        ],
        "gate": "none",
        "from_steps": [],
        "uses": [
          "break-even-ad-target-finder",
          "next-dollar-budget-allocator",
          "small-budget-ad-test-planner"
        ]
      },
      {
        "id": "decision",
        "kind": "decision",
        "name": "Owner chooses",
        "goal": "The owner picks card IDs. Ask for the reason when they pass on a top card or pick a low one; record it as a decision.",
        "owner": {
          "role": "media-buyer"
        },
        "depends_on": [
          "options"
        ],
        "outputs": [
          {
            "id": "decision",
            "name": "Chosen plan",
            "format": "markdown",
            "path": "decision/DECISION.md"
          }
        ],
        "checks": [
          {
            "id": "recorded",
            "name": "Chosen and passed-over cards are in decisions.jsonl",
            "required": true
          },
          {
            "id": "rationale",
            "name": "A reason is recorded wherever the top card was passed over",
            "required": true
          }
        ],
        "gate": "approve",
        "from_steps": [],
        "uses": []
      },
      {
        "id": "tracking-fixes",
        "kind": "production",
        "name": "Fix measurement",
        "goal": "Prepare the chosen tracking fixes: Conversions API, deduplication, event parameters or attribution, as exact steps or a ready patch.",
        "owner": {
          "role": "paid-media-tracking-specialist"
        },
        "depends_on": [
          "decision",
          "integrity-tracking"
        ],
        "outputs": [
          {
            "id": "tracking-fixes",
            "name": "Tracking fixes",
            "format": "markdown",
            "path": "production/TRACKING-FIXES.md"
          }
        ],
        "checks": [
          {
            "id": "scoped",
            "name": "Only chosen fixes are included",
            "required": true
          },
          {
            "id": "verify",
            "name": "Each fix says how to confirm it worked in Events Manager or the store",
            "required": true
          }
        ],
        "gate": "none",
        "optional_when": "No measurement card was chosen.",
        "from_steps": [
          "s-tracking"
        ],
        "uses": [
          "set-up-tracking-you-can-trust-before-you-scale",
          "meta-server-tracking-checker"
        ]
      },
      {
        "id": "concepts",
        "kind": "production",
        "name": "Plan the creative",
        "goal": "Turn chosen audience and creative cards into distinct concepts and briefs, in the brand voice, for the right awareness stage and format.",
        "owner": {
          "role": "paid-media-creative-strategist"
        },
        "needs": [
          "ad-library"
        ],
        "depends_on": [
          "decision",
          "context"
        ],
        "outputs": [
          {
            "id": "concepts",
            "name": "Concepts and briefs",
            "format": "markdown",
            "path": "production/CONCEPTS.md"
          }
        ],
        "checks": [
          {
            "id": "distinct",
            "name": "Concepts differ in angle or audience, not just wording",
            "required": true
          },
          {
            "id": "traced",
            "name": "Every concept traces to a chosen card",
            "required": true
          }
        ],
        "gate": "review",
        "optional_when": "No creative or audience card was chosen.",
        "from_steps": [
          "s-creative"
        ],
        "uses": [
          "awareness-stage-ad-framework-chooser",
          "ad-angle-planner",
          "seven-bucket-ad-concept-brainstormer",
          "meta-concept-diversity-test-planner",
          "competitor-ad-theme-and-gap-mapper"
        ]
      },
      {
        "id": "ad-production",
        "kind": "production",
        "name": "Make the ads",
        "goal": "Write scripts, hooks, headlines and primary text, and make static images and video drafts for each concept. Check every ad before the owner sees it.",
        "owner": {
          "role": "campaign-copy-draft-agent"
        },
        "needs": [
          "creative-generate"
        ],
        "depends_on": [
          "concepts"
        ],
        "outputs": [
          {
            "id": "ad-pack",
            "name": "Ad pack for review",
            "format": "markdown",
            "path": "production/AD-PACK.md"
          },
          {
            "id": "ad-manifest",
            "name": "Ad files and copy",
            "format": "json",
            "path": "production/ads.json"
          }
        ],
        "checks": [
          {
            "id": "brand",
            "name": "Copy and visuals match the org context voice and look",
            "required": true
          },
          {
            "id": "proof",
            "name": "Every claim has proof on file",
            "required": true
          },
          {
            "id": "policy",
            "name": "Passes ad policy checks",
            "required": true
          },
          {
            "id": "specs",
            "name": "Sizes and safe zones fit each placement",
            "required": true
          },
          {
            "id": "match",
            "name": "Each ad matches the page it will send traffic to",
            "required": true
          }
        ],
        "gate": "none",
        "optional_when": "No creative card was chosen.",
        "from_steps": [
          "s-creative"
        ],
        "support": [
          "design-specialist",
          "weekly-image-ad-batch-maker",
          "weekly-video-ad-batch-maker"
        ],
        "reviewers": [
          "paid-media-creative-strategist"
        ],
        "uses": [
          "image-ad-copy-writer",
          "five-tactic-ad-hook-writer",
          "five-part-creator-ad-script-writer",
          "twelve-pattern-static-ad-brief-maker",
          "six-image-ad-prompt-set",
          "static-ad-critic",
          "video-hook-scorer",
          "meta-ads-compliance-checker",
          "pre-launch-ad-checker"
        ]
      },
      {
        "id": "page-fixes",
        "kind": "production",
        "name": "Fix the landing page",
        "goal": "Prepare the chosen page changes: speed fixes and copy that keeps the ad's promise.",
        "owner": {
          "role": "cro-specialist"
        },
        "depends_on": [
          "decision",
          "integrity-site"
        ],
        "outputs": [
          {
            "id": "page-changes",
            "name": "Page changes",
            "format": "markdown",
            "path": "production/PAGE-CHANGES.md"
          }
        ],
        "checks": [
          {
            "id": "scoped",
            "name": "Only chosen changes are included",
            "required": true
          },
          {
            "id": "preview",
            "name": "Changes are previewed, or delivered as a ready patch with steps",
            "required": true
          }
        ],
        "gate": "none",
        "optional_when": "No landing-page card was chosen.",
        "from_steps": [
          "s-site"
        ],
        "uses": [
          "ad-matched-landing-page-writer",
          "page-speed-fixer"
        ]
      },
      {
        "id": "launch",
        "kind": "execution",
        "name": "Launch, paused first",
        "goal": "Create the campaigns, ad sets and ads paused, read them back, register each test, then switch on only what the owner approves.",
        "owner": {
          "role": "media-buyer"
        },
        "needs": [
          "ads-write"
        ],
        "depends_on": [
          "ad-production",
          "page-fixes",
          "tracking-fixes"
        ],
        "outputs": [
          {
            "id": "receipt",
            "name": "Launch receipt with entity IDs",
            "format": "markdown",
            "path": "execution/LAUNCH-RECEIPT.md"
          }
        ],
        "checks": [
          {
            "id": "paused",
            "name": "Everything was created paused and read back from the platform",
            "required": true
          },
          {
            "id": "settings",
            "name": "Budgets, audiences and placements match the chosen plan",
            "required": true
          },
          {
            "id": "registered",
            "name": "Each test is registered in experiments.jsonl before it goes live",
            "required": true
          }
        ],
        "gate": "approve_each_action",
        "from_steps": [
          "s-test"
        ],
        "uses": [
          "meta-setup-of-new-ad-campaigns-with-new-creatives-planner",
          "meta-adding-new-ads-to-an-existing-campaign-planner",
          "meta-test-campaign-planner"
        ]
      },
      {
        "id": "measurement",
        "kind": "measurement",
        "name": "Read the results honestly",
        "goal": "Check results on a schedule against the registered metric and limits, flag fatigue and breaches, and propose budget moves within the owner's rules.",
        "owner": {
          "role": "experiment-readout-desk"
        },
        "needs": [
          "ads-read"
        ],
        "depends_on": [
          "launch"
        ],
        "outputs": [
          {
            "id": "readout",
            "name": "Results readout",
            "format": "markdown",
            "path": "measurement/READOUT.md"
          },
          {
            "id": "monitor",
            "name": "Check-in schedule and prompt",
            "format": "markdown",
            "path": "measurement/MONITOR.md"
          }
        ],
        "checks": [
          {
            "id": "volume",
            "name": "A verdict is given only when the minimum volume is met; otherwise INCONCLUSIVE",
            "required": true
          },
          {
            "id": "guardrails",
            "name": "Every guardrail is checked",
            "required": true
          },
          {
            "id": "like-for-like",
            "name": "Comparisons use the same attribution, dates and definitions",
            "required": true
          }
        ],
        "gate": "none",
        "from_steps": [],
        "support": [
          "ad-test-sprint-runner",
          "ad-fatigue-watcher"
        ],
        "uses": [
          "ad-test-budget-calculator",
          "creative-test-reader",
          "keyed-ad-results-log-keeper",
          "ad-results-report-writer"
        ]
      },
      {
        "id": "learning",
        "kind": "learning",
        "name": "Keep what we learned",
        "goal": "Close each experiment, record wins and losses, propose durable rules with their scope, and plan the next round.",
        "owner": {
          "role": "media-buyer"
        },
        "depends_on": [
          "measurement"
        ],
        "outputs": [
          {
            "id": "learnings",
            "name": "Learnings and next round",
            "format": "markdown",
            "path": "learning/LEARNINGS.md"
          }
        ],
        "checks": [
          {
            "id": "closed",
            "name": "Every launched experiment is closed in experiments.jsonl",
            "required": true
          },
          {
            "id": "scoped",
            "name": "Each proposed rule says whether it holds for this job, this business or the playbook",
            "required": true
          }
        ],
        "gate": "none",
        "from_steps": [],
        "uses": [
          "image-ad-test-learnings",
          "find-out-why-your-ad-test-did-not-win-and-plan-the-next-round"
        ]
      }
    ],
    "hypotheses": [
      {
        "id": "h-tracking",
        "statement": "Cost only looks higher because tracking lost or double-counted purchases.",
        "test": "Compare platform purchases with store orders by day across both periods; check event match quality and deduplication.",
        "confirm_if": "The platform-to-store ratio changed when CPA rose, or events were lost or duplicated.",
        "refute_if": "The ratio is steady and tracking checks pass.",
        "fix_stage": "tracking-fixes"
      },
      {
        "id": "h-audience-drift",
        "statement": "Spend drifted toward audiences that buy less.",
        "test": "Spend share and CPA by age, gender, placement and platform, before versus after.",
        "confirm_if": "Spend share rose in segments with above-average CPA.",
        "refute_if": "Mix is stable, or moved toward cheaper segments.",
        "fix_stage": "concepts"
      },
      {
        "id": "h-underserved-segment",
        "statement": "A profitable segment gets too little spend or unsuited messaging.",
        "test": "Find segments with below-average CPA and below-average spend share; read the ads they see.",
        "confirm_if": "A segment with enough volume beats average CPA by 20% or more on a small share of spend.",
        "refute_if": "No segment with enough volume beats average.",
        "fix_stage": "concepts"
      },
      {
        "id": "h-format-mix",
        "statement": "Most spend sits on the weaker format.",
        "test": "CPA and spend share by format (video, static, carousel, UGC).",
        "confirm_if": "The format with most spend has clearly higher CPA than another format with enough volume.",
        "refute_if": "Spend already favours the better format.",
        "fix_stage": "concepts"
      },
      {
        "id": "h-fatigue",
        "statement": "Top ads are worn out.",
        "test": "For top-spend ads: frequency, click-through and CPA over time.",
        "confirm_if": "Frequency up and click-through down while CPA rises on the same ads.",
        "refute_if": "Top ads hold click-through and CPA.",
        "fix_stage": "ad-production"
      },
      {
        "id": "h-concept-sameness",
        "statement": "Too few distinct concepts, so delivery treats many ads as one.",
        "test": "Group live ads by concept and visual similarity; count distinct concepts with spend.",
        "confirm_if": "Most spend sits on two or fewer concepts or near-identical visuals.",
        "refute_if": "Several distinct concepts each get real spend.",
        "fix_stage": "concepts"
      },
      {
        "id": "h-timing",
        "statement": "Some days or hours waste spend.",
        "test": "CPA by day of week, and by hour if available.",
        "confirm_if": "Some days run well above average CPA with enough volume.",
        "refute_if": "CPA is flat across days.",
        "fix_stage": "launch"
      },
      {
        "id": "h-learning-churn",
        "statement": "Frequent edits keep ad sets stuck in learning.",
        "test": "Account change history and learning status around the rise.",
        "confirm_if": "Major edits or new ad sets reset learning often during the rise.",
        "refute_if": "Structure was stable.",
        "fix_stage": "launch"
      },
      {
        "id": "h-page-mismatch",
        "statement": "The landing page breaks the ad's promise or loads slowly, so clicks don't buy.",
        "test": "Congruence score per top ad; mobile speed; click-to-purchase rate before versus after.",
        "confirm_if": "Low congruence or slow pages on high-spend ads, or click-to-purchase fell while click-through held.",
        "refute_if": "Click-to-purchase is steady and pages pass.",
        "fix_stage": "page-fixes"
      },
      {
        "id": "h-auction",
        "statement": "The auction got more expensive (higher CPMs), not the ads worse.",
        "test": "CPM trend against click-through and conversion rate.",
        "confirm_if": "CPM rose while click-through and conversion held.",
        "refute_if": "CPM is flat; the rise comes from click-through or conversion.",
        "fix_stage": "concepts"
      },
      {
        "id": "h-offer",
        "statement": "An offer, price or stock change made the product harder to buy.",
        "test": "Line up price, discount and stock changes with the CPA rise.",
        "confirm_if": "CPA rose when an offer ended, a price rose or best sellers went out of stock.",
        "refute_if": "No such change lines up.",
        "fix_stage": "page-fixes"
      }
    ],
    "measurement": {
      "window": "At least 7 days per test, longer for low volume; compare like-for-like periods.",
      "min_volume": "At least 50 purchases per variant, or the budget the ad-test calculator sets for this CPA.",
      "stop_rule": "Stop early only if a guardrail breaks; otherwise run the full window before a verdict."
    }
  }
};
