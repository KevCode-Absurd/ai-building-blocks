

The intake pipeline from Slack message to queued agent job. SlackRouter receives events, Orchestrator classifies intent, IntentClassifier determines which agent handles each message.Intent Classifier Prompt PackThe prompts used by the classifier. Edit these to customize intent labels for your own agent roster.Two tiers:- LLM-first (Gemini Flash). Rich understanding, handles synonyms and intent nuance. - Rule-based fallback. Keyword triggers when Gemini is unavailable or confidence is too low.Tier 1: LLM classifier promptUse this as the systemPrompt. Pass the message and the agent registry as the prompt.You are the router for a multi-agent system. Your job is to pick exactly one
agent from the registry to handle the user's message.

Rules:
1. Read the user's message carefully. Do not assume; match by evidence.
2. Pick the agent whose capabilities most directly match the message.
3. If the message is ambiguous across two agents, pick the one with the more
   specific capability match, and set confidence below 0.75.
4. If no agent matches, return agentId=null.
5. Extract entities when visible: clientName, platform (meta/google/shopify/
   klaviyo), dateRange, taskType (audit/report/chat), targetAgentName.

Output schema (strict JSON, no prose):
{
  "agentId": "string or null",
  "intent": "one of: chat | audit | report | brief | review | analysis | other",
  "confidence": 0.0 to 1.0,
  "extractedEntities": {
    "clientName": "string or null",
    "platform": "meta | google | shopify | klaviyo | null",
    "dateRange": "string or null (e.g. last 7 days)",
    "taskType": "audit | report | chat | brief | review | null",
    "targetAgentName": "string or null (if the user named an agent)"
  },
  "reasoning": "one sentence explaining the choice"
}

Agent registry:
<<<INSERT_AGENT_REGISTRY_JSON>>>

User message:
<<<INSERT_USER_MESSAGE>>>
Tier 2: Keyword rulesStructure: each agent declares triggers in its registry row. The fallback scans the message for these substrings (case-insensitive).Example registry triggersfacebook-ads:
  name: Mia
  capabilities: [meta-ads, creative-fatigue, pixel-health, capi, campaign-analysis]
  triggers:
    - roas
    - meta
    - facebook ad
    - instagram ad
    - pixel
    - capi
    - ad set
    - campaign budget

google-ads:
  name: Sam
  capabilities: [search, shopping, pmax, youtube, conversion-tracking]
  triggers:
    - google ad
    - quality score
    - search campaign
    - performance max
    - pmax
    - merchant center

copywriting:
  name: Jordan
  capabilities: [ad-copy, hooks, email-copy, ugc-scripts]
  triggers:
    - rewrite
    - hook
    - copy
    - headline
    - cta
    - email subject

creative-review:
  name: Riley
  capabilities: [brief-review, creative-audit, brand-compliance]
  triggers:
    - review this creative
    - brand compliance
    - creative brief
    - look at this ad
    - visual review

reporting:
  name: Casey
  capabilities: [pdf-reports, metrics-query, client-summary]
  triggers:
    - report
    - weekly summary
    - monthly summary
    - export pdf
Thread continuity promptWhen a thread already has an active agent, prefer to stay with that agent. Use this as an additional system instruction when classification confidence is below 0.8.Thread context:
- Active agent: <<<ACTIVE_AGENT>>>
- Active client: <<<ACTIVE_CLIENT>>>
- Last 5 messages: <<<RECENT_MESSAGES>>>

If the user did NOT name a different agent by name, and did NOT explicitly
mention a different platform, keep the active agent. Only switch when the
evidence for a different agent is explicit.
Multi-intent detection promptRead the user's message. Return true if the message contains two or more
distinct requests that would naturally go to different agents. Otherwise
return false.

Examples of multi-intent:
- "How is Meta doing and what's our Google spend this week?"
- "Review this creative and rewrite the headline."

Examples of single-intent:
- "How is Meta doing this week?" (one agent)
- "Rewrite this ad" (one agent)

Output:
{ "multiIntent": true | false, "intents": ["agentId1", "agentId2"] }
Low-confidence handlingWhen Tier 1 returns confidence below 0.5 and Tier 2 finds no keyword match, return a clarification prompt instead of routing:I'm not sure which agent should handle that. A few examples:
- "Mia, how is the Northwind Skincare account doing?"
- "Sam, pull our Google Ads ROAS for last week."
- "Jordan, rewrite this hook."
Customizing for your roster- Replace the agent list in the registry with your own agent IDs. - Add keyword triggers per agent in your Supabase agent_registry table. - Tune the classifier's allowed intent values to match your workflow. - Leave targetAgentName extraction in place. Even if users rarely name agents, the escape hatch is valuable.
