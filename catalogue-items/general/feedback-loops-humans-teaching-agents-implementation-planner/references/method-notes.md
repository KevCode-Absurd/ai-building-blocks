

Emoji reactions and thread replies as structured feedback. Reactions map to feedback types (approve, reject, wrong-recommendation). Feedback generates correction and reinforcement lessons with 1.5x weight.Weekly Feedback Digest TemplateAuto-generated every Monday at 9 AM. Posted to #agent-ops.Shows:- What humans taught the agents during the prior week - What lessons were generated - Which patterns are emergingReplace {{variables}} at generation time. Keep tone factual. No marketing.Slack Message Structure:book: *Weekly Feedback Digest — {{week_of}}*

Totals:
- {{total_reactions}} reactions across {{total_agent_jobs}} agent messages
- {{approvals}} approvals, {{rejections}} rejections, {{arrows}} wrong-recommendation, {{already_known}} already-known
- {{lessons_generated}} new lessons written to agent_learnings
- {{lessons_promoted}} draft lessons promoted to validated
- {{lessons_archived}} lessons archived (contradicted or stale)

Top corrections this week:
{{top_corrections_block}}

Top reinforcements this week:
{{top_reinforcements_block}}

Agents by feedback volume:
{{agent_volume_table}}

Patterns worth discussing in pod:
{{pattern_block}}Block TemplatesTop Corrections Block (top_corrections_block)For the 3 most impactful correction lessons generated this week:1. [{{agent_id}}] {{lesson_text_truncated}}
   Based on {{instance_count}} instances. Approved by {{approver_user}}.
   Scope: {{scope}}. Current maturity: {{maturity}}.Rules:- Sort by instance_count descending - Truncate lesson_text at 180 charactersTop Reinforcements Block (top_reinforcements_block)Same format as corrections. Only include reinforcement lessons with accuracy over 85%.Agent Volume Table (agent_volume_table)| Agent | Approvals | Rejections | Arrows | Already Known | Net |
|-------|-----------|-----------|--------|---------------|-----|
| mia   | {{n}}     | {{n}}     | {{n}}  | {{n}}         | {{net}} |
| jordan| {{n}}     | {{n}}     | {{n}}  | {{n}}         | {{net}} |
| riley | {{n}}     | {{n}}     | {{n}}  | {{n}}         | {{net}} |Definition:- net = approvals - rejections - Negative net = needs attentionPattern Block (pattern_block)Include only when one of the following is true:- Two or more agents received similar feedback types in the same week - A lesson from last week was contradicted - Rejection rate increased ≥ 25% week-over-weekExample:• Mia and Sam both had rejections on "increase_budget" recommendations this
  week. Accuracy dropped to 58% combined (down from 74%). Likely driver:
  seasonal CPM increase across both platforms. Consider pausing budget-increase
  recommendations until baseline resets.

• Riley's "creative-fatigue" rejections spiked (7 rejections, up from 1).
  Most rejections cited retargeting campaigns with expected high frequency.
  Lesson queued: exclude retargeting audiences from fatigue detection until
  frequency is 25% above retargeting-specific baseline.Data SourcesReactions (last week)select
  f.feedback_type,
  f.agent_id,
  count(*) as n
from agent_feedback f
where f.created_at >= date_trunc('week', now()) - interval '7 days'
  and f.created_at < date_trunc('week', now())
group by 1, 2;Lessons Generatedselect
  l.agent_id,
  l.lesson_type,
  l.lesson_text,
  l.maturity,
  l.generated_by,
  l.created_at
from agent_learnings l
where l.created_at >= date_trunc('week', now()) - interval '7 days'
  and l.created_at < date_trunc('week', now())
