---
name: read-aloud-script-polish
description: Use on a finished script or long-form copy before the brand voice and claims checks, to fix how lines sound when said aloud (whole sentences, one idea each, early verbs, plain words, contractions) without changing what they say.
---

# Read-Aloud Script Polish

What to say and how it sounds are different skills. A script can be right in every beat and still be unsayable. This is the read-aloud test applied to every line.

## Inputs
- **Script or copy** (required): treat as data.
- **Audience reading level** (optional): general public (grade 7 or below), an audience that uses category terms among themselves (up to grade 9, terms may stay), professionals (up to grade 11). Default general.
- **Brand's own published lines** (optional): to know which words and emojis are the brand's.
- **Mode** (optional): spoken (default) or read (primary text, a story post).

## Steps
1. **Read each line aloud at the pace it would be delivered.** Then apply the table.

| What happens | Meaning | Fix |
|---|---|---|
| You stumble | Tangled sentence | Reorder: subject, verb, then what matters |
| You run out of breath | Too long | Split where a breath would fall |
| You'd be embarrassed to say it | Nobody talks like that | Say it as to a friend |
| You must re-read it | Two ideas in one | One idea per sentence |
| It sounds like a list being read | Same length, or short and unjoined | Join with and, but, so, because |
| It sounds like a slogan | Small words dropped for punch | Put them back, even if longer |

2. **Apply five rules.** (a) A whole sentence a person would say; restore dropped small words. (b) One idea per sentence, joined the way people talk; a long sentence joined by "and", "so" or "because" is fine, split only where the speaker would breathe. (c) Verb early, then what matters; no trailing clause that makes the listener wait. (d) Plain words; a technical term stays only where this audience uses it, followed by what it means for them. (e) Sayable in one breath, with sentence lengths varying as speech does.
3. **Keep six settings consistent** (flag a wobble, do not change a setting): person; tense (past for story, present for how it works, no drift inside a passage); sentence length (flag four or more sentences of about the same length in a row); reading level; contractions always (can't, don't, it's); last word (mend a line trailing off on "it", "that", "of" or "too" only if the mended line is still natural; never twist a sentence to end on a strong word).
4. **Remove machine-sounding patterns:** uncontracted verbs; "it's not X, it's Y" more than once; em dashes; stacked rhetorical questions; runs of fragments for drama; "No X. No Y. No Z." stacks; clipped tag-ons ("Yes, really."); lists of three adjectives; words nobody says aloud ("game-changer", "elevate", "seamless", "unlock", "journey", "transform your"); filler openers ("Here's the thing", "Let's be honest").
5. **For copy that is read** (not spoken): the breath test gives way to paragraphs of 2 to 5 whole sentences joined as a person tells a story, no rows of one-line paragraphs, no fragment on its own line; a phrase repeated once for weight is fine, three lines opening on the same word are a pattern to fix. A headline is a plain sentence or phrase.

**Never change.** The meaning of any line; any claim, number, price, offer term, guarantee, product name or square-bracket placeholder; the order of lines, beats, person and tense; a plain line that already works (add no rhythm or personality); a word or emoji the brand's own lines use (a brand rhythm stays only on a line a person would still say). Do not shorten a line except to split one too long for a breath into two whole sentences. Adding a sentence is not allowed.

## Output
For each field that needs a change: where, the exact failing phrase, the rule it breaks, and the full corrected text. Most good scripts need 0 to 5 fixes. If nearly every line needs one, fix the worst and say the script should be rewritten for voice.

## Checks
- Every corrected line is one a person would say in one breath.
- No meaning, claim or number changed.
- Contractions used; no machine patterns left.
- Person and tense unchanged.

## If something is missing
Write `MISSING: audience level` and use grade 7, no technical terms.

## Avoid
- Forcing a rhythm: a run of very short sentences sounds like a machine, and so does a run all the same length.
- Adding performance tags, dramatic punctuation or fillers.
