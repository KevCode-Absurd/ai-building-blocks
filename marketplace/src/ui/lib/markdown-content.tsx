// Loaded when a page actually displays Markdown, not by the catalogue's shared UI controls.
import { useMemo } from "preact/hooks";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Pack files never load remote media, forms, styles or active embeds.
const FORBID_TAGS = ["img", "picture", "source", "video", "audio", "track", "iframe", "frame", "object", "embed", "style", "link", "meta", "base", "form", "input", "button", "textarea", "select", "svg", "math"];
const FORBID_ATTR = ["style", "srcset", "ping", "background", "poster", "formaction"];

export function renderSafeMarkdown(md: string): string {
  const html = DOMPurify.sanitize(marked.parse(md, { async: false }) as string, { FORBID_TAGS, FORBID_ATTR });
  const box = document.createElement("template");
  box.innerHTML = html;
  for (const a of Array.from(box.content.querySelectorAll("a[href]"))) {
    let url: URL;
    try { url = new URL(a.getAttribute("href") ?? "", location.href); } catch { a.removeAttribute("href"); continue; }
    if (url.origin !== location.origin) { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener noreferrer"); }
  }
  return box.innerHTML;
}

export default function MarkdownContent(props: { text: string; class?: string; safe?: boolean; onClick?: (e: MouseEvent) => void }) {
  const html = useMemo(() => props.safe ? renderSafeMarkdown(props.text)
    : DOMPurify.sanitize(marked.parse(props.text ?? "", { async: false }) as string), [props.text, props.safe]);
  return <div class={`prose ${props.class ?? ""}`} onClick={props.onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