order by l.created_at desc;Lessons Promotedselect id, agent_id, lesson_type, lesson_text
from agent_learnings
where maturity = 'validated'
  and updated_at >= date_trunc('week', now()) - interval '7 days'
  and updated_at < date_trunc('week', now());Tone and Formatting Rules- No em dashes - No marketing language - Use numbers and short statements - Lessons must be quoted verbatim, not summarized - Omit empty sections entirely - Keep under 3000 characters - Link to full report if neededGeneration Schedule- Trigger: Monday 9:00 AM (local time) - Owner: head-agent - Cron: 0 9 * * 1Fallback:- Retry at 9:15, 9:30, 9:45 - After 3 failures → open human-required issueFeedback TaxonomyFour reaction types. Each type triggers a different learning event and updates the agent's behavior in a different way. Use the right reaction and the agent learns faster. Use the wrong one and the lesson points in the wrong direction.1. Approve (checkmark emoji)Emoji: :white_check_mark: or :heavy_check_mark:Meaning: "This recommendation is correct. Good work."What it teaches the agent:- Reinforcement signal for the specific recommendation type - Confirms the current threshold or pattern is working - Adds weight to lessons that led to this recommendationWhen to use:- The agent correctly diagnosed a problem and proposed a sensible action - The agent's reasoning matches what a human strategist would have said - The recommendation would be safe to execute if the system were fully autonomousWhen NOT to use:- The recommendation is "fine" but generic. Silence is better. - You approved the action but not the reasoning. React with approval and then thread-reply with your actual reasoning.2. Reject (X emoji)Emoji: :x:Meaning: "This recommendation is wrong. Do not do this."What it teaches the agent:- Correction signal for the specific recommendation type - Reduces confidence in the triggering signals - Generates a correction lesson with 1.5x feedback weight - The lesson is never pruned by the token budgetWhen to use:- The agent's diagnosis is wrong (misread the data, missed context) - The recommendation would cause harm if executed - The pattern the agent detected is not actually a problemWhen NOT to use:- The diagnosis is right but the action is wrong (use arrows instead) - You personally disagree with the agent but a different human might approve. Write your reasoning as a thread reply.3. Wrong Recommendation (arrows emoji)Emoji: :arrows_counterclockwise:Meaning: "The analysis is right but the recommendation is wrong."What it teaches the agent:- Partial correction: keep the diagnosis, change the action - Does NOT reduce confidence in the monitoring signal - DOES reduce confidence in the action-mapping logicWhen to use:- The agent correctly identified high frequency, but recommended a pause when a replacement creative was already queued - The agent correctly identified low ROAS, but recommended scaling down when the real issue was attribution lag - The agent correctly identified stale copy, but recommended a full rewrite when minor edits would sufficeWhy this reaction exists separately from reject: Without it, any "wrong action, right diagnosis" case would cause the agent to raise its detection threshold. That makes the agent blind to real signals. The arrows reaction preserves the detection and only trains the action layer.4. Already Known (alarm clock emoji)Emoji: :alarm_clock:Meaning: "I already knew this. Not useful."What it teaches the agent:- The monitoring threshold is too sensitive, or - The recommendation cadence is too frequent, or - The insight is too generic to surfaceWhen to use:- The agent flagged something obvious (frequency at 4x for 2 weeks straight, already being managed) - The recommendation is a repeat of a recommendation from yesterday - The finding describes a known structural condition (client intentionally runs high frequency for retargeting)Effect on behavior:- Generates a threshold-adjustment lesson - May raise the fatigue threshold, add a cooldown, or scope the recommendation to new conditions only[Reference image: use the text procedure and supplied evidence.]Policy change vs data fixSome human corrections are not about the agent being wrong. They are policy changes or data fixes.- Policy change: "Don't recommend budget increases on Fridays." This is a rule imposed by humans. Use the :x: reaction and thread-reply the rule. The lesson enters the prompt as a hard constraint. - Data fix: "ROAS numbers are off because of a pixel bug." This is not an agent error. Correct the source data and mark the original finding as status = dismissed with reason data-error. Do not use a reaction; that would teach the agent to distrust the signal when the signal was fine.Feedback hygiene- React within 4 hours of the message. Later reactions still work but correlation is weaker. - One reaction per message. Stacking reactions sends conflicting signals. - Thread replies go under the original message, not as new top-level messages. - Silence is fine. Do not approve every message. Reserve approvals for notably correct calls.
