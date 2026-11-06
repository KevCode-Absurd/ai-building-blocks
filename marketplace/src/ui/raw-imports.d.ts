// Vite's ?raw imports: the file's text as a string, bundled at build time (used for the guides' markdown).
declare module "*.md?raw" {
  const text: string;
  export default text;
}
