# Hook and hold support: hook-hold-sample-output.md

1. Read per-ad impressions, reach, actual link clicks, actual outbound clicks if available, spend, three-second video views, the selected later-view/ThruPlay field, video length and conversion/economic evidence for matched dates. Record each field's current definition, attribution, counting basis and unavailable state. A later-view count from a short video is not automatically comparable with a longer video's retention.

2. Calculate source hook rate as three-second view events divided by impressions; source hold rate as the chosen later-view events divided by three-second view events. Show numerators and denominators. Calculate LinkCTR only from link clicks and OutboundCTR only from outbound clicks. Missing fields or zero denominators are not calculable, never zero-filled or substituted.

3. If showing three-second views divided by reach, label it view-events per reached person. It is not the percentage of unique people who watched: repeated view events can make the ratio exceed100percent. A value200percent means two counted events per reached person on that input basis, not200percent of people. Validate incompatible counting windows or definitions rather than silently cap the number.

4. Declare the account-specific high/low opening and retention thresholds before placing ads in the two-by-two matrix. Source examples such as30percent hook and25percent hold are unvalidated starting heuristics, not universal standards. Near a threshold or under-observed data can remain uncertain; a forced binary label does not make the evidence reliable.

5. Interpret the quadrants as creative hypotheses: high opening/high retention suggests the attention sequence is working; high opening/low retention suggests inspecting promise-to-body continuity; low opening/high retention suggests testing a new opening while holding the body; low/low suggests reviewing concept, execution and data quality. Legacy names such asWinner orDeadWeight are attention shorthand, not economic verdicts.

6. Return specific creative tests, such as a new first frame or a clearer transition, grounded in the actual accessible media. Do not assert the exact second of a drop-off without time-series evidence. For static/carousel ads use compatible click/conversion evidence and note that hook/hold video metrics are not applicable. A click-to-sales mismatch has several possible causes; it does not by itself prove a landing-page or audience fault.

7. Budget increases, pauses or reallocation require separate actual conversion volume, tracking, contribution/payback targets, delivery context, uncertainty and owner risk limits. High attention does not establish profit and low attention does not automatically justify a pause. Do not prescribe20–30percent scaling from the quadrant. A CPM rise has multiple possible causes including auction competition, seasonality, targeting, placement and measurement; it does not prove saturation or a platform penalty.

8. Deliver a metric table with counting notes, quadrant or uncertainty, source evidence, creative hypotheses, ranked tests and review plan. Include evidence gaps and explicit checks not run. Qualitative material findings remain useful when dollar impact cannot be priced. Any campaign change stays a proposal unless currently authorized.

## Fictional worksheet

Impressions10000;three-second views3000;later-view events750;reach1500;link clicks100;outbound clicksunknown. Hook event ratio30percent;hold event ratio25percent;view-events per reached person200percent, not a unique-person percentage;linkCTR1percent;outboundCTRunknown. Quadrant placement requires the declared compatible threshold scheme. No profit or budget action follows without separate economic evidence.
