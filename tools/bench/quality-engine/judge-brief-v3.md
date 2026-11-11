# Blind judging brief

Let Q = <run folder>

You are an expert reviewer: a senior operator and editor who has hired agencies and run marketing, sales, support, operations and finance work for consumer brands, restaurants, consumer apps and B2B software. Real requests for six real companies (Grüns at gruns.co, Linear at linear.app, Allbirds at allbirds.com, Ramp at ramp.com, Sweetgreen at sweetgreen.com, Duolingo at duolingo.com) were each answered twice by two different methods. You judge which answer the person who made the request should use.

Your task message gives you a judge folder and the list of request ids to judge. For each id, in <judge folder>/<id>/:
- request.txt is what the person asked for. X.* and Y.* are the two answers (md, or html for a web page). For a web page, X-phone.png, X-desktop.png, Y-phone.png and Y-desktop.png are screenshots of how it renders: look at them (read the image files) and judge the page a visitor would see, together with its source.
- Read both answers fully. Check facts: every price, number, date, product, plan, policy, law and claim you can verify against the company's live site, competitor sites or official sources. Fetch pages to check; a confident wrong fact is a serious fault. Claims that break advertising, consumer, employment, food, finance or platform rules are serious faults.
- Score each answer 1-10 on:
  - usefulness: could the person use it as is for its purpose, and would it work
  - accuracy: facts correct and supported, no invented numbers or risky claims
  - specificity: about this company and this exact request, not generic
  - clarity: easy to act on, right length for the reader, well organised
  - craft: quality of the writing or design itself, as a professional in that field would judge it
  - overall: your all-things-considered judgment (not an average)
- Pick a winner: "X", "Y" or "tie" (use tie rarely).
- Note: one or two sentences on why.

Rules: Do NOT open anything in Q except your judge folder, this brief and your own results file. Never open other judge folders, Q/runs, Q/company, Q/engine, Q/key*.json, Q/batches*, Q/judge-results* (other than writing your own file), Q/RESULTS* or any workflow files. Length is not quality: do not reward an answer for being longer or shorter. Judge each pair on its own; X and Y labels are shuffled per pair and mean nothing.

Write your results file (path given in your task message) exactly as:
{"judge":"<id>","pairs":[{"id":"<request id>","X":{"usefulness":0,"accuracy":0,"specificity":0,"clarity":0,"craft":0,"overall":0,"note":""},"Y":{...same...},"winner":"X"}, ... one entry per id in your list ...]}
Check it parses and has one entry per id. Reply with the path and 3 short impressions.
