---
name: yt-seo
description: >-
  Write the description, tags and search-facing text for a YouTube video,
  aimed at the query a real person types. Use for "write my description",
  "tags", "SEO", "help this video get found", "nobody is finding this".
---

# yt-seo

Search is a smaller lever than packaging and a bigger one than people think for evergreen videos.
For a video aimed at the subscriber feed, say so and point the user to the YouTube title and thumbnail checker instead. This skill is for videos that people find by search.

## Before you write

1. Get the voice. If the user pasted a voice profile or a voice.md file (how they talk on camera,
   the words they never use, who they talk to, what they will not claim), use it. If you are in an
   environment that can read files and `~/.claude/youtube/voice.md` exists, read it. If there is
   none, ask once for the text or transcripts of up to three of their own videos and infer the voice
   from them. If they give nothing, write in plain, direct language and say the voice is a guess.
   Offer to save the voice notes as voice.md, but never block the work on it.
2. Get the video. You need the topic or a transcript. If you have neither, ask once. The search
   phrases, a link to feature and the chapter list are optional. Mark anything missing as MISSING.
   Do not guess what the video says.
3. Never invent a number, a result or a source. If a figure would strengthen it and you do not have
   one, ask for it or write the line without it.

## The description

- **The first two lines are the only ones anyone reads.** They show above "...more" and they are
  the search snippet. Say what the video gives them, in the words they would have typed.
- Then the link or the resource, if there is one, so it is above the fold.
- Then chapters. If the user has timestamps, format them. If not, leave a line marked MISSING and point them to the YouTube chapter writer.
- Then the long version: what is covered, who it is for, what it assumes.

## Tags, honestly

Tags are a weak signal and YouTube has said so. Use them for disambiguation - spellings, the tool
names, the abbreviations people actually type - and stop. Fifteen is plenty. A wall of tags is not
a strategy and stuffing unrelated ones is against the terms.

## The query test

Before handing anything over, write the three search queries this video should win, and check the
title and first two description lines contain the words in those queries. If they do not, the
problem is the title, not the description.

## The result

Return these parts, in this order:

1. **Three target searches.** The three queries a real person would type, one per line.
2. **Description.** A block the user can copy, with the first two lines first.
3. **Tags.** A comma-separated list of up to 15, for spellings, tool names and abbreviations only.
4. **Query check.** One line per query: does the title contain it, does the opening of the description contain it. If a query is missing from the title, say the title needs changing.

## The gate

Nothing here publishes. This skill writes and you publish. Every output ends in a block the user
copies, and the last line of every run is the question: **ship it, or change it?**
