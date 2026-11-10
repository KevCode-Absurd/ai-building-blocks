// Pages for the experts module. Register each page here; src/ui/pages/index.ts collects them.
import type { NavItem, PageDef } from "../types.ts";
import { ApplyPage } from "./apply.tsx";
import { ExpertHome } from "./expert.tsx";
import { InvitePage } from "./invite.tsx";
import { ExpertProfilePage } from "./profile.tsx";
import { MyPostsPage, NewPostPage, PostPage } from "./posts.tsx";
import { OpsInvites, OpsPosts } from "./ops-pages.tsx";
import "./experts.css";

export const pages: PageDef[] = [
  // /experts/apply and /experts/invite/:token come before the public profile, so they never read as a slug.
  { path: "/experts/apply", access: "signed-in", component: ApplyPage },
  { path: "/experts/invite/:token", access: "public", component: InvitePage },
  { path: "/experts/:slug", access: "public", component: ExpertProfilePage },
  { path: "/expert", access: "signed-in", component: ExpertHome },
  { path: "/job-posts", access: "signed-in", component: MyPostsPage },
  { path: "/job-posts/new", access: "signed-in", component: NewPostPage },
  { path: "/job-posts/:id", access: "signed-in", component: PostPage },
  { path: "/ops/invites", access: "ops", component: OpsInvites },
  { path: "/ops/job-posts", access: "ops", component: OpsPosts },
];

export const nav: NavItem[] = [
  { label: "Expert dashboard", href: "/expert", group: "account", order: 10, show: me => !!me?.expert },
  { label: "Apply as an expert", href: "/experts/apply", group: "account", order: 11, show: me => !me?.expert },
  { label: "Post a job for experts", href: "/job-posts", group: "account", order: 12 },
];
