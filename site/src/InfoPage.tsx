import { useEffect } from "react";
import { Link } from "./lib/router";
import { INFO_PAGES, POLICY_DATE, SUPPORT_EMAIL, emailLink, infoPage } from "./lib/site-info.mjs";
import "./info.css";

export default function InfoPage({ path, toast }: { path: string; toast: (message: string) => void }) {
  const page = infoPage(path)!;
  useEffect(() => {
    document.title = `${page.title} · AI Blocks`;
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) document.querySelector(selector)?.setAttribute("content", page.description);
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) document.querySelector(selector)?.setAttribute("content", document.title);
  }, [page]);
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(SUPPORT_EMAIL); toast("Support email copied."); }
    catch { toast(`Copy the address manually: ${SUPPORT_EMAIL}`); }
  };
  return <main className="wrap info-page" data-testid="info-page">
    <nav className="info-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span>{page.label}</span></nav>
    <div className="info-layout">
      <aside className="info-sidebar"><span className="mono small">HELP & INFORMATION</span><nav aria-label="Help and policies">{INFO_PAGES.map(item => <Link key={item.path} to={item.path} aria-current={item.path === path ? "page" : undefined}>{item.label}<span aria-hidden="true">↗</span></Link>)}</nav><a className="info-sidebar-email" href={emailLink()}>{SUPPORT_EMAIL}</a></aside>
      <article className="info-article">
        <header className="info-heading"><p className="mono small">AI BLOCKS · {path === "/support" ? "SUPPORT" : path === "/about" ? "ABOUT" : "POLICIES"}</p><h1>{page.title}</h1><p className="lede">{page.description}</p><p className="small">{path === "/support" || path === "/about" ? "Updated" : "Effective and last updated"} {POLICY_DATE}</p></header>
        {path === "/support" && <div className="info-contact"><div><span className="mono small">SUPPORT EMAIL</span><a href={emailLink()}>{SUPPORT_EMAIL}</a><p className="small">Kevin Mark · India</p></div><button type="button" className="btn btn-dark btn-sm" onClick={() => void copyEmail()}>Copy email address</button></div>}
        {path === "/cookies" && <p><button type="button" className="btn btn-dark btn-sm" onClick={() => document.dispatchEvent(new Event("abb:cookie-settings"))}>Cookie preferences</button></p>}
        <nav className="info-contents" aria-label="On this page"><span className="mono small">ON THIS PAGE</span>{page.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav>
        {page.sections.map(section => <section className="info-section" id={section.id} key={section.id} aria-labelledby={`info-${section.id}`}><h2 id={`info-${section.id}`}>{section.title}</h2>{section.paragraphs.map(text => <p key={text}>{text}</p>)}{section.items && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}{section.links && <div className="info-links">{section.links.map(link => link.href.startsWith("/") ? <Link key={link.href} to={link.href}>{link.label} <span aria-hidden="true">→</span></Link> : <a key={link.href} href={link.href}>{link.label} <span aria-hidden="true">↗</span></a>)}</div>}</section>)}
        <div className="info-end"><h2>Need a hand?</h2><p>Email <a href={emailLink()}>{SUPPORT_EMAIL}</a> with the page address and what you need help with.</p></div>
      </article>
    </div>
  </main>;
}
