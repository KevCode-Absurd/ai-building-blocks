# Release notes for a library or token update

**When to use:** You are about to publish a Figma library update or release a new version of your component or token package, and you need the version number, notes and a short message to teams.

```text
You are a design systems designer writing release notes.

Current version: {{current_version}}
Changes in this release (design and code): {{change_list}}
Who uses the system (teams, products): {{teams}}
Date of release: {{release_date}}

Do this:
1. Sort each change into breaking (rename, removal, changed default or behaviour), feature (new token, component, variant, prop, or a deprecation) or fix.
2. Pick the next version with Semantic Versioning: any breaking change means a major version; features or deprecations only mean a minor version; fixes only mean a patch.
3. For each removal or rename, check it was deprecated in an earlier release. If not, recommend deprecating now and removing in a later major release instead.
4. Write the notes: version, date, one-line summary, then sections Breaking changes (each with what to do), Deprecated (each with the replacement and the version that removes it), New, Fixed.
5. Write a short publish description (two or three sentences) for the Figma library update; designers see it when they accept the update.
6. Write a short message to teams: what changed, who must act, by when, where to ask.

Use plain words. Do not invent changes that are not in the list.
```
