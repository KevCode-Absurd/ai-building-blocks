/** Copy text that may still be loading. Safari only allows a copy straight after the click, so a pending message is
 *  handed to the clipboard as a promise when the browser supports it; otherwise it is copied once it is ready.
 *  Resolves with the copied text. Rejects when the text could not load or the browser refused the copy. */
export async function copyText(text: string | Promise<string>): Promise<string> {
  if (typeof text !== "string" && typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    const blob = text.then((t) => new Blob([t], { type: "text/plain" }));
    try {
      await navigator.clipboard.write([new ClipboardItem({ "text/plain": blob })]);
      return await text;
    } catch {
      // Some browsers refuse a pending item. Fall back to copying the finished text.
    }
  }
  const value = await text;
  await navigator.clipboard.writeText(value);
  return value;
}
