// /sign-in: a short page that says why to sign in, modeled on the library's sign-in page (site/src/AccountPage.tsx,
// SignUp). Its button sends the visitor to Clerk's own sign-in page (auth.openSignIn uses clerk.redirectToSignIn), and
// Clerk sends them back to ?next= (a path on this site only; anything else goes home). Signed in already: straight on.
import { useEffect } from "preact/hooks";
import { Spinner } from "../components.tsx";
import { safeNext, useAuth } from "../lib/auth.tsx";
import { Link, navigate } from "../lib/router.tsx";

export function SignInPage(props: { query: URLSearchParams }) {
  const auth = useAuth();
  const next = safeNext(props.query.get("next"));
  const signUp = props.query.get("new") === "1";
  useEffect(() => { document.title = `${signUp ? "Create an account" : "Sign in"} · AI Blocks`; }, [signUp]);
  useEffect(() => { if (auth.loaded && auth.signedIn) navigate(next, { replace: true }); }, [auth.loaded, auth.signedIn, next]);
  if (auth.loaded && auth.signedIn) return <main class="wrap account-page"><Spinner label="You are signed in. Taking you back…" /></main>;
  const back = next === "/" ? "the agents home page" : "the page you were on";
  const other = new URLSearchParams();
  if (next !== "/") other.set("next", next);
  if (!signUp) other.set("new", "1");
  const otherHref = `/sign-in${other.toString() ? `?${other.toString()}` : ""}`;
  return (
    <main class="wrap account-page">
      <section class="account-welcome" data-testid="sign-in">
        <p class="account-eyebrow">AI Blocks agents</p>
        <h1>{signUp ? "Create your free account." : "Sign in to AI Blocks agents."}</h1>
        <p class="lede">It is the same account as useaiblocks.com, so if you use the library, you already have one. After you sign in, you come back to {back}.</p>
        <div class="account-actions">
          <button type="button" class="btn btn-primary" disabled={!auth.loaded} onClick={() => auth.openSignIn(next, { signUp })}>{!auth.loaded ? "Opening sign-in…" : signUp ? "Create a free account" : "Sign in"}</button>
          <Link href={otherHref} class="link-btn">{signUp ? "Already have an account? Sign in" : "New here? Create an account"}</Link>
        </div>
        <p class="small account-welcome-note">Agents are free. You can browse and download every agent without an account. You need one to connect your AI.</p>
        <Link href="/agents" class="small account-text-link">Browse the agents first →</Link>
        <p class="small">Accounts are for adults aged 18 or older. Read our <a href="https://useaiblocks.com/terms">Terms of service</a> and <a href="https://useaiblocks.com/privacy">Privacy policy</a>.</p>
      </section>
    </main>
  );
}
