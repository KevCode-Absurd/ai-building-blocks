# Launch a support bot

**Trigger:** A business wants a customer-facing bot on its website chat, help desk, Instagram, Messenger or WhatsApp, or wants to replace a bot that misbehaves. Typical length: two to four weeks, mostly waiting for source approvals and test runs.

## Steps

1. **Intake and access (level 1).** Ask who the bot serves, where, what it must never do, where customers are (EU, UK, US states) and which tool it runs on. Ask which access level the client grants for each tool and record it in "Access I have". Until they answer, work from shared documents. No passwords in chat.
2. **Collect sources and messages.** Policies, help pages, price lists and 30 to 100 recent customer messages with personal details removed. Agree who decides when sources disagree.
3. **Scope and hand-over rules.** Use the `conversation-flow-and-handover` skill to sort messages into intents, choose what the bot answers and set hand-over triggers and receivers. *Approval: the owner signs off scope and hand-over rules.*
4. **Build the knowledge.** Use the `bot-knowledge-base-build` skill (or the `split-documents-into-knowledge-entries` prompt). *Approval: the owner settles every clash and approves each entry.*
5. **Write instructions and lines.** Use the `assistant-setup-pack` skill for the instructions block and the `ai-disclosure-and-handover-lines` prompt for greeting, disclosure, fallback and hand-over wording.
6. **Privacy and channel check.** Confirm vendor data use and retention settings, the processor agreement, the privacy notice wording, opt-in and opt-out on messaging channels, and that no card numbers or passwords are requested in chat. Flag anything for the client's adviser, for example whether the business counts as the AI Act "provider" of its bot. *Approval: the owner confirms settings and wording.*
7. **Build in test mode (level 2).** Set up the bot unpublished: knowledge as drafts, flows in draft, instructions in a private copy. Log each action.
8. **Test.** Run the `chatbot-test-and-review` skill: 20 to 40 cases including disclosure, hand-over, unsafe, data-request and (with written approval) injection cases. Fix and rerun until no critical failures remain.
9. **Go live (level 3).** Show the action list and limits (which channels, which audiences, which tools the bot may use, message volumes) and wait for a yes. Publish, switch on the channel, test the live hand-over route in and out of hours, and log each action. Without level 3, give the client a numbered launch checklist.
10. **First two weeks.** Review transcripts every few days with the `review-bot-transcripts` prompt. Pause the bot if a critical failure appears and the owner agreed that in advance; otherwise alert the owner immediately.

## Outputs

- Scope, intents and hand-over rules
- Approved knowledge base with owners and review dates
- Instructions block, greeting, disclosure and hand-over lines
- Flow map (Mermaid)
- Privacy and channel checklist with items for the client's adviser
- Test set and results, before and after fixes
- The bot in the client's tool (draft at level 2, live at level 3)
- Action log and a launch note: owner, hand-over route, review rhythm, how to pause the bot

## Needs the client's approval

The access level for each tool; scope and hand-over rules; every knowledge entry and clash; disclosure and privacy wording; vendor data settings; the test results before launch; the level 3 action list before the first live action; anything outside the limits, such as a new channel or audience, messaging people who have not opted in, giving the bot new actions, or deleting knowledge or transcripts.
