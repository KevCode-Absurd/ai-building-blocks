import { Clerk } from '@clerk/clerk-js';

const status = document.querySelector<HTMLParagraphElement>('#status')!;
const details = document.querySelector<HTMLDivElement>('#details')!;
const error = document.querySelector<HTMLParagraphElement>('#error')!;
const connect = document.querySelector<HTMLButtonElement>('#connect')!;
async function boot() {
  const contextResponse = await fetch(`/oauth/authorization-context${location.search}`, { credentials: 'same-origin', cache: 'no-store' });
  const context = await contextResponse.json();
  if (!contextResponse.ok) throw Error(context.error_description ?? context.error ?? 'This connection request is invalid. Start again in your AI tool.');
  const configResponse = await fetch('/api/auth', { cache: 'no-store' });
  const config = await configResponse.json();
  if (!config.configured || !config.publishableKey) throw Error('Work-account sign-in is not configured for this environment.');
  const clerk = new Clerk(config.publishableKey);
  await clerk.load();
  if (!clerk.session) {
    status.textContent = 'Sign in with your work account to choose access.';
    connect.textContent = 'Sign in with your work account'; connect.disabled = false;
    connect.onclick = () => { void clerk.redirectToSignIn({ redirectUrl: location.href }); };
    return;
  }
  status.textContent = `Signed in as ${clerk.user?.primaryEmailAddress?.emailAddress ?? 'your work account'}.`;
  details.hidden = false;
  const personal = context.scope === 'saved:read';
  details.textContent = `AI client (name supplied by the client): ${context.client_name ?? context.client_id}. Client callback: ${new URL(context.redirect_uri).origin}. ${personal ? 'Personal library' : 'Company workspace'} endpoint: ${new URL(context.resource).pathname}. Access: read ${personal ? 'your saved kits, workflows, skills, agents and profiles' : 'this company’s saved skills, workflows, kits and agents'} and supporting files. Your chosen AI provider receives the selected content.`;
  connect.disabled = false;
  connect.onclick = async () => {
    connect.disabled = true; error.textContent = '';
    try {
      const token = await clerk.session!.getToken();
      if (!token) throw Error('Your sign-in expired. Sign in again.');
      const response = await fetch('/oauth/authorize', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify({ ...Object.fromEntries(new URLSearchParams(location.search)), consent: true }) });
      const result = await response.json();
      if (!response.ok || typeof result.redirect_uri !== 'string') throw Error(result.error_description ?? result.error ?? 'Could not connect this workspace.');
      // Only the server's validated registered redirect receives the short-lived PKCE code.
      location.assign(result.redirect_uri);
    } catch (cause) { error.textContent = cause instanceof Error ? cause.message : 'Could not connect this workspace.'; connect.disabled = false; }
  };
}
void boot().catch(cause => { status.textContent = 'The connection could not be prepared.'; error.textContent = cause instanceof Error ? cause.message : 'Try starting again from your AI tool.'; });
