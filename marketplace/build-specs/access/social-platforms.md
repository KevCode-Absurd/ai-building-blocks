# Give your agents access to Instagram, Facebook, TikTok and Pinterest

This page covers organic posts and community replies. It does not cover ads. Three agents use it:

- **tomas-social-community** runs organic social on Instagram, Facebook, Pinterest and TikTok. He also drafts replies to comments and messages.
- **ploy-tiktok-shop** makes TikTok Shop content.
- **pilar-creators** handles creator content.

Facts below were checked on 15 November 2026. Platforms change their rules often. If a menu name or limit looks different in your app, trust the app and tell us.

## What the agents do with it

There are three access levels. You pick the level. You can change it at any time.

| Level | What the agent can do | What it never does |
|---|---|---|
| 1 Read | Reads posts, insights, comments and messages. Writes a report. | Posts, replies, hides or deletes anything. |
| 2 Draft | Everything in level 1. Also saves posts as drafts, or as unscheduled posts in a scheduler. Drafts replies for you to send. | Schedules or publishes. Sends a reply. |
| 3 Publish | Everything in level 2. Also schedules or posts the exact posts you approved. This only happens through a plan you approve with "yes <code>". | Changes an approved post. Posts anything not in the plan. Sends community replies. |

Three rules hold at every level:

- **Community replies are drafted, never auto-sent.** You or your team send them.
- **Scheduled runs read and draft only.** A run that starts on a timer never schedules or posts, even at level 3.
- **No official route means you click.** Where a platform has no official way for an agent to act, the agent prepares everything (file, caption, tags, time) and you post it.

What each level looks like on each platform:

| Platform | Level 1 Read | Level 2 Draft | Level 3 Publish |
|---|---|---|---|
| Instagram | Posts, insights, comments, messages | Draft held in the plan or in a scheduler such as Buffer. Meta's API has no draft save. | Feed posts, carousels, reels and stories through the API, or a scheduler |
| Facebook Page | Posts, Page insights, comments | Draft held in the plan or in a scheduler | Posts now, or scheduled 10 minutes to 30 days ahead |
| TikTok | Profile, stats, video list. Comments only through TikTok's business API. | Sends the video to your TikTok inbox. You finish and post it in the app. | Direct post through an audited app. Before audit, posts can only be private. |
| Pinterest | Pins, boards, analytics | Draft held in the plan or in a scheduler | Creates Pins. Public Pins need Standard access. |

## What you need first

- **Instagram:** a professional account (business or creator). Meta's API only works with professional accounts. For the Facebook Login route, the Instagram account must also be linked to a Facebook Page.
- **Facebook Page:** a Page you manage. For a token you also need a Meta business portfolio (the new name for Business Manager) with the Page in it.
- **Meta business portfolio role:** the person who sets this up needs full control of the portfolio. Only people with full control can add system users or share assets with a partner.
- **TikTok:** a TikTok business account. For TikTok Shop content you also need a TikTok Shop seller account.
- **Pinterest:** a Pinterest business account. Pinterest says scheduling Pins in its app is for business accounts. Its developer docs also say new apps may be blocked from data of non-business users.
- **Your brand files in AI Blocks:** your Org context, your approved post plan and your media files. The agents use these to write posts that sound like you.

## Way 1, in Claude: the official connector, click by click

**The short answer: Meta, TikTok and Pinterest do not offer an official organic posting connector for Claude.** We searched the Claude connectors directory and each platform's developer docs on 15 November 2026. We found no Instagram, Facebook, TikTok or Pinterest connector built by the platform itself.

Meta does have an official ads connector, the Meta Ads MCP server at `https://mcp.facebook.com/ads`. It is for ads, not organic posts. Two of its tools touch Instagram:

- `ads_get_ig_media` lists Instagram posts, reels and stories that can be promoted. It is read only. It works only for an Instagram account linked to your ad account.
- `ads_boost_ig_post` turns an existing post into a paid ad. That is spending money, so it belongs to the ads agent, not to these three agents. Set it to **Blocked** for social work.

There is no tool in that server to publish an organic post.

So the best official route in Claude is a scheduler with its own official connector. Buffer is the clearest one we could confirm.

### Buffer, the scheduler route (Instagram, Facebook, TikTok, Pinterest)

Buffer runs an official MCP server at `https://mcp.buffer.com/mcp`. Its docs say `create_post` works with Instagram, Facebook, TikTok and Pinterest, among others. It can save a post as a draft (`saveToDraft`) or schedule it. Buffer says MCP access is on every Buffer plan, including Free. Buffer says it is listed as a Community connector in Claude's directory.

