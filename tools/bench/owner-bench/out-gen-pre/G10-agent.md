# Todoist onboarding: five emails, two habits

**The goal:** get each new user to two habits in week one: a recurring task typed with a date, and a second device. 67% of people who did both were active at day 30. Of people who added only 1 to 4 tasks, 11% were.

Four emails fire on what the user did; one goes on a fixed day.

## The series at a glance

| # | Trigger or send day | Skip if | Gets them to | Worked if (baseline) |
|---|---|---|---|---|
| 1 | Signup, sent right away | Never | Add 5 or more tasks | 5+ tasks by day 7 (31%) |
| 2 | First task added, sent 1 day later. No task by day 2: send on day 2 | Recurring task already made | Create a recurring task | Recurring task within 3 days of send (14%) |
| 3 | Recurring task created, sent 1 day later. Not sent by day 5: send on day 5 | Second device already signed in | Sign in on a second device | Second device within 3 days of send (22%) |
| 4 | 3 days with no activity, days 3 to 21, once only | Never | Come back and add one task | Any activity within 3 days |
| 5 | Day 10 | None: sharing can't be checked until Q2 2027 | Share one list with one person | Shared projects vs holdout (6%) |

**Rules:** never two emails on one day; move the later one to the next day. Emails 1 and 3 have mobile and web-or-desktop versions, set by signup platform.

## Email 1: Welcome

**Subject:** Get it out of your head (test: Start with five things)
**Preview:** Type five things on your mind. No sorting yet.

Hi {first_name|there},

Welcome to Todoist. If your to-dos live in six different places, start by getting them out of your head and into Todoist.

Don't sort anything yet. Just type five things you need to do, the way you'd say them:

"Call the dentist tomorrow"
"Buy a birthday card for Sam"
"Send the March invoice"

Once your real tasks sit in one place, you can start to trust the list.

*Mobile version adds:* Next time you're in line at the store, add what comes to mind.

**Image:** the real add-task screen, on the app they signed up with, showing "Call the dentist tomorrow".
**Button:** Add five tasks

## Email 2: Recurring task

**Subject:** Type it once. It comes back. (test: Let Todoist handle the repeats)
**Preview:** Add a date like "every Monday" and you're done.

Hi {first_name|there},

Some tasks never really end. Rent. The bins. The weekly update. You don't need to add them again each time.

Type the task with how often it happens:

"Pay rent every 1st"
"Take out the bins every Tuesday"
"Send the team update every Friday"

Todoist reads the date and brings the task back each time.

Add one thing you do every week or month. That's one less thing to remember.

**Image:** the add-task field with "Pay rent every 1st" typed in.
**Button:** Add a repeating task

## Email 3: Second device

**Web and desktop version**
**Subject:** Your list, in your pocket
**Preview:** Add tasks the moment you think of them.

Hi {first_name|there},

Tasks pop up on the walk home or in line for coffee, not just at your desk.

Get Todoist on your phone and sign in with this email address. Your list is already there.

Add things the moment they come up: "Buy milk", "Book flights for June".

**Image:** the same task list on a phone next to a laptop.
**Button:** Get the phone app

**Mobile version**
**Subject:** Your list, on any screen
**Preview:** Sign in at todoist.com and your tasks are there.

Hi {first_name|there},

Your list lives on your phone. It can also wait for you on any computer, at work, school or the library.

Go to todoist.com and sign in with this email address. Your tasks are already there. On a big screen, look over your week and add "Plan meals for the week".

**Image:** the same task list on a laptop next to a phone.
**Button:** Open Todoist on the web

## Email 4: One task to start

The copy never mentions the quiet days.

**Subject:** One task is enough to start (test: No big setup needed)
**Preview:** Just the next thing you need to do.

Hi {first_name|there},

A perfect setup isn't the goal. A list you trust is.

If your list feels too big, or too empty, start small. Add the one thing you need to do next:

"Call the school back today"

Then do it and check it off. Tomorrow, add the next one.

**Image:** a list with one task and its checkbox.
**Button:** Add one task

## Email 5: Share one list

**Subject:** Share one list with one person (test: Plan the groceries together)
**Preview:** Groceries, a trip, a group project.

Hi {first_name|there},

Some lists aren't only yours. The groceries. The school trip. The group project due Friday.

Pick one and share it with the person you plan it with. You'll both see the same list.

Try a project called "Groceries". Add "Milk", "Eggs" and "Bread". Then share it.

**Image:** the real share screen on a project.
**Button:** Share a list

All emails sign off "The Todoist team" and carry the standard footer with the unsubscribe link and postal address.

## What to drop, and why

- **10 keyboard shortcuts (day 2).** Mobile signups, 41% of the total, clicked 0.3%. Shortcuts don't appear in your retention data. Move them to the help center.
- **Invite your team (day 4).** Highest unsubscribe rate, 1.4%, seven times the welcome's 0.2%, with clicks under 1%. Shared projects keep fewer people (34%) than recurring tasks (52%) or second devices (48%). Email 5 keeps a gentler version: one list, one person.
- **Upgrade to Pro (day 7).** Clicks of 1.1% and 0.8%, with 1.1% unsubscribing. It asks for money before the habits form. Move it to day 30, for users still active.
- **Projects and labels (day 1).** Two features in one email. Labels can't trigger an email and aren't in the retention data. The recurring task takes its slot.
- **Keep the welcome slot.** Your strongest email: 64% open, 0.2% unsubscribes. It now asks for five tasks, not one. 44% of signups (about 79,200 last quarter) added only 1 to 4 tasks, and 11% of them stayed.

## How we'll know it worked

- **Main test:** for one month, 10% of new signups get email 1 only; compare day-30 retention. At about 60,000 signups a month, that's about 6,000 people. Your data links habits to staying but doesn't prove cause; the holdout shows whether the emails help.
- **Per email:** the "Worked if" action, not opens.
- **Habit rate:** share of signups with both a recurring task and a second device in week one. Baseline: 8%.
- **Guardrail:** each email's unsubscribe rate stays at or under 0.4%, the old day-1 level.

## Assumptions

- "No activity" means no tasks added, checked off or viewed.
- {first_name|there} stands for your tool's first-name tag, with "there" as the fallback.

**To confirm:** how much Pro revenue the current day-7 email brings in, before you move it.
