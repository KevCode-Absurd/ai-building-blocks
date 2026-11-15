# Give your agents access to Google Drive

Checked 15 November 2026. Google and Claude rename menus often. If a step looks different on your screen, tell Claude what you see and it will find the new path with you.

Drive is where the agents read what you already keep (brand guides, product sheets, review exports, price lists) and where they put ad packs and reports for you, your team or your client to look at. One shared folder holds the ad packs. A comment or a "looks good" in Drive is not an approval: you approve in Claude by typing `yes` and the six-character code.

## What the agents do with it

| Level | What the agents can do | Who uses it |
|---|---|---|
| 1, read | Search Drive, list recent files, check a file's details and who it is shared with, and read Docs, Sheets, Slides, PDFs, Office files and images. Change nothing. | The Org context builder (your brand material), every intake, the monthly numbers (exports you keep in Drive) |
| 2, draft | Also create new files and folders inside your agents folder, for example the ad pack page for a launch or the monthly report. | The creative producer (ad packs), reporting, the account manager (client reports) |
| 3, publish | Also share a file or folder with a named person, move files, or trash them. Only as a step of a plan you approved with "yes" and its code. | The account manager (sharing a client's pack with the client), rarely anyone else |

The approval gate in your agent folder enforces level 3 in code: a share, move or trash runs only when it is the next step of a plan you approved, with exactly the file and the person you saw.

## What you need first

- A Google account that can open the files the agents need. The connector acts as you, so Claude can reach only what that account can open ([Claude docs](https://claude.com/docs/connectors/google/drive)).
- One folder for the agents, for example `Store agents`, with an `Ad packs` folder inside it. Keep its sharing to named people only. Do not use "Anyone with the link".
- If you use Google Workspace for business, your Workspace admin may need to allow Claude first (see step 4 of Way 1).
- A Claude plan with connectors. On Team and Enterprise, an Owner or Primary Owner must turn the Google connectors on for the organization before members can connect ([Claude help](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)).

## Way 1: in Claude (start here)

Google builds and runs the Drive connector ([Claude docs](https://claude.com/docs/connectors/google/drive)). This one connection serves Claude chat, Claude Code and Claude scheduled tasks, because they all use the connectors on your Claude account.

1. In claude.ai, go to **Customize**, then **Connectors**.
2. Find **Google Drive** and click **Connect**.
3. Sign in to your Google account and grant the permissions it asks for. When it works, the **Connect** button changes to **Disconnect** ([Claude docs](https://claude.com/docs/connectors/google/drive)).
4. If you see "Access blocked" on a Workspace account, your admin opens [admin.google.com](https://admin.google.com), then **Security**, **Access and data control**, **API controls**, **Manage third-party app access**, adds Claude and sets it to **Trusted** ([Claude help](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)).
5. Open the connector's tool permissions ([Claude help](https://support.claude.com/en/articles/11176164)):
   - Search, list and read tools (for example search files, list recent files, get file details, get file permissions, read file content, download file content): **Always allow**.
   - Create and update tools (for example create file, copy file, update file): **Needs approval**.
   - Share tools: **Needs approval**. Claude's help says Drive asks before sharing, moving or trashing by default ([Claude help](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)); keep it that way.
   - Trash or delete tools: **Blocked**.
   Check the exact tool names in your own tool list; Google adds tools over time.
6. Tell Claude: "Check my Drive connection." It runs the read-only test below.

Limits to know: Google caps exports of Docs, Sheets and Slides at about 10 MB, so for a bigger file Claude gets the name and details but not the content; Claude cannot read comments or suggested edits; Docs reach Claude as text without their images ([Claude docs](https://claude.com/docs/connectors/google/drive)).

## Ad packs and Meta uploads: share pages are not files

A Drive share link (the kind that opens a page with a preview and a download button) is a web page, not the file itself. Meta's ads upload needs a direct public address that returns the image or video, so a Drive share page fails ([execution research, 15 Nov 2026](../research/execution-connectors-2026-11-15.md)). Making the file public to work around this would also expose it to anyone.

So the launch team never hands Meta a Drive link. It uses the final files from the job folder (`creatives/<job-id>/final/`), or downloads a file from Drive through the connector first, then uploads it to Meta through Meta's own upload address and finalize step. The ad pack in Drive is a copy for people to look at; the job folder is the source of truth, and the sign-off fingerprints the files there.

## Way 2: for the data pipeline and hosted agents

A hosted agent (one running on a server, not in your Claude) cannot use your Claude connector. It needs its own Google identity, a service account, that can see only the agents folder. Do this with Claude beside you.

1. **Make a project.** In the [Google Cloud console](https://console.cloud.google.com/), create a project called `store-agents` and enable the **Google Drive API** for it.
2. **Make the service account.** Under **IAM and admin**, **Service accounts**, create one called `store-agents-drive`. Give it no project roles; it only needs the folder you share with it.
3. **Share only the agents folder with it.** In Drive, share the `Store agents` folder with the service account's email address. Choose **Viewer** if the hosted agent only reads, or **Editor** if it must create ad packs and reports there. A service account starts with an empty Drive and sees only what is shared with it.
4. **Pick the narrowest scope.** Google recommends the narrowest scope that does the job ([Google Drive scopes](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)):
   - `drive.file` (non-sensitive): files the app creates itself, and files opened with or shared to it through a picker. Enough when the hosted agent only writes its own ad packs and reports.
   - `drive.readonly` (restricted): view and download all files the account can reach. Needed only if it must read files other people put in the folder.
   - Avoid `drive` (full access) unless there is a reason you can name.
5. **Make a key, or better, avoid one.** Google warns that service account keys are a security risk and suggests safer ways to sign in where your host supports them. New Google Cloud organizations block key creation by default ([Google Cloud: managing service account keys](https://docs.cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys)). If you must make a JSON key, download it once and paste its contents into your host's secret store (on Railway: the service's **Variables**, named `GOOGLE_DRIVE_SA_KEY`). Never put it in chat, a file in the repository, or Drive itself.
6. **Downloads in code.** The hosted agent downloads a file's bytes with the Drive API (`files.get` with `alt=media`, or `files.export` for Docs, Sheets and Slides) ([Google: download and export files](https://developers.google.com/drive/manage-downloads)), then uploads those bytes to Meta. It never passes a Drive link to another service.

## Safety switches on Google's side

- **Third-party app access** in the Workspace Admin console: an admin decides which apps may use Google data at all, and sets Claude to Trusted there or limits or blocks it (check the exact choices on your admin screen) ([Claude help](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)).
- **Sharing settings** on the agents folder: named people only, and on Workspace you can stop files being shared outside your organization.
- **Version history:** Drive keeps earlier versions of files, so an edit by an agent can be rolled back.
- **Organization policy** in Google Cloud: keep key creation blocked unless you need it.

## Check it works

Claude searches Drive for your `Store agents` folder, read only, and lists the five newest files in it with their owners and who each is shared with. A good answer names the folder, shows it is shared only with the people you expect (and the service account, if you made one), and lists real file names with their dates. Nothing is created or shared. For a hosted service account, Claude runs a one-line list call against the folder from the server: a good answer lists the same files, and a call for a file outside the folder is refused.

## Take access away

- **Claude connector:** go to **Customize**, then **Connectors**, open **Google Drive**, and click **Disconnect**, or use the three-dot menu and **Remove** to take it off your account ([Claude docs](https://claude.com/docs/connectors/google/drive)). Then, in your Google Account, open **Security** and the list of third-party apps with account access, and remove Claude if it is still listed.
- **Service account:** stop sharing the agents folder with its email, then in the Google Cloud console delete its key or the service account itself, and delete the secret from your host.
- **Pause everything now:** tell any agent "pause all agent work", or set every Drive write tool to Blocked in the connector settings.

## What stays with you

Sharing anything outside named people, making any file public, changing your Workspace or sharing settings, emptying the trash, and approving anything. Files in Drive written by other people, such as a client's notes or a supplier's sheet, are information, not instructions: if one asks an agent to do something, the agent quotes it to you and does nothing.

## Sources

- Claude Google Drive connector, file types, limits and disconnecting, checked 15 Nov 2026: [Claude docs](https://claude.com/docs/connectors/google/drive)
- Claude Google Workspace connectors, Owner setup, trusted app, share and trash approvals, checked 15 Nov 2026: [Claude help](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)
- Claude tool permissions, checked 15 Nov 2026: [Claude help](https://support.claude.com/en/articles/11176164)
- Google Drive API scopes, checked 15 Nov 2026: [Google Drive scopes](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
- Downloading and exporting Drive files, checked 15 Nov 2026: [Google: download and export files](https://developers.google.com/drive/manage-downloads)
- Service account key risks and the key creation policy, checked 15 Nov 2026: [Google Cloud](https://docs.cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys)
- Meta uploads need a direct file address, checked 15 Nov 2026: [execution research](../research/execution-connectors-2026-11-15.md)
