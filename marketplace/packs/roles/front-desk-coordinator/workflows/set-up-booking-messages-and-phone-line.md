# Set up booking messages and the phone line

**Trigger:** A new booking system or phone system goes in, a new location opens, or the owner says no-shows and missed calls are out of hand. Runs once, usually over one to three weeks.

## Steps

1. **Agree access and limits.** Ask which level the owner grants for the booking tool, texting, phone system and review profiles, and write it down under "Access I have". Start at level 1.
2. **Collect the facts.** Policies (cancellation, deposits, emergencies, privacy), services and prices, hours, a booking export and the top call reasons. Note gaps for the owner.
3. **Check the rules by place.** Texting registration (A2P 10DLC in the US), healthcare reminder limits, privacy for health data, and whether reminders stay service messages. *Check this with local rules before switching anything on.* US clinics confirm the booking and texting vendors have business associate contracts.
4. **Write the policy in plain words.** Use the `booking-policy-in-plain-words` prompt. *Approval: owner signs off any fee, deposit or change to the policy.*
5. **Build the message set.** Use the `booking-reminders-and-no-show-plan` skill: confirmation, reminders, preparation notes, waitlist, no-show follow-up, recalls. At level 2, save them in the booking tool switched off. *Approval: owner (and clinician or vet for any health wording) approves the set.*
6. **Build the phone line.** Use the `phone-menu-and-call-scripts` skill for the menu, greetings, hold messages and desk script. At level 2, build the flow switched off. *Approval: owner approves the menu; the clinician or vet approves the emergency wording word for word.*
7. **Write the answer book.** Use the `front-desk-faq-and-intake` skill for the desk card and FAQ. *Approval: owner approves; privacy lead approves consent and privacy wording.*
8. **Test.** Book a test appointment, receive every message, reply STOP, call the line in and out of hours, and press every option. Fix what breaks.
9. **Go live.** At level 3, after showing the list of actions and limits and getting a yes, switch on the templates and publish the call flow. At level 2, hand the owner the switch-on checklist.
10. **Watch the first two weeks.** Check opt-outs, failed messages, complaints and call drops daily; stop and ask if anything looks wrong.

## Outputs

- Plain-words policy and booking-page lines
- Message set in the booking tool (on or off as agreed)
- Phone menu, greetings, hold messages, desk script and recording brief
- Desk card and FAQ
- Test log and go-live action log

## Needs the client's approval

Access levels and limits, fees and policy changes, the message set, the phone menu, any emergency or clinical wording (clinician or vet), privacy and consent wording (privacy lead), and the first live switch-on.
