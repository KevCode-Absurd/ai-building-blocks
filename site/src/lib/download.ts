import {trackUxEvent} from "./ux-events";

export function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  trackUxEvent("file_download");
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

