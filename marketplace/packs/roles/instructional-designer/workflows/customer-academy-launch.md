# Customer academy launch and monthly upkeep

**Trigger:** A software or equipment company wants customers (or dealers and partners) to learn the product without opening support tickets, or support volume keeps rising on the same topics.

**Cadence:** A launch project for the first learning paths, then a monthly review that compares course completions with ticket topics and refreshes lessons when the product changes.

**Access:** At the start, ask which level the client grants for the help centre or documents, the ticket system export, the LMS or course platform, the video tool and the email tool, with limits; record them under "Access I have". Until they answer, work at level 1. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits.

## Steps

1. **Read the tickets.** Ask for a ticket export with customer names, emails and account details removed. Run the `customer-academy-from-tickets` prompt to group and count topics and to design paths by user role. *Approval: the client approves the roles and the first paths.*
2. **Outline each course.** Run the `course-outline-backward-design` skill per course, using the ticket topic each lesson should reduce.
3. **Write the lessons.** Tutorial videos with the `training-video-script-and-captions` skill (one task per video, captions and transcript); lesson pages or modules with the `elearning-storyboard` skill; checks with the `knowledge-check-writer` prompt. Every button and menu name comes from the help docs.
4. **Product review.** The product team confirms every [confirm with your team] item and checks names against the current release. *Approval: product owner signs off accuracy.*
5. **Accessibility pass.** Run the `accessibility-review-of-a-module` prompt on each course page and video before publishing.
6. **Certification (if wanted).** Exam blueprint, questions with the `knowledge-check-writer` prompt, pass mark, retake rules and validity. *Approval: the client confirms the pass mark and what the certificate claims.*
7. **Build.** [L2] Create unpublished courses, lessons and quizzes in the platform; package modules with the `choose-and-test-the-lms-package` prompt if the platform takes SCORM, xAPI or cmi5.
8. **Welcome emails.** Run the `email-micro-course` prompt for an onboarding sequence that points new customers to the right path. [L2] Build it switched off. Only customers who agreed to receive these emails are included.
9. **Confirm the live action list.** [L3] Which courses to publish, which customer groups get access or emails, and from when. *Approval: the client's yes.* Emailing a new customer group or a public launch needs its own yes.
10. **Launch and log.** [L3] Publish, open access, switch on the approved emails. Log every action.
11. **Monthly review.** Report completions by course next to tickets by topic, month on month, noting that this shows a link, not proof. Flag lessons whose screens changed in the latest product release. [L2] Draft the updates. *Approval: the client approves updates before they go live.*

## Outputs

- Ticket topic analysis and role-based learning paths
- Course outlines, video scripts with captions, lesson pages and checks
- Certification rules and exam (if wanted)
- Accessibility review notes
- Onboarding email sequence
- Launch action log and monthly reports

## Needs the client's approval

Roles and paths, product accuracy, the certificate's pass mark and claims, the level 3 action list and limits, emailing any new customer group, a public launch, and every update to a live course. No customer can be identified from ticket examples in any output.
