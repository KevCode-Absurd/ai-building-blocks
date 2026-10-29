/** Keep the complete text, including every newline. Smaller layout regions keep long previews responsive. */
export function previewChunks(text) {
  if (text.length <= 16000) return [text];
  const lines = text.match(/[^\n]*\n|[^\n]+$/g) ?? [];
  const chunks = [];
  for (let i = 0; i < lines.length; i += 20) chunks.push(lines.slice(i, i + 20).join(''));
  return chunks;
}
