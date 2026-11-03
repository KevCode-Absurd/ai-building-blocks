# Base specialists in the user's AI

Choose a specialist, download its base pack, and discuss the task inside the user's AI. A task, business profile, account and website intake are not prerequisites for downloading. The existing contextual setup is optional.

The base pack contains README.md, START_HERE.md, SKILL.md, SETUP.md, SOUL.md, INTAKE.md, PLAYBOOK.md, SKILLS.md, BEST_PRACTICES.md, CONNECTIONS.md, PERMISSIONS.md, CONTEXT.md, TRAINING.md, CHECKS.md, HANDOFF.md, LAUNCH.txt and specialist.json. Complete associated source packages, their recursively required methods, references, templates, scripts and licences are included under skills/. sources.json and manifest.json record the pinned inventory and hashes. When published and archived instructions differ only in line endings, both exact versions are retained; the archive version is recorded under source-originals/.

The host reads the current conversation before asking what job needs doing, what the user wants back, and which relevant inputs, constraints or tools it can use. Ask only missing essentials. Do not turn the example into a task, require every skill's inputs or run every bundled method. Routine authorized work does not require another hiring ceremony. The active source and host rules still govern required review and external actions.

## MCP

`prepare_specialist({"role_id":"coding-specialist"})` returns AWAITING_TASK, the base setup files, pinned source retrieval information and a complete pack URL. It does not execute a task or store private inputs. The host retrieves the full relevant methods and supporting files before using them. A method manifest is not a completed read.

For task-led discovery, `find_specialist` suggests candidates. The host explains the proposed responsibilities and lets the user accept or change the selection. Task-specific `prepare_specialist` with task/context remains backward compatible. The local preview exposes direct discovery/base loading alongside optional scoping tools. Public MCP version 2.2.0 added this mode, and 3.0.0 keeps it; a host with cached tool schemas may need a connection refresh. It does not require an application-wide restart.

## REST

`GET /api/v1/specialists/coding-specialist/pack` returns the complete ZIP with Content-Disposition and X-Content-SHA256. No query context is accepted. `POST /api/v1/specialist-preparations` with role_id only returns the same base setup as MCP.

Every catalogue specialist gets a ZIP during `npm run index`, through `build-base-specialist-packs.mjs`. The build uses the shared bounded builder and fails if any pack is incomplete. Source hashes, every archived file, path and size limits, and operative local links are checked. Archives are deterministic. `/data/base-specialist-packs.json` binds each download's hash and size to the specialist and catalogue revisions. Browser and REST downloads verify that binding and the actual ZIP bytes. Production serves prebuilt files instead of compressing archives on each request. Pack checks do not certify job execution, semantic expertise or behavior across AI providers.

## Scope of this iteration

This implements the base-specialist delivery and host intake experience using the current catalogue role methods. It does not claim the specialist taxonomy or all domain methods have been redesigned. The media-buying method overhaul follows the owner's walkthrough. Hosted models, private file storage, paid provider calls, marketplace publishing and autonomous business actions are outside this local change.
