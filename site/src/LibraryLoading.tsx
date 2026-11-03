import {type Kind} from "./lib/data";
import {Link} from "./lib/router";
import {SearchIcon} from "./ui";
export const LIBRARY_FORMATS: { id: Kind | "all"; name: string; line: string }[] = [
  { id: "all", name: "All", line: "Explore the library" },
  { id: "skill", name: "Skills", line: "Run the same steps every time" },
  { id: "prompt", name: "Prompts", line: "Paste into a chat" },
  { id: "workflow", name: "Workflows", line: "Connect several steps" },
  { id: "agent", name: "Agents", line: "Delegate a repeatable job" },
  { id: "mind", name: "Minds", line: "Borrow an expert's thinking" },
];
export default function LibraryLoading({ error, retry }: { error: string | null; retry: () => void }) {
  return <section className="section wrap library-recovery" id="library" aria-label="Task library"><h2 className="visually-hidden">Find a task</h2><div className="library-formats library-formats-loading">{LIBRARY_FORMATS.map(format => <Link key={format.id} to={`/?kind=${format.id === "all" ? "" : format.id}#library`}><span>{format.name}</span><small>{format.line}</small></Link>)}<Link to="/roles"><span>Specialists</span><small>Hire one for a whole job</small></Link></div><label className="search big"><SearchIcon /><span className="visually-hidden">What do you want to get done?</span><input disabled placeholder="What do you want to get done?" data-testid="library-search" /></label>{error ? <><p role="alert">{error}</p><button className="btn btn-primary" onClick={retry}>Try again</button><p className="small">You can still use the public guides and browser tools.</p><Link to="/tools">Open browser tools →</Link></> : <p role="status" className="small">Opening the task library…</p>}</section>;
}
