// Draws the link-preview image (public/og/default.png, 1200 x 630) and the logo for structured data
// (public/og/logo.png, 512 x 512) from the site's pixel mark. Run once from site/ after changing the mark:
//   node scripts/make-og.mjs
import fs from "node:fs";
import sharp from "sharp";

// The favicon's pixel mark: full cells and faint cells on a 9 x 9 grid (the same as index.html).
const FULL = ["3,1", "4,1", "5,1", "2,2", "4,2", "6,2", "1,3", "3,3", "5,3", "7,3", "1,4", "2,4", "4,4", "6,4", "7,4", "1,5", "3,5", "5,5", "7,5", "2,6", "4,6", "6,6", "3,7", "4,7", "5,7"];
const FAINT = ["3,2", "5,2", "2,3", "4,3", "6,3", "3,4", "5,4", "2,5", "4,5", "6,5", "3,6", "5,6"];
const mark = (x0, y0, cell) => [
  ...FULL.map((c) => { const [x, y] = c.split(",").map(Number); return `<rect x="${x0 + x * cell}" y="${y0 + y * cell}" width="${cell * 0.86}" height="${cell * 0.86}" fill="#fff"/>`; }),
  ...FAINT.map((c) => { const [x, y] = c.split(",").map(Number); return `<rect x="${x0 + x * cell}" y="${y0 + y * cell}" width="${cell * 0.86}" height="${cell * 0.86}" fill="#fff" opacity=".35"/>`; }),
].join("");

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  ${mark(90, 150, 36)}
  <text x="470" y="290" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="86" font-weight="700" fill="#fff">AI Blocks</text>
  <text x="472" y="360" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="34" fill="#bdbdbd">Free AI skills, workflows and minds</text>
  <text x="472" y="410" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="34" fill="#bdbdbd">that do real work for you.</text>
  <text x="472" y="500" font-family="Consolas, Menlo, monospace" font-size="28" fill="#8a8a8a">useaiblocks.com</text>
</svg>`;
const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#0a0a0a"/>${mark(0, 0, 57.6)}</svg>`;

fs.mkdirSync("public/og", { recursive: true });
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile("public/og/default.png");
await sharp(Buffer.from(logo)).png({ compressionLevel: 9 }).toFile("public/og/logo.png");
console.log("wrote public/og/default.png and public/og/logo.png");
