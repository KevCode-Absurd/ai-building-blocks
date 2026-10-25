import { Component, useLayoutEffect, type ReactNode } from "react";
import { Link } from "./lib/router";
import "./navigation-usability.css";

function RecoveryScreen() {
  // A first-route chunk can fail before the loading cover has been dismissed.
  useLayoutEffect(() => { document.dispatchEvent(new Event("abb:ready")); }, []);
  return <main className="wrap bp-hero page-recovery" data-testid="page-recovery">
    <h1 className="bp-h1">This page couldn't open</h1>
    <p role="alert">Check your connection, then reload this page. You can also choose another page from the menu.</p>
    <div className="page-recovery-actions">
      <button type="button" className="btn btn-primary" onClick={() => location.reload()}>Reload this page</button>
      <Link to="/#library" className="btn btn-ghost">Find a task</Link>
      <Link to="/support" className="btn btn-ghost">Get help</Link>
    </div>
  </main>;
}

/** Keep navigation usable when a route fails. The path key resets this boundary
 * when the person chooses another page; rejected module loads need a reload. */
export default class PageRecovery extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <RecoveryScreen /> : this.props.children; }
}
