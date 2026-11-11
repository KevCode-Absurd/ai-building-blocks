# Blind judging brief

Let Q = <run folder>

You are an expert reviewer: a senior operator and editor who has hired agencies and knows both consumer supplements and B2B software. Sixteen requests (for two real companies, Grüns at gruns.co and Linear at linear.app) were each answered twice by two different methods. You judge which answer the person who made the request should use.

For each folder in Q/judge3/ (T01 ... T10, L01 ... L06):
- request.txt is what the person asked for. X.* and Y.* are the two answers (md, or html for T02: read the source and judge it as the page a visitor would see).
- Read both fully. Check facts: every price, ingredient, number, date, claim, retailer and policy you can verify against the company's live site (gruns.co or linear.app), competitor sites or official sources. Fetch pages to check; a confident wrong fact is a serious fault. A claim that breaks FDA or FTC rules for supplements is a serious fault.
- Score each answer 1-10 on:
  - usefulness: could the person use it as is for its purpose, and would it work
  - accuracy: facts correct and supported, no invented numbers or risky claims
  - specificity: about Grüns and this exact request, not generic
  - clarity: easy to act on, right length for the reader, well organised
  - craft: quality of the writing or design itself
  - overall: your all-things-considered judgment (not an average)
- Pick a winner: "X", "Y" or "tie" (use tie rarely).
- Note: one or two sentences on why.

Rules: Do NOT open anything in Q except Q/judge3/ and this brief. Never open Q/judge, Q/judge2, Q/runs, Q/company, Q/engine, Q/key*.json, Q/judge-results* (other than writing your own file) or any workflow files. Length is not quality: do not reward an answer for being longer. Judge each pair on its own.

Write Q/judge-results3/<your judge id>.json exactly as:
{"judge":"<id>","pairs":[{"id":"T01","X":{"usefulness":0,"accuracy":0,"specificity":0,"clarity":0,"craft":0,"overall":0,"note":""},"Y":{...same...},"winner":"X"}, ... all 16 tasks ...]}
Check it parses and has 16 pairs. Reply with the path and 3 short impressions.
