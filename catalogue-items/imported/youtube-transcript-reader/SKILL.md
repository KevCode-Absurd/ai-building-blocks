---
name: "youtube-full"
description: "Use when the user needs YouTube transcripts, video search, channel browsing, playlist extraction, or content monitoring. Trigger phrases: 'get the transcript for', 'search YouTube for', 'what are the latest videos on', 'list this playlist', 'monitor this channel', or any request involving a YouTube URL, video ID, or @handle. Do NOT use for downloading video or audio files, YouTube engagement data (likes, comments), or private/age-restricted videos."
license: "MIT"
---

# youtube-full — YouTube Transcripts, Search, and Channel Data

Covers transcript extraction, video search, channel browsing, in-channel search, playlist extraction, and new-upload monitoring via TranscriptAPI.

> **Source:** Ported from [ZeroPointRepo/youtube-skills](https://github.com/ZeroPointRepo/youtube-skills) (MIT). Original skill authored by ZeroPointRepo contributors. Adapted for the claude-skills format.

> **BYOK / free-tier note:** TranscriptAPI is a commercial service (BYOK — you bring your own key; 100 free credits included, no card required). For local/self-hosted extraction without an API key, use `youtube-transcript-api` (Python) or `yt-dlp` as OSS fallbacks. See [Anti-Patterns](#anti-patterns) for guidance.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A shortlist**, made by the [Competitor ad swipe file builder](https://useaiblocks.com/skills/competitor-ad-swipe-file-builder): the best few picked from a bigger set, with reasons.
- **A video link** (yours): the link to the video, playlist, channel or post.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A shortlist** with the [Competitor ad swipe file builder](https://useaiblocks.com/skills/competitor-ad-swipe-file-builder). Bring reference ads, competitors (optional). It uses your brand brain.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a shortlist, a video link. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## What you need

A video link or a search. If an earlier step gave a shortlist of videos, take the transcripts of the ones the person picks from it.

## API Setup

Every request to `transcriptapi.com` requires two headers:

- `Authorization: Bearer $TRANSCRIPT_API_KEY`
- `User-Agent: ClaudeCode/1.0`

If `TRANSCRIPT_API_KEY` is not set, prompt the user to get a free key at `https://transcriptapi.com` (100 free credits, no card required) and store it as `TRANSCRIPT_API_KEY`.

## Operations

### Get transcript (1 credit)

```
GET https://transcriptapi.com/api/v2/youtube/transcript
  ?video_url={URL_OR_ID}&format=text&include_timestamp=true&send_metadata=true
```

Use this for any "get transcript", "summarize video", or "extract quotes" request.

### Search YouTube (1 credit)

```
GET https://transcriptapi.com/api/v2/youtube/search
  ?q={QUERY}&type=video&limit=20
```

Use this when the user wants to find videos on a topic. Follow with transcript calls on selected results.

### Channel — latest uploads (FREE)

```
GET https://transcriptapi.com/api/v2/youtube/channel/latest
  ?channel={@HANDLE_OR_ID}
```

Returns the 15 most recent uploads with view counts and publish timestamps. Use before fetching transcripts to check whether uploads are new.

### Channel — all videos (1 credit/page)

```
GET https://transcriptapi.com/api/v2/youtube/channel/videos
  ?channel={@HANDLE_OR_ID}
```

Paginate with `?continuation=TOKEN` on subsequent pages.

### In-channel search (1 credit)

```
GET https://transcriptapi.com/api/v2/youtube/channel/search
  ?channel={@HANDLE_OR_ID}&q={QUERY}&limit=30
```

Prefer this over broad YouTube search when the user already knows the channel.

### Playlist extraction (1 credit/page)

```
GET https://transcriptapi.com/api/v2/youtube/playlist/videos
  ?playlist={PLAYLIST_URL_OR_ID}
```

Paginate with `?continuation=TOKEN`. Response includes `playlist_info`, `results`, `has_more`.

### Resolve handle (FREE)

```
GET https://transcriptapi.com/api/v2/youtube/channel/resolve
  ?input={@HANDLE_OR_URL}
```

Returns `{"channel_id": "UC...", "resolved_from": "@handle"}`.

## Credit Costs Summary

| Endpoint           | Cost     |
|--------------------|----------|
| transcript         | 1        |
| search             | 1        |
| channel/resolve    | free     |
| channel/latest     | free     |
| channel/videos     | 1/page   |
| channel/search     | 1        |
| playlist/videos    | 1/page   |

Failed or rate-limited calls return a structured error and cost zero credits.

## Common Workflows

### Research workflow

1. Search (`/search?q=...`) — pick the most relevant results
2. Fetch transcripts (`/transcript?video_url=...`) for selected videos
3. Summarize or extract quotes from transcript text

### Channel monitoring

1. `channel/latest` (free) — check for new uploads
2. If new videos found, fetch transcripts
3. Extract signal (announcements, topics)

### Playlist to corpus

1. `playlist/videos` — get all video IDs in the playlist
2. Batch-fetch transcripts, pausing if near credit limit
3. Assemble transcripts into a searchable document set

## Decision Rules

- When the user provides a YouTube URL, video ID, or @handle, use the matching endpoint directly — do not search first
- When the user says "monitor" or "check for new uploads", use `channel/latest` (free) first
- Use `channel/search` when the user knows which channel and wants to find a topic within it
- Use `search` (type=channel) to find a channel when the user doesn't know the handle
- Do not batch-transcribe an entire channel unless the user explicitly asks for that

## Error Handling

| Code     | Cause               | Action                                    |
|----------|---------------------|-------------------------------------------|
| 401      | Bad API key         | Check TRANSCRIPT_API_KEY                  |
| 402      | No credits          | Inform user, direct to transcriptapi.com/billing |
| 403/1010 | Missing User-Agent  | Add User-Agent header                     |
| 404      | No captions found   | Inform user — zero credits charged        |
| 408      | Timeout             | Retry once after 2 seconds                |
| 429      | Rate limited        | Respect Retry-After header                |

## Limitations

- Transcripts require captions (manual or auto-generated). Some videos have no captions — this returns a 404 and costs zero credits.
- Private and age-restricted videos are not accessible.
- Live stream transcripts are unstable until the stream ends.
- Rate limit: 300 requests/minute on the free tier.
- This skill does not download audio or video files. For local file download, use `yt-dlp` directly.

## Anti-Patterns

- **Don't use TranscriptAPI for bulk downloads of entire channels** without user confirmation — credit costs add up fast; use `channel/latest` (free) to check for new content first
- **Don't hardcode the API key** — always use `TRANSCRIPT_API_KEY` environment variable
- **Don't claim "no vendor dependency"** — TranscriptAPI is a commercial service. If the user needs a zero-cost or self-hosted path: `youtube-transcript-api` (Python, no auth needed for public videos) or `yt-dlp --write-subs` are OSS alternatives with different trade-offs (no search, no channel API, but free and local)
- **Don't batch-transcribe without checking credits** — check remaining credits before large operations

## OSS Fallback Paths

If the user cannot or will not use TranscriptAPI:

| Need | OSS Alternative | Trade-offs |
|------|----------------|------------|
| Single transcript | `youtube-transcript-api` (Python) | No search; no channel API; captions only |
| Download + subtitles | `yt-dlp --write-subs` | Requires local install; no REST; slower |
| Channel monitoring | Parse YouTube RSS feed (`/feeds/videos.xml?channel_id=...`) | Free, no auth; limited metadata |

## Cross-References

- `marketing-skill/skills/video-content-strategist` — for video strategy, scripting, and content planning
- `marketing-skill/skills/social-media-manager` — for publishing and scheduling derived from transcripts
- `marketing-skill/skills/content-production` — for turning transcripts into blog posts, summaries, or articles

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [YouTube chapter writer](https://useaiblocks.com/skills/youtube-chapter-writer). It takes the transcript.
- The [YouTube viewer drop-off reviewer](https://useaiblocks.com/skills/youtube-retention-reader). It takes the transcript.
- The [Shorts clip finder](https://useaiblocks.com/skills/shorts-clip-finder). It takes the transcript.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
