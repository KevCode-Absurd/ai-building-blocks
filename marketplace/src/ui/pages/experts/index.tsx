// Pages for the experts module. Register each page here; src/ui/pages/index.ts collects them.
import type { NavItem, PageDef } from "../types.ts";
import { lazy } from "preact/compat";
const ApplyPage = lazy(() => import("./apply.tsx").then(m => ({ default: m.ApplyPage })));
const ExpertHome = lazy(() => import("./expert.tsx").then(m => ({ default: m.ExpertHome })));
const InvitePage = lazy(() => import("./invite.tsx").then(m => ({ default: m.InvitePage })));
const ExpertProfilePage = lazy(() => import("./profile.tsx").then(m => ({ default: m.ExpertProfilePage })));
const MyPostsPage = lazy(() => import("./posts.tsx").then(m => ({ default: m.MyPostsPage })));
const NewPostPage = lazy(() => import("./posts.tsx").then(m => ({ default: m.NewPostPage })));
const PostPage = lazy(() => import("./posts.tsx").then(m => ({ default: m.PostPage })));
const OpsInvites = lazy(() => import("./ops-pages.tsx").then(m => ({ default: m.OpsInvites })));
const OpsPosts = lazy(() => import("./ops-pages.tsx").then(m => ({ default: m.OpsPosts })));
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
