import { useState } from "react";
import type { Catalogue } from "./lib/data";
import type { Flow } from "./lib/store";
import { buildHandoffZip } from "./lib/handoff";
import { importCommunityZip } from "./lib/community-import";
import { navigate } from "./lib/router";
export default function PublishWorkflow({ c, flow }: { c: Catalogue; flow: Flow }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const prepare = async () => {
    setBusy(true); setError("");
    try {
      // Publication deliberately omits the separately saved business profile.
      const pack = await buildHandoffZip(c, flow);
      if ("error" in pack) throw Error(pack.error);
      const source = importCommunityZip(new Uint8Array(await pack.blob.arrayBuffer()));
      sessionStorage.setItem("abb:community-import", JSON.stringify({ ...source, title: flow.name, kind: "workflow" }));
      navigate("/publish?import=workflow");
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };
  return <><button type="button" className="btn btn-line btn-sm" disabled={busy || !flow.nodes.length} onClick={() => void prepare()}>{busy ? "Preparing draft…" : "Submit to community"}</button>{error && <p role="alert" className="small">{error}</p>}</>;
}
