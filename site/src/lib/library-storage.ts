import { LibrarySync } from "./library-sync";
export const BEFORE_LIBRARY_SYNC = "abb:before-library-sync";
export const REMOTE_LIBRARY_UPDATE = "abb:remote-library-update";
let tab = "default";
try { tab = sessionStorage.getItem("abb:tab") || crypto.randomUUID(); sessionStorage.setItem("abb:tab", tab); } catch {}
const storage = { get length() { return localStorage.length; }, key: (i: number) => localStorage.key(i), getItem: (k: string) => localStorage.getItem(k), setItem: (k: string, v: string) => localStorage.setItem(k, v), removeItem: (k: string) => localStorage.removeItem(k) };
export const library = new LibrarySync(storage, (input, init) => fetch(input, init), tab);
export const libraryStorage = { getItem: (key: string) => library.read(key), setItem: (key: string, value: string) => library.write(key, value), removeItem: (key: string) => library.write(key, null) };
let accountToken: ((forceRefresh?: boolean) => Promise<string>) | null = null;
export const setAccountToken = (token: ((forceRefresh?: boolean) => Promise<string>) | null) => { accountToken = token; };
export const hasAccount = () => !!accountToken;
export const getAccountToken = () => accountToken?.();
if (typeof window !== "undefined") {
  library.beforeSync(() => window.dispatchEvent(new Event(BEFORE_LIBRARY_SYNC)));
  library.onRemote(keys => window.dispatchEvent(new CustomEvent(REMOTE_LIBRARY_UPDATE, { detail: keys })));
  window.addEventListener("storage", () => library.reloadGuest());
}
