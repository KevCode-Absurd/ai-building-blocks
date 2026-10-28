// Synthetic local fixtures only. No Microsoft modules, credentials, tenant calls or catalogue badges.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const item = fileURLToPath(new URL('../../catalogue-items/imported/microsoft-365-admin-helper/', import.meta.url));
const python = process.platform === 'win32' ? 'python' : 'python3';
const fixture = { username: 'synthetic', display_name: "Fixture ' $(throw 'INPUT EXECUTED')", first_name: 'Synthetic', last_name: 'Fixture', department: 'Fixtures', license_sku: 'SYNTHETIC_SKU', usage_location: 'GB' };
function temporary(run) {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-blocks-m365-test-'));
  try { return run(folder); } finally {
    assert.equal(path.dirname(path.resolve(folder)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(folder).startsWith('ai-blocks-m365-test-'));
    fs.rmSync(folder, { recursive: true, force: true });
  }
}
function generate(folder, users = [fixture, { ...fixture, username: 'synthetic-two' }]) {
  const input = path.join(folder, 'users.json'), output = path.join(folder, 'create.ps1');
  fs.writeFileSync(input, JSON.stringify(users));
  const result = spawnSync(python, ['-B', path.join(item, 'scripts/user_management.py'), '--domain', 'synthetic.invalid', '--action', 'create', '--users', input, '-o', output], { encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
  return { ...result, output };
}
const harness = String.raw`
$ErrorActionPreference = 'Stop'
$global:created = 0; $global:licensed = 0; $global:connected = 0; $global:plaintextFound = $false
$global:passwords = [System.Collections.Generic.List[string]]::new()
function Connect-MgGraph { [CmdletBinding()]param($Scopes) $global:connected++ }
function Disconnect-MgGraph { [CmdletBinding()]param() }
function Get-MgSubscribedSku { [CmdletBinding()]param([switch]$All) [pscustomobject]@{ SkuPartNumber='SYNTHETIC_SKU'; SkuId='synthetic-sku-id' } }
function New-MgUser {
    [CmdletBinding()]param($UserPrincipalName,$DisplayName,$GivenName,$Surname,$JobTitle,$Department,$UsageLocation,$PasswordProfile,[switch]$AccountEnabled,$MailNickname)
    $global:created++
    $found = @(Get-ChildItem -LiteralPath $env:M365_FIXTURE_FOLDER -Filter '*.credential.clixml')
    if ($found.Count -ne $global:created) { throw 'Handover was not saved before account creation' }
    $own = @($found | Where-Object { (Import-Clixml -LiteralPath $_.FullName).UserName -eq $UserPrincipalName })
    if ($own.Count -ne 1) { throw 'Wrong handover identity' }
    $saved = Import-Clixml -LiteralPath $own[0].FullName
    if ($saved.GetNetworkCredential().Password -cne $PasswordProfile.Password) { throw 'Password handover mismatch' }
    $global:passwords.Add($PasswordProfile.Password)
    if ((Get-Content -LiteralPath $own[0].FullName -Raw).Contains($PasswordProfile.Password)) { $global:plaintextFound=$true }
    if ($DisplayName -cne $env:M365_FIXTURE_DISPLAY) { throw 'Input was not preserved literally' }
    if ($UsageLocation -ne 'GB') { throw 'Usage location was replaced by a guessed default' }
    if ($env:M365_FIXTURE_MODE -eq 'create-failure') { throw ('Synthetic API failure containing secret ' + $PasswordProfile.Password) }
    [pscustomobject]@{ Id = 'synthetic-user-id' }
}
function Set-MgUserLicense {
    [CmdletBinding()]param($UserId,$AddLicenses,$RemoveLicenses)
    $global:licensed++
    if ($env:M365_FIXTURE_MODE -eq 'licence-failure') { throw ('Synthetic API failure containing secret ' + $global:passwords[0]) }
}
# Inline SKILL examples use these local stand-ins; these functions perform no I/O or authentication.
function Read-Host { param($Prompt) $env:M365_FIXTURE_FOLDER }
function Import-Csv { param($Path) @(
    [pscustomobject]@{ DisplayName=$env:M365_FIXTURE_DISPLAY; UserPrincipalName='synthetic@synthetic.invalid'; Department='Fixtures'; LicenseSku='SYNTHETIC_SKU'; UsageLocation='GB' },
    [pscustomobject]@{ DisplayName=$env:M365_FIXTURE_DISPLAY; UserPrincipalName='synthetic-two@synthetic.invalid'; Department='Fixtures'; LicenseSku='SYNTHETIC_SKU'; UsageLocation='GB' }
) }
$failed = $false
$messages = [System.Collections.Generic.List[string]]::new()
try { & $env:M365_FIXTURE_SCRIPT -HandoverDirectory $env:M365_FIXTURE_TARGET *>&1 | ForEach-Object { $messages.Add([string]$_) } } catch { $failed = $true; $messages.Add([string]$_) }
$files = @(Get-ChildItem -LiteralPath $env:M365_FIXTURE_FOLDER -Filter '*.credential.clixml')
$secretLeak = $false
foreach ($secret in $global:passwords) { if (($messages -join [Environment]::NewLine).Contains($secret)) { $secretLeak=$true } }
$report = @{ created=$global:created; licensed=$global:licensed; connected=$global:connected; files=$files.Count; failed=$failed; plaintextFound=$global:plaintextFound; secretLeak=$secretLeak; uniquePasswords=@($global:passwords | Select-Object -Unique).Count }
# Do not emit generated fixture passwords. Check captured logs for leaks in memory.
$report | ConvertTo-Json -Compress | Set-Content -LiteralPath $env:M365_FIXTURE_REPORT
`;
function execute(folder, script, mode, target = folder) {
  const report = path.join(folder, 'result.json'), runner = path.join(folder, 'harness.ps1');
  fs.writeFileSync(runner, harness);
  const result = spawnSync('pwsh', ['-NoLogo', '-NoProfile', '-NonInteractive', '-File', runner], { cwd: item, encoding: 'utf8', timeout: 30000, env: { ...process.env, M365_FIXTURE_FOLDER: folder, M365_FIXTURE_TARGET: target, M365_FIXTURE_SCRIPT: script, M365_FIXTURE_REPORT: report, M365_FIXTURE_MODE: mode, M365_FIXTURE_DISPLAY: fixture.display_name } });
  assert.equal(result.status, 0, result.stderr);
  return { ...JSON.parse(fs.readFileSync(report, 'utf8').replace(/^\uFEFF/, '')), logs: result.stdout + result.stderr };
}

test('M365 generator refuses guessed licence and usage location', () => temporary(folder => {
  for (const field of ['license_sku', 'usage_location']) {
    const input = { ...fixture }; delete input[field];
    const result = generate(folder, [input]);
    assert.notEqual(result.status, 0);
    assert.equal(fs.existsSync(result.output), false);
  }
}));

test('M365 Windows handover is encrypted, recoverable and saved before account creation; input stays literal', { skip: process.platform !== 'win32' }, () => temporary(folder => {
  const generated = generate(folder); assert.equal(generated.status, 0, generated.stderr);
  const result = execute(folder, generated.output, 'success');
  assert.deepEqual([result.created, result.licensed, result.files, result.uniquePasswords], [2, 2, 2, 2]);
  assert.equal(result.failed, false); assert.equal(result.plaintextFound, false);
  assert.equal(result.secretLeak, false);
}));

test('M365 uncertain creation and licence failures retain handover and stop the batch', { skip: process.platform !== 'win32' }, () => {
  for (const mode of ['create-failure', 'licence-failure']) temporary(folder => {
    const generated = generate(folder); assert.equal(generated.status, 0, generated.stderr);
    const result = execute(folder, generated.output, mode);
    assert.equal(result.failed, true); assert.equal(result.created, 1); assert.equal(result.files, 1);
    assert.equal(result.plaintextFound, false);
    assert.equal(result.secretLeak, false);
    assert.ok(!result.logs.includes('Synthetic API failure containing secret'));
  });
});

test('M365 missing handover folder stops before authentication or account creation', { skip: process.platform !== 'win32' }, () => temporary(folder => {
  const generated = generate(folder); assert.equal(generated.status, 0, generated.stderr);
  const result = execute(folder, generated.output, 'success', path.join(folder, 'missing'));
  assert.equal(result.failed, true);
  assert.deepEqual([result.connected, result.created, result.files], [0, 0, 0]);
}));

test('both documented M365 creation examples use the same recoverable handover on licence failure', { skip: process.platform !== 'win32' }, () => {
  const source = fs.readFileSync(path.join(item, 'SKILL.md'), 'utf8');
  const examples = [...source.matchAll(/```powershell\r?\n([\s\S]*?)\r?\n```/g)].map(match => match[1]).filter(code => code.includes('New-TemporaryUserCredential'));
  assert.equal(examples.length, 2);
  for (const example of examples) temporary(folder => {
    const script = path.join(folder, 'example.ps1'); fs.writeFileSync(script, example);
    const result = execute(folder, script, 'licence-failure');
    assert.equal(result.failed, true); assert.equal(result.created, 1); assert.equal(result.files, 1);
    assert.equal(result.plaintextFound, false);
    assert.equal(result.secretLeak, false);
    assert.ok(!result.logs.includes('Synthetic API failure containing secret'));
  });
});