**Add it from the directory:**

1. In Claude, open **Customize**, then **Connectors**.
2. Search for **Buffer** and select it.
3. Click **Connect**. Sign in to Buffer and approve access.

**Or add it as a custom connector** (if you do not see it in the directory):

1. Go to **Customize > Connectors**.
2. Click **Add**. Hover over **Custom**, then select **Web**.
3. Enter the name `Buffer`.
4. Paste `https://mcp.buffer.com/mcp` and click **Continue**.
5. Check the sign-in settings and click **Continue**.
6. Click **Add**, then sign in to Buffer and approve access.

Who can add custom connectors:

- **Free:** one custom connector only.
- **Pro and Max:** you add your own.
- **Team:** only Owners and Primary Owners can add them, under **Organization settings > Connectors**.
- **Enterprise:** Owners, Primary Owners, and people with a custom role that includes managing Libraries.

**Set each tool's permission.** Go to **Customize > Connectors**, select Buffer, and open **Tool permissions**. Each tool can be **Always allow**, **Needs approval** or **Blocked**. On Team and Enterprise, Owners set these for the whole organization.

| Buffer tool | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| `get_account`, `list_channels`, `get_channel`, `list_posts`, `get_post`, `get_aggregated_post_metrics`, `list_ideas`, `list_idea_groups`, `list_post_templates`, `get_post_template` | Always allow | Always allow | Always allow |
| `create_idea` | Blocked | Needs approval | Needs approval |
| `create_post` | Blocked | Needs approval. Drafts only, with `saveToDraft` on. | Needs approval. Only for posts in the plan you approved with "yes <code>". |
| `edit_post` | Blocked | Needs approval | Needs approval |
| `create_post_template`, `update_post_template` | Blocked | Needs approval | Needs approval |
| `delete_post`, `delete_post_template` | Blocked | Blocked | Blocked |

Why these settings:

- `create_post` can also post right away (`shareNow`). Approval stops that from slipping through.
- `edit_post` can change a post's time, so it can schedule. Treat it like `create_post`.
- Buffer says deleting a post is permanent. Keep delete tools blocked.
- Buffer's connection covers your whole Buffer account. It cannot be limited to one organization.
- Buffer's tool list has no tools for comments or messages. Replies stay in each platform's own inbox.

### Per platform, in Claude

| Platform | Official connector from the platform | Best official route in Claude | If you skip the scheduler |
|---|---|---|---|
| Instagram | None for organic posts. Meta Ads MCP is ads only. | Buffer, as above | The agent works from your exports and screenshots. You post in the Instagram app or the Meta Business Suite planner. |
| Facebook Page | None for organic posts | Buffer, as above | Same. You post or schedule in Meta Business Suite. |
| TikTok | None | Buffer, as above | Same. You post in the TikTok app. |
| Pinterest | None | Buffer, as above | Same. You post in Pinterest, which lets business accounts schedule Pins up to 30 days ahead. |

Third-party connectors also exist in the directory. For example, the Claude directory lists Windsor.ai for social media, which says it can analyze and post organic content on Instagram, Facebook and TikTok. These are not built by the platforms. If you use one, open its tool list and apply the same Always allow, Needs approval and Blocked rules.

## Way 2, for hosted agents

Use this when the agents run on a server, not inside Claude. You make your own app on each platform and give it a token.

**Store every token in your host's secret store.** Never put a token in a file, a code repo, a chat or an email.

**One honest warning.** Platform permissions are coarse. For example, Meta's comment permission covers reading and replying. So the platform cannot keep an agent to "read only". AI Blocks enforces the level: drafts stay drafts, replies are never sent, and level 3 posts only run after "yes <code>". Grant the smallest set of permissions for the level you chose.

### Meta app for Instagram and Facebook Pages

**Make the token.**

- **System user (best for a business):** in your business portfolio, open **Settings**, then **Users**, then **System users**. Create a system user. Assign it only your Page and Instagram account. Generate a token for your app with the permissions below. Meta shows the token once, so save it straight into your secret store.
- **User token:** a person with the right Page tasks signs in with Facebook Login for Business or Business Login for Instagram.

**Access level.** Standard Access is the default and works for accounts you own or manage that are added to your app. Advanced Access is only needed if the app serves accounts you do not own. That needs App Review and Business Verification.

