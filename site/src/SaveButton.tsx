import { kits, useStore } from "./lib/store";
import { useCommunityStars } from "./CommunityStars";
import { usePersistence } from "./AccountPersistence";

/** The kit every Save goes into. It shows on My work like any other kit. */
export const SAVED_KIT = "Saved";

/** One way to keep an item: Save. It works without an account (this browser) and syncs once signed in.
 *  When signed in it also counts as a star, so saved items still lift the library's rankings. */
export default function SaveButton({ slug, title, toast }: { slug: string; title: string; toast: (m: string) => void }) {
  const all = useStore((s) => s.kits);
  const { starred, toggle } = useCommunityStars();
  const { account } = usePersistence();
  const saved = all.some((k) => k.slugs.includes(slug));
  const target = `catalogue:${slug}`;
  const signedIn = account.state === "signed-in";
  const click = () => {
    if (saved) {
      for (const k of all) if (k.slugs.includes(slug)) kits.toggle(k.id, slug);
      if (signedIn && starred.has(target)) void toggle(target);
      toast(`Removed ${title} from your saved items.`);
      return;
    }
    const box = all.find((k) => k.name === SAVED_KIT);
    if (box) kits.toggle(box.id, slug); else kits.create(SAVED_KIT, [slug]);
    if (signedIn && !starred.has(target)) void toggle(target);
    toast(signedIn ? "Saved. Find it in My work." : "Saved in this browser. Find it in My work. Sign in to keep it on every device.");
  };
  return <button type="button" className="btn btn-line" aria-pressed={saved} onClick={click} data-testid="save-item">{saved ? "Saved" : "Save"}</button>;
}
