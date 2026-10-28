---
name: dotnet-timezone
description: '.NET timezone handling guidance for C# applications. Use when working with TimeZoneInfo, DateTimeOffset, NodaTime, UTC conversion, daylight saving time, scheduling across timezones, cross-platform Windows/IANA timezone IDs, or when a .NET user needs the timezone for a city, address, region, or country and copy-paste-ready C# code.'
---

# .NET Timezone

Resolve timezone questions for .NET and C# code with production-safe guidance and copy-paste-ready snippets.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Start With The Right Path

Identify the request type first:

- Address or location lookup
- Timezone ID lookup
- UTC/local conversion
- Cross-platform timezone compatibility
- Scheduling or DST handling
- API or persistence design

If the library is unclear, default to `TimeZoneConverter` for cross-platform work. If the scenario involves recurring schedules or strict DST rules, prefer `NodaTime`.

## Resolve Addresses And Locations

If the user provides an address, city, region, country, or document containing place names:

1. Extract each location from the input.
2. Read `references/timezone-index.md` for common Windows and IANA mappings.
3. If the exact location is not listed, infer the correct IANA zone from geography, then map it to the Windows ID.
4. Return both IDs and a ready-to-use C# example.

For each resolved location, provide:

```text
Location: <resolved place>
Windows ID: <windows id>
IANA ID: <iana id>
UTC offset: <standard offset and DST offset when relevant>
DST: <yes/no>
```

Then include a cross-platform snippet like:

```csharp
using TimeZoneConverter;

TimeZoneInfo tz = TZConvert.GetTimeZoneInfo("Asia/Colombo");
DateTime local = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz);
```

If multiple locations are present, include one block per location and then a combined multi-timezone snippet.

If a location is ambiguous, list the possible timezone matches and ask the user to choose the correct one.

## Look Up Timezone IDs

Use `references/timezone-index.md` for Windows to IANA mappings.

Always provide both formats:

- Windows ID for `TimeZoneInfo.FindSystemTimeZoneById()` on Windows
- IANA ID for Linux, containers, `NodaTime`, and `TimeZoneConverter`

## Generate Code

Use `references/code-patterns.md` and pick the smallest pattern that fits:

- Pattern 1: `TimeZoneInfo` for Windows-only code
- Pattern 2: `TimeZoneConverter` for cross-platform conversion
- Pattern 3: `NodaTime` for strict timezone arithmetic and DST-sensitive scheduling
- Pattern 4: `DateTimeOffset` for APIs and data transfer
- Pattern 5: ASP.NET Core persistence and presentation
- Pattern 6: recurring jobs and schedulers
- Pattern 7: ambiguous and invalid DST timestamps

Always include package guidance when recommending third-party libraries.

## Warn About Common Pitfalls

Mention the relevant warning when applicable:

- `TimeZoneInfo.FindSystemTimeZoneById()` is platform-specific for timezone IDs.
- Avoid storing `DateTime.Now` in databases; store UTC instead.
- Treat `DateTimeKind.Unspecified` as a bug risk unless it is deliberate input.
- DST transitions can skip or repeat local times.
- Azure Windows and Azure Linux environments may expect different timezone ID formats.

## Response Shape

For address and location requests:

1. Return the resolved timezone block for each location.
2. State the recommended implementation in one sentence.
3. Include a copy-paste-ready C# snippet.

For code and architecture requests:

1. State the recommended approach in one sentence.
2. Provide the timezone IDs if relevant.
3. Include the minimal working code snippet.
4. Mention the package requirement if needed.
5. Add one pitfall warning if it matters.

Keep responses concise and code-first.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Breaking change reviewer](https://useaiblocks.com/skills/breaking-change-reviewer). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## References

- `references/timezone-index.md`: common Windows and IANA timezone mappings
- `references/code-patterns.md`: ready-to-use .NET timezone patterns