**Instagram, with Instagram Login** (no Facebook Page needed):

| Level | Permissions |
|---|---|
| 1 Read | `instagram_business_basic`, `instagram_business_manage_insights`, `instagram_business_manage_comments` (needed to read comments), `instagram_business_manage_messages` (only if the agent should read messages) |
| 2 Draft | Same as level 1. Meta's API has no draft save, so drafts live in the plan or in a scheduler. |
| 3 Publish | Level 1 plus `instagram_business_content_publish` |

**Instagram, with Facebook Login** (Instagram linked to a Page):

| Level | Permissions |
|---|---|
| 1 Read | `instagram_basic`, `instagram_manage_insights`, `instagram_manage_comments`, `pages_show_list`, `pages_read_engagement`, `instagram_manage_messages` (only if the agent should read messages) |
| 2 Draft | Same as level 1 |
| 3 Publish | Level 1 plus `instagram_content_publish` |

If the token's user got their Page role through the business portfolio, Meta also asks for `ads_management` and `ads_read` on these calls.

**How Instagram publishing works:** the app makes a media container (`POST /<IG_ID>/media`), then publishes it (`POST /<IG_ID>/media_publish`). Facts from Meta's guide:

- Supported: single images (JPEG only), videos, reels, stories and carousels of up to 20 items.
- Not supported: shopping tags and filters.
- Limit: Meta's guide says 100 API-published posts in a moving 24 hours. One section of the same guide still says 50. Check `/<IG_ID>/content_publishing_limit` before each run.
- No schedule field. The API posts now. Scheduling comes from your scheduler or Meta Business Suite. A scheduled agent run cannot post, because scheduled runs read and draft only.
- An `is_ai_generated` field marks a post as AI-made.

**Facebook Page:**

| Level | Permissions |
|---|---|
| 1 Read | `pages_show_list`, `pages_read_engagement`, `pages_read_user_engagement`, `read_insights` |
| 2 Draft | Same as level 1 |
| 3 Publish | Level 1 plus `pages_manage_posts` and `pages_manage_engagement`. Add `publish_video` only for video posts. |

Facts from Meta's Pages API docs:

- Posts go to `POST /page_id/feed`. Photos go to `POST /page_id/photos`.
- To schedule, send `published=false` with `scheduled_publish_time`. The time must be 10 minutes to 30 days from the request.
- The token's user must be able to do the `CREATE_CONTENT`, `MANAGE` and `MODERATE` tasks on the Page.
- Meta lists `pages_manage_engagement` as needed to publish. That permission can also reply to comments. The agent still never sends replies.
- `read_insights` needs App Review. Page insights only show for Pages with 100 or more likes.

### TikTok developer app

Make an app at TikTok for Developers and add the Content Posting API and Login Kit.

| Level | Scopes |
|---|---|
| 1 Read | `user.info.basic`, `user.info.stats`, `video.list` |
| 2 Draft | Level 1 plus `video.upload` (sends the video to your TikTok inbox as a draft) |
| 3 Publish | Level 2 plus `video.publish` (direct post) |

**The audit note.** Until TikTok audits your app, every post it makes is private (`SELF_ONLY`). An unaudited app can also only let up to 5 users post in 24 hours. To post publicly, your app must pass TikTok's audit.

Other TikTok limits from its docs:

- Before each post, the app must call the creator info query. The privacy level must be one it returns. If it says the creator cannot post right now, the app must stop.
- Direct post: 6 requests per minute per user token. Creator info: 20 per minute.
- Inbox drafts: at most 5 pending drafts in any 24 hours. You open the inbox notice in TikTok to finish and post.
- Direct post has fields for disclosure: `brand_organic_toggle` (promotes your own business), `brand_content_toggle` (paid partnership) and `is_aigc` (AI-generated label).

**Comments on TikTok.** The Content Posting API has no comment tools. TikTok's separate API for Business has comment tools for owned accounts. TikTok lists two permission groups under TikTok Accounts, Account Comment: "Get Business Comment" (read) and "Manage Account Comment" (reply, hide, delete). Grant only "Get Business Comment". Check the exact names in your TikTok for Business developer app.

**TikTok Shop is separate.** Shop data and listings use the TikTok Shop Partner Center and seller authorization. A seller token and a creator token are different, and you cannot swap them. The Content Posting API does not cover Shop.

### Pinterest app

Make an app at Pinterest Developers. New apps start on Trial access.

