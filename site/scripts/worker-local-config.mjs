// Generate only the ignored local emulator configuration; never read provider keys.
import fs from 'node:fs';
import path from 'node:path';
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--directory')) throw new Error('Use --directory PATH for a short local test directory.');
const outputDir = path.resolve(args[1] || '.');
const config = JSON.parse(fs.readFileSync('wrangler.example.jsonc', 'utf8'));
delete config.env;
config.name = 'ai-building-blocks-local';
config.workers_dev = false;
config.preview_urls = false;
config.vars.SECURITY_LOCAL = 'true';
config.vars.PUBLIC_API_ENABLED = 'true';
config.vars.MCP_OAUTH_ENABLED = 'true';
config.d1_databases = config.d1_databases.map(db => ({ ...db, database_name: 'ai-blocks-local', database_id: '00000000-0000-0000-0000-000000000001' }));
Object.assign(config.vars, { COMMENTS_SALT: 'local-test-comment-salt', COMMENTS_TEAM_TOKEN: 'local-test-comment-team', SPACES_SALT: 'local-test-space-salt', SPACES_TEAM_TOKEN: 'local-test-space-team' });
if (outputDir !== process.cwd()) {
  config.main = path.resolve(config.main);
  config.assets.directory = path.resolve(config.assets.directory);
  for (const db of config.d1_databases) db.migrations_dir = path.resolve(db.migrations_dir);
  // Resolve the config schema without needing node_modules in the short directory.
  config.$schema = path.resolve('node_modules/wrangler/config-schema.json');
}
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'wrangler.local.jsonc'), JSON.stringify(config, null, 2) + '\n');
console.log('Prepared local Workers test configuration in ' + outputDir + '; AI disabled.');
