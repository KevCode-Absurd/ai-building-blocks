// Retry official Wrangler with a verified manifest for immutable assets. All
// upload, binding, deployment and secret handling remains Wrangler's own code.
// This adapts only the manifest-loader in memory; node_modules is never edited.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import Module,{createRequire} from 'node:module';
const require=createRequire(new URL('../site/package.json',import.meta.url));
const packageFile=require.resolve('wrangler/package.json');
assert.equal(JSON.parse(fs.readFileSync(packageFile,'utf8')).version,'4.151.3');
assert(process.env.CF_FROZEN_ASSET_MANIFEST,'Set CF_FROZEN_ASSET_MANIFEST to the dedicated release cache.');
const cachePath=path.resolve(process.env.CF_FROZEN_ASSET_MANIFEST);
const allowed=[path.resolve('site/.wrangler/releases'),path.resolve('C:/Users/kevin/.codex/visualizations/2026/10/22/01a161bf-0b97-7cf2-97f3-74eb6d30d1e4')];
assert(allowed.some(parent=>cachePath.startsWith(parent+path.sep)));
const cache=JSON.parse(fs.readFileSync(cachePath,'utf8'));
assert.equal(cache.wranglerVersion,'4.151.3');
assert.equal(crypto.createHash('sha256').update(JSON.stringify(cache.manifest)).digest('hex'),cache.manifestSha256);
assert.equal(Object.keys(cache.manifest).length,cache.entries);
const cliPath=path.join(path.dirname(packageFile),'wrangler-dist/cli.js');
const original=fs.readFileSync(cliPath,'utf8');
const marker='buildAssetManifest = /* @__PURE__ */ __name(async (dir2) => {';
assert.equal(original.split(marker).length,2,'Wrangler implementation changed; use the normal CLI.');
const insertion='\nconst frozenCache=JSON.parse(fs14.readFileSync(process.env.CF_FROZEN_ASSET_MANIFEST,"utf8")); if(path29__namespace.resolve(dir2)!==frozenCache.directory)throw new Error("Frozen asset directory mismatch"); logger.info("Using verified frozen asset manifest: "+frozenCache.entries+" entries"); return frozenCache.manifest;\n';
const adapted=original.replace(marker,marker+insertion);
const cli=new Module(cliPath);
cli.filename=cliPath;cli.paths=Module._nodeModulePaths(path.dirname(cliPath));
process.argv[1]=cliPath;process.mainModule=cli;
cli._compile(adapted,cliPath);