| Level | Scopes |
|---|---|
| 1 Read | `boards:read`, `pins:read`, plus the account read scope for analytics (check the exact name in Pinterest's scope list) |
| 2 Draft | Same as level 1. The API has no draft save, so drafts live in the plan or a scheduler. |
| 3 Publish | Level 1 plus `pins:write`. Add `boards:write` only if the agent should make boards. |

Facts from Pinterest's docs:

- **Trial access:** Pins and boards made on Trial are only visible to you, as Sandbox items. Trial is capped at 1,000 calls a day.
- **Standard access:** needed for public Pins. To upgrade, open **My apps**, then **Upgrade** on the app card. You send a video of your app that shows the sign-in flow.
- **No schedule field:** the create Pin call has no publish date. Scheduling comes from your scheduler or Pinterest's own scheduler. A scheduled agent run cannot post, because scheduled runs read and draft only.

## Safety switches on the platform's side

These work even if something goes wrong on our side.

- **Meta task access.** Give the person or system user who makes the token only the tasks they need. Page tasks are Content, Messages and community activity, Ads, and Insights. For level 1, Insights plus Messages and community activity is enough. Do not give Ads to social agents.
- **Meta partners.** If an agency or tool works for you, add it as a partner in your business portfolio (**Settings**, **Users**, **Partners**). Share only the Page and Instagram account, with the lowest access that works.
- **System users.** Assign a system user only the assets it needs. One token per system user.
- **Instagram Hidden Words.** In the Instagram app, open **Settings**, then **Hidden Words**. "Hide unwanted comments" is on by default. Add your own words under "Manage custom words and phrases". Meta says the same filters apply to ads run from the profile.
- **Instagram comment controls.** Under **Settings**, then **Comments**, you can limit who can comment. Check the current name in the app.
- **TikTok private-only until audit.** An unaudited app can only post private videos. Keep it that way while you test.
- **TikTok inbox drafts.** Level 2 sends videos to your inbox. Nothing goes public until you post it in the app.
- **TikTok comment filters.** TikTok has comment filter settings in the app. Check the current name in the app.
- **Pinterest Trial access.** Pins made on Trial are only visible to you. Test on Trial before you ask for Standard.
- **Claude tool permissions.** Set write tools to **Needs approval** and delete tools to **Blocked**, as in the Buffer table above.

## Check it works

Run one read-only test per platform. Nothing should be posted, scheduled, replied to or deleted.

| Platform | Test | A good answer |
|---|---|---|
| Instagram | "Read my last 5 posts with their reach, likes, comments and saves." (Media list, then `/<MEDIA_ID>/insights`.) | 5 posts, newest first, each with date, type (image, carousel, reel), caption start, link and numbers. The numbers match the Instagram app within a day. |
| Facebook Page | "Read my Page's last 5 posts and their reactions, comments and shares." | 5 posts with date, text start, link and numbers. If the Page has under 100 likes, the agent says Page insights are not available. |
| TikTok | "List my last 5 videos with views, likes and comments." (Uses `video.list`.) | 5 videos with date, caption start, link and counts. If comments were not granted, the agent says so instead of guessing. |
| Pinterest | "List my last 5 Pins with impressions, saves and outbound clicks." | 5 Pins with board, title, link and numbers. On Trial access the agent says which Pins are Sandbox only. |
| Buffer | "List my scheduled posts for this week and my connected channels." (`list_channels`, `list_posts`.) | Your channels by name and network, and each queued post with time and status. |

In every good answer, the agent also tells you:

- Which account it read.
- The date range it used.
- Anything it could not read, and why. For example, a missing permission.

## Take access away

You can do any of these at any time. Do the platform step and the Claude or host step.

- **Meta, a connected app:** on Facebook, click your profile picture, then **Settings & privacy**, then **Settings**. Click **Business Integrations**. Select the app, click **Remove**, then **Remove** again.
- **Meta, a partner:** in your business portfolio, open **Settings**, **Users**, **Partners**. Select the partner and choose **Remove**. This also removes their access to your assets.
- **Meta, a system user:** in your business portfolio, open **Settings**, **Users**, **System users**. Remove the system user, or remove its assets. Check the current button name in Business Suite.
- **Meta, one person on a Page:** in business settings, open **Accounts**, then **Pages**. Select the Page, find the person and remove them.
- **Instagram, an app signed in with Instagram Login:** remove it in the Instagram app's settings for connected apps. Check the current name in the app.
- **TikTok:** tap **Profile**, then the 3-line menu. Open **Security and login**, then **Manage app permissions**. Select the app and tap **Remove access**. Menu names can differ by app version.
- **Pinterest:** open **Settings**, then **Security**, and review the apps connected to your account. Remove the app. Check the current name in the app.
- **Buffer:** Buffer says you can revoke access in its settings, under **API** or **Integrations**. Check the current name in Buffer.
- **Claude:** go to **Customize > Connectors**. Find the connector and click **Remove**, or use the three dots next to it. On Team or Enterprise, Owners remove it under **Organization settings > Connectors**.
- **Hosted agents:** delete the token from your host's secret store, then revoke it on the platform as above.

## What stays manual, and why

| Platform | Stays manual | Why |
|---|---|---|
| All | Sending replies to comments and messages | Our rule. Replies are drafted, never auto-sent. |
| All | Replies to complaints, refunds, safety or legal issues | These need a person. The agent drafts and flags them. |
| All | Anything without an approved app or a connected scheduler | No official route. The agent prepares the post. You post it. |
| Instagram | Shopping tags and filters | Meta's API does not support them. |
| Instagram | Messages after the 24-hour window | Meta only allows replies within 24 hours of the customer's last message. A separate 7-day Human Agent window is for replies a person writes. |
| Instagram | More than one private reply to a comment | Meta allows one private reply per commenter, within 7 days of the comment. More only if they reply. |
| Instagram | Starting a new conversation | Meta's API cannot start a chat. The customer must message first. |
| Instagram | Music from Instagram's library | We found no API field for it. Add it in the app. |
| Instagram | Paid partnership label | Meta's help says the label is added in the Instagram mobile app. Meta's API guide lists a partnership label for Facebook Login apps, up to 2 sponsors. Our default: you switch it on in the app. |
| Facebook | Paid partnership label | Set it when you post in Meta Business Suite or the Facebook app. Check the current name in the app. |
| Facebook | Scheduling more than 30 days ahead through the API | The API only accepts 10 minutes to 30 days ahead. |
| TikTok | Public posts from an unaudited app | TikTok keeps them private until the audit passes. |
| TikTok | Finishing level 2 drafts | You open the inbox notice and post in the TikTok app. |
| TikTok | Sounds from TikTok's library, in-app editing, effects | We found no route for these in the Content Posting API. |
| TikTok | LIVE | The Content Posting API covers videos and photos only. |
| TikTok | Comment replies through the content API | Only TikTok's separate business API has comment tools. |
| TikTok | Disclosure if you post in the app | In the app, turn on the content disclosure setting and, for AI-made content, the AI-generated content setting under More options. |
| TikTok Shop | Shop listings and product links on videos | These use TikTok Shop Partner Center and Seller Center, not the Content Posting API. Check the current path in Seller Center. |
| Pinterest | Comments | We found no comment tools in Pinterest's API v5. |
| Pinterest | Paid partnership label | Turn it on in the Pinterest app under Advanced settings when you make the Pin. It cannot be added after the Pin is published. |
| Pinterest | Public Pins on Trial access | Trial Pins are only visible to you. You need Standard access. |
| Creators (pilar-creators) | Posting on a creator's account | A creator's account belongs to the creator. They post. A paid boost of their post is an ads job, not a social job. |

## Sources

All checked on 15 November 2026. TikTok's developer pages would not load from our network, so we checked them through search index copies of the official pages. Open them yourself before you build.

- Meta, Instagram Platform overview: https://developers.facebook.com/docs/instagram-platform/overview (checked 15 Nov 2026)
- Meta, Instagram content publishing: https://developers.facebook.com/docs/instagram-platform/content-publishing/ (checked 15 Nov 2026)
- Meta, Instagram comment moderation: https://developers.facebook.com/docs/instagram-platform/comment-moderation (checked 15 Nov 2026)
- Meta, Instagram private replies: https://developers.facebook.com/docs/instagram-platform/private-replies (checked 15 Nov 2026)
- Meta, Instagram messaging API: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api (checked 15 Nov 2026)
- Meta, Instagram insights: https://developers.facebook.com/docs/instagram-platform/insights (checked 15 Nov 2026)
- Meta, Pages API posts: https://developers.facebook.com/docs/pages-api/posts (checked 15 Nov 2026)
- Meta, Pages API comments: https://developers.facebook.com/docs/pages-api/comments-mentions (checked 15 Nov 2026)
- Meta, Graph API comment reference: https://developers.facebook.com/docs/graph-api/reference/comment/ (checked 15 Nov 2026)
- Meta, Page insights: https://developers.facebook.com/docs/platforminsights/page/ (checked 15 Nov 2026)
- Meta, Ads MCP server overview: https://developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-mcp-server/ads-mcp-server-overview (checked 15 Nov 2026). Tool names `ads_get_ig_media` and `ads_boost_ig_post` checked in the live connector's tool list on 15 Nov 2026.
- Meta, Business Integrations removal: https://www.facebook.com/help/405094243235242 (checked 15 Nov 2026)
- Meta, remove partners: https://en-gb.facebook.com/business/help/2222659621282858 (checked 15 Nov 2026)
- Meta, add system users: https://www.facebook.com/business/help/503306463479099 (checked 15 Nov 2026)
- Meta, remove someone's Page access: https://www.facebook.com/business/help/273201236806115 (checked 15 Nov 2026)
- Meta, Facebook Page access and tasks: https://www.facebook.com/help/289207354498410 (checked 15 Nov 2026)
- Instagram, Hidden Words: https://help.instagram.com/700284123459336/ (checked 15 Nov 2026)
- Instagram, paid partnership label: https://help.instagram.com/1109894795810258 (checked 15 Nov 2026)
- TikTok, Content Posting API get started: https://developers.tiktok.com/docs/en/content-posting-api-get-started (checked 15 Nov 2026)
- TikTok, Direct Post reference: https://developers.tiktok.com/docs/en/content-posting-api-reference-direct-post (checked 15 Nov 2026)
- TikTok, Upload (inbox draft) reference: https://developers.tiktok.com/docs/en/content-posting-api-reference-upload-video (checked 15 Nov 2026)
- TikTok, Query Creator Info: https://developers.tiktok.com/docs/en/content-posting-api-reference-query-creator-info (checked 15 Nov 2026)
- TikTok, Content Sharing Guidelines: https://developers.tiktok.com/docs/en/content-sharing-guidelines (checked 15 Nov 2026)
- TikTok, Scopes reference: https://developers.tiktok.com/docs/en/tiktok-api-scopes (checked 15 Nov 2026)
- TikTok API for Business, reply to a comment: https://business-api.tiktok.com/portal/docs/reply-to-a-comment/v1.3 (checked 15 Nov 2026)
- TikTok API for Business, delete a comment: https://business-api.tiktok.com/portal/docs/delete-a-comment/v1.3 (checked 15 Nov 2026)
- TikTok, AI-generated content: https://support.tiktok.com/en/using-tiktok/creating-videos/ai-generated-content (checked 15 Nov 2026)
- TikTok, connect to third-party apps: https://support.tiktok.com/en/safety-hc/account-and-user-safety/connect-to-third-party-apps (checked 15 Nov 2026)
- TikTok Shop Partner Center, partner authorization: https://partner.tiktokshop.com/docv2/page/partner-authorization-guide (checked 15 Nov 2026)
- Pinterest, create boards and Pins: https://developers.pinterest.com/docs/work-with-organic-content-and-users/create-boards-and-pins/ (checked 15 Nov 2026)
- Pinterest, access tiers: https://developers.pinterest.com/docs/key-concepts/access-tiers/ (checked 15 Nov 2026)
- Pinterest, schedule Pins: https://help.pinterest.com/en/business/article/schedule-pins (checked 15 Nov 2026)
- Pinterest, paid partnerships for creators: https://help.pinterest.com/en/business/article/paid-partnerships-for-creators (checked 15 Nov 2026)
- Pinterest, manage connected apps: https://help.pinterest.com/en/article/connect-to-other-apps-with-pinterest (checked 15 Nov 2026)
- Buffer, MCP server: https://buffer.com/mcp (checked 15 Nov 2026)
- Buffer, MCP tools reference: https://developers.buffer.com/guides/integrations/mcp.html (checked 15 Nov 2026)
- Buffer, Claude setup: https://developers.buffer.com/guides/integrations/claude.html (checked 15 Nov 2026)
- Buffer, Claude integration page: https://buffer.com/integrations/claude (checked 15 Nov 2026)
- Claude connectors directory: https://claude.com/connectors (checked 15 Nov 2026)
- Claude, custom connectors and tool permissions: https://support.claude.com/en/articles/11176164 (checked 15 Nov 2026)
- Claude, custom connectors by plan: https://support.claude.com/en/articles/11175166 (checked 15 Nov 2026)
