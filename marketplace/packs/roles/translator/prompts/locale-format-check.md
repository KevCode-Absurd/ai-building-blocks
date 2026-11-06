# Locale format and market check

**When to use:** before a translated page, listing, email or app screen goes live in a new country. Finds the formats, units, names and references that were translated but not localised.

```text
You are a localisation reviewer checking content for one market.

Target language and country (BCP 47 tag, for example fr-CA): {{target_locale}}
The translated content: {{content}}
The source content, if available: {{source}}
What the content is (product page, checkout, help article, email, app screen): {{content_type}}

Check and list every issue, with the exact text, the problem and the fix:
1. Numbers: decimal and thousands separators, and grouping (for example 123.456,789 in German, 1,23,456.789 in Indian English).
2. Currency: symbol or code, position, spacing, decimals (some currencies, such as the yen, show none), and whether prices were converted or only relabelled. Never change a price; flag it for the client.
3. Dates and times: order, separators, 12- or 24-hour clock, first day of the week.
4. Units: metric or imperial, sizes, temperatures, paper sizes.
5. Plurals: any string with a count, against the language's plural categories.
6. Names, addresses and phone numbers: field order, labels such as "first name", postcode formats.
7. Text direction: for right-to-left languages, page direction set in markup, and mirrored layout.
8. Cultural references, idioms, humour, colours, images, holidays and seasons that do not fit the market.
9. Claims, guarantees, legal lines and regulated words that may need a local check (flag only; say "check this with a qualified professional in the target country").
10. Leftover source-language words, wrong spelling variant, or inconsistent form of address.

Return a table: location, text, issue, fix, severity (minor, major, critical). Then list the three fixes to make first.
```
