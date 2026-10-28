---
name: "ms365-tenant-manager"
description: Microsoft 365 tenant administration for Global Administrators. Automate M365 tenant setup, Office 365 admin tasks, Azure AD user management, Exchange Online configuration, Teams administration, and security policies. Generate PowerShell scripts for bulk operations, Conditional Access policies, license management, and compliance reporting. Use for M365 tenant manager, Office 365 admin, Azure AD users, Global Administrator, tenant configuration, or Microsoft 365 automation.
---

# Microsoft 365 Tenant Manager

Expert guidance and automation for Microsoft 365 Global Administrators managing tenant setup, user lifecycle, security policies, and organizational optimization.

**What you hand back (added by AI Blocks):** named PowerShell scripts (.ps1) for the job, the read-only audit CSV files, and for new users a temporary passwords file to hand over safely and then delete. See Output format at the end.

**Plan needs (added by AI Blocks):** Conditional Access policies need Microsoft Entra ID P1 or higher (included in plans such as Microsoft 365 Business Premium or E3). Shared mailbox and other mailbox steps need Exchange Online in the plan. Both are paid. Check the tenant has them before writing those scripts, and say so if it does not.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code or Codex:** They can run PowerShell on your machine and show the output, while you approve each step.
- **Chat AI without commands:** It can write the scripts for you to run yourself and read back any error you paste.
<!-- /needs -->

## Rules for running scripts (read first)

These scripts change a live company tenant. Follow these rules every time.

1. **Ask once for what is missing.** You need the tenant domain, what to set up, and for user jobs the list of people (a CSV with DisplayName, UserPrincipalName, Department, LicenseSku, UsageLocation). Never invent names, addresses or licence codes. If the tenant has on-premises Active Directory (a hybrid setup), say that extra setup is needed and stop before any user change.
2. **Test tenant first.** Say clearly that scripts should run in a test tenant or a small test group before the real one.
3. **Read first, change later.** Run the audit (read-only) before any policy or user change.
4. **Confirm before any change.** Before creating or disabling users, changing licences, converting mailboxes, or creating a policy, show the script, say how many accounts it touches, and wait for a clear yes.
5. **Never lock the admins out.** Every Conditional Access policy that covers all users, or that blocks sign-in, must exclude one or two break-glass admin accounts. Ask the person for them. If they have none, tell them to create two cloud-only admin accounts first, with long passwords stored offline, and stop until they have. The sample policy code stops with an error while the break-glass IDs are still placeholders. Never remove that check, and never run a policy with unfilled IDs.
6. **Report-only first.** Every new Conditional Access policy starts as `enabledForReportingButNotEnforced`. Move to `enabled` only after about 48 hours of sign-in log review.
7. **Passwords are never lost or shown in chat.** Temporary passwords go to Windows-encrypted local credential files in a folder the admin chooses. Hand them over safely, then delete the files. Never put passwords in a prompt, chat, log or source control.
8. **No tools, no run.** If you cannot run PowerShell here, write the scripts for the admin to run and ask them to paste back any error. Do not invent output.
9. **Generated scripts follow the same rules.** Scripts from the bundled Python tools must also record temporary passwords, exclude break-glass accounts and start policies in report-only mode. Check each one, and fix it before it is run. The bundled user tool saves a Windows-encrypted credential file before creating each account. Run it with an existing local handover folder chosen by the admin. It stops on an uncertain account or licence result; check the tenant before retrying. Local checks cover encryption and mocked failures, not a live tenant.

---

## Quick Start

### Run a Security Audit

```powershell
Connect-MgGraph -Scopes "Directory.Read.All","Policy.Read.All","AuditLog.Read.All"
Get-MgSubscribedSku | Select-Object SkuPartNumber, ConsumedUnits, @{N="Total";E={$_.PrepaidUnits.Enabled}}
Get-MgPolicyAuthorizationPolicy | Select-Object AllowInvitesFrom, DefaultUserRolePermissions
# Save the findings as CSV files, so you can read them later (these only read, nothing changes)
Get-MgSubscribedSku | Select-Object SkuPartNumber, ConsumedUnits | Export-Csv .\licences.csv -NoTypeInformation
Get-MgIdentityConditionalAccessPolicy | Select-Object DisplayName, State | Export-Csv .\ca_policies.csv -NoTypeInformation
```

### Bulk Provision Users from CSV

```powershell
# Run on Windows, in a test tenant first, after the admin approves the script and row count.
# Keep this skill's scripts folder alongside it. This helper makes only local files, not tenant calls.
. .\scripts\password-handover.ps1
$folder = Get-PasswordHandoverDirectory -Directory (Read-Host 'Existing local folder for encrypted password handover')
$rows = @(Import-Csv .\new_users.csv)
# CSV columns: DisplayName, UserPrincipalName, Department, LicenseSku, UsageLocation.
# Supply the real tenant licence part number and two-letter usage location for every person.
$skus = @(Get-MgSubscribedSku -All -ErrorAction Stop)
foreach ($row in $rows) {
    if (-not $row.UserPrincipalName -or -not $row.LicenseSku -or -not $row.UsageLocation) { throw 'Fill in every required user field before creating anyone.' }
    $skuMatches = @($skus | Where-Object { $_.SkuPartNumber -eq $row.LicenseSku })
    if ($skuMatches.Count -ne 1) { throw 'A licence SKU is missing or ambiguous. No users have been created.' }
}
foreach ($row in $rows) {
    $handover = New-TemporaryUserCredential -UserPrincipalName $row.UserPrincipalName -Directory $folder
    try {
        $passwordProfile = @{ Password = $handover.Credential.GetNetworkCredential().Password; ForceChangePasswordNextSignIn = $true }
        $user = New-MgUser -DisplayName $row.DisplayName -UserPrincipalName $row.UserPrincipalName `
            -Department $row.Department -UsageLocation $row.UsageLocation `
            -MailNickname ($row.UserPrincipalName.Split('@')[0]) -AccountEnabled:$true -PasswordProfile $passwordProfile -ErrorAction Stop
        $sku = ($skus | Where-Object { $_.SkuPartNumber -eq $row.LicenseSku }).SkuId
        Set-MgUserLicense -UserId $user.Id -AddLicenses @(@{ SkuId = $sku }) -RemoveLicenses @() -ErrorAction Stop | Out-Null
        Write-Host "Created and licensed: $($row.UserPrincipalName). Handover file: $($handover.HandoverFile)"
    } catch {
        Write-Warning "Stopped for $($row.UserPrincipalName). Keep $($handover.HandoverFile)."
        throw 'Check the actual account and licence state before retrying. Do not rerun bulk creation blindly.'
    } finally {
        if ($passwordProfile) { $passwordProfile.Password = $null }
        $handover = $null
    }
}
# Each .credential.clixml file encrypts its password for this Windows user and machine (DPAPI).
# Retrieve with Import-Clixml locally, and deliver through an approved password manager.
# Never print passwords or paste them into chat. Delete the files after confirmed delivery.
```

### Create a Conditional Access Policy (MFA for Admins)

```powershell
$adminRoles = (Get-MgDirectoryRole | Where-Object { $_.DisplayName -match "Admin" }).Id
$breakGlassIds = @("<break-glass account 1 object ID>", "<break-glass account 2 object ID>")   # ask the admin for these first
# Stop if the break-glass IDs are still placeholders. Never run this policy with them unfilled.
if ($breakGlassIds | Where-Object { $_ -match '^<' -or [string]::IsNullOrWhiteSpace($_) }) { throw "Fill in both break-glass object IDs first. Stopping so nobody is locked out." }
$policy = @{
    DisplayName = "Require MFA for Admins"
    State = "enabledForReportingButNotEnforced"   # Start in report-only mode
    Conditions = @{ Users = @{ IncludeRoles = $adminRoles; ExcludeUsers = $breakGlassIds } }
    GrantControls = @{ Operator = "OR"; BuiltInControls = @("mfa") }
}
New-MgIdentityConditionalAccessPolicy -BodyParameter $policy
```

### Bundled Python Generators

Three stdlib tools generate the PowerShell artifacts deterministically — prefer them over hand-writing scripts for bulk/repeatable work. Sample input: `sample_input.json`; expected shape: `expected_output.json`.

```bash
# Tenant setup: checklist + DNS records + license plan (JSON), or the full setup script
python3 scripts/tenant_setup.py --config sample_input.json --format json -o tenant_plan.json
python3 scripts/tenant_setup.py --config sample_input.json --format powershell -o tenant_setup.ps1

# User lifecycle: validate first, then generate creation/offboarding scripts
python3 scripts/user_management.py --domain acme.com --action validate --users users.json
python3 scripts/user_management.py --domain acme.com --action create --users users.json -o create_users.ps1
python3 scripts/user_management.py --domain acme.com --action offboard --user-email jane@acme.com -o offboard.ps1

# Admin scripts: CA policy / security audit / bulk licensing
python3 scripts/powershell_generator.py --tenant-domain acme.com --task conditional-access --policy-config policy.json -o ca_policy.ps1
python3 scripts/powershell_generator.py --tenant-domain acme.com --task security-audit -o audit.ps1
python3 scripts/powershell_generator.py --tenant-domain acme.com --task bulk-license --users-csv users.csv --license-sku ENTERPRISEPACK -o licenses.ps1
```

**Password handover (added by AI Blocks):** creation JSON needs `username`, `display_name`, `first_name`, `last_name`, `license_sku` and `usage_location` (the real two-letter country code). On Windows, use `python` if `python3` is not installed. After review and approval, run `./create_users.ps1 -HandoverDirectory <existing-local-folder>`. Keep the encrypted `.credential.clixml` files on that Windows account and machine. Use `Import-Clixml` locally to retrieve a credential for your approved password manager; never print the password or paste it into chat. Do not upload these files. Delete them after confirmed handover.

**Gate:** for user creation, run `--action validate` first and require every entry to report `"is_valid": true` before generating the creation script. Review every generated `.ps1` against the workflows below before running it in the tenant.

---

## Workflows

### Workflow 1: New Tenant Setup

**Step 1: Generate Setup Checklist**

Run `python3 scripts/tenant_setup.py --config tenant.json --format json` and work through `setup_checklist` phase by phase; `dns_records` feeds Step 2 and `license_recommendations` feeds the licensing workflow.

Confirm prerequisites before provisioning:
- Global Admin account created and secured with MFA
- Custom domain purchased and accessible for DNS edits
- License SKUs confirmed (E3 vs E5 feature requirements noted)

**Step 2: Configure and Verify DNS Records**

```powershell
# After adding the domain in the M365 admin center, verify propagation before proceeding
$domain = "company.com"
Resolve-DnsName -Name "_msdcs.$domain" -Type NS -ErrorAction SilentlyContinue
# Also run from a shell prompt:
# nslookup -type=MX company.com
# nslookup -type=TXT company.com   # confirm SPF record
```

Wait for DNS propagation (up to 48 h) before bulk user creation.

**Step 3: Apply Security Baseline**

```powershell
# Disable legacy authentication (blocks Basic Auth protocols)
# Start in report-only mode; switch to "enabled" only after reviewing sign-in logs for about 48 hours.
# Exclude break-glass admin accounts from any policy that blocks sign-in. Ask the admin for their object IDs.
$breakGlassIds = @("<break-glass account 1 object ID>", "<break-glass account 2 object ID>")
# Stop if the break-glass IDs are still placeholders. Never run this policy with them unfilled.
if ($breakGlassIds | Where-Object { $_ -match '^<' -or [string]::IsNullOrWhiteSpace($_) }) { throw "Fill in both break-glass object IDs first. Stopping so nobody is locked out." }
$policy = @{
    DisplayName = "Block Legacy Authentication"
    State = "enabledForReportingButNotEnforced"
    Conditions = @{ ClientAppTypes = @("exchangeActiveSync","other"); Users = @{ IncludeUsers = @("All"); ExcludeUsers = $breakGlassIds } }
    GrantControls = @{ Operator = "OR"; BuiltInControls = @("block") }
}
New-MgIdentityConditionalAccessPolicy -BodyParameter $policy

# Enable unified audit log
Set-AdminAuditLogConfig -UnifiedAuditLogIngestionEnabled $true
```

**Step 4: Provision Users**

```powershell
# Run on Windows, in a test tenant first, after the admin approves the script and row count.
# Keep this skill's scripts folder alongside it. This helper makes only local files, not tenant calls.
. .\scripts\password-handover.ps1
$folder = Get-PasswordHandoverDirectory -Directory (Read-Host 'Existing local folder for encrypted password handover')
$rows = @(Import-Csv .\employees.csv)
# CSV columns: DisplayName, UserPrincipalName, Department, LicenseSku, UsageLocation.
# Supply the real tenant licence part number and two-letter usage location for every person.
$skus = @(Get-MgSubscribedSku -All -ErrorAction Stop)
foreach ($row in $rows) {
    if (-not $row.UserPrincipalName -or -not $row.LicenseSku -or -not $row.UsageLocation) { throw 'Fill in every required user field before creating anyone.' }
    $skuMatches = @($skus | Where-Object { $_.SkuPartNumber -eq $row.LicenseSku })
    if ($skuMatches.Count -ne 1) { throw 'A licence SKU is missing or ambiguous. No users have been created.' }
}
foreach ($row in $rows) {
    $handover = New-TemporaryUserCredential -UserPrincipalName $row.UserPrincipalName -Directory $folder
    try {
        $passwordProfile = @{ Password = $handover.Credential.GetNetworkCredential().Password; ForceChangePasswordNextSignIn = $true }
        $user = New-MgUser -DisplayName $row.DisplayName -UserPrincipalName $row.UserPrincipalName `
            -Department $row.Department -UsageLocation $row.UsageLocation `
            -MailNickname ($row.UserPrincipalName.Split('@')[0]) -AccountEnabled:$true -PasswordProfile $passwordProfile -ErrorAction Stop
        $sku = ($skus | Where-Object { $_.SkuPartNumber -eq $row.LicenseSku }).SkuId
        Set-MgUserLicense -UserId $user.Id -AddLicenses @(@{ SkuId = $sku }) -RemoveLicenses @() -ErrorAction Stop | Out-Null
        Write-Host "Created and licensed: $($row.UserPrincipalName). Handover file: $($handover.HandoverFile)"
    } catch {
        Write-Warning "Stopped for $($row.UserPrincipalName). Keep $($handover.HandoverFile)."
        throw 'Check the actual account and licence state before retrying. Do not rerun bulk creation blindly.'
    } finally {
        if ($passwordProfile) { $passwordProfile.Password = $null }
        $handover = $null
    }
}
# Each .credential.clixml file encrypts its password for this Windows user and machine (DPAPI).
# Retrieve with Import-Clixml locally, and deliver through an approved password manager.
# Never print passwords or paste them into chat. Delete the files after confirmed delivery.
```

**Validation:** Spot-check 3–5 accounts in the M365 admin portal; confirm licenses show "Active."

---

### Workflow 2: Security Hardening

**Step 1: Run Security Audit**

```powershell
Connect-MgGraph -Scopes "Directory.Read.All","Policy.Read.All","AuditLog.Read.All","Reports.Read.All"

# Export Conditional Access policy inventory
Get-MgIdentityConditionalAccessPolicy | Select-Object DisplayName, State |
    Export-Csv .\ca_policies.csv -NoTypeInformation

# Find accounts without MFA registered
$report = Get-MgReportAuthenticationMethodUserRegistrationDetail
$report | Where-Object { -not $_.IsMfaRegistered } |
    Select-Object UserPrincipalName, IsMfaRegistered |
    Export-Csv .\no_mfa_users.csv -NoTypeInformation

Write-Host "Audit complete. Review ca_policies.csv and no_mfa_users.csv."
```

**Step 2: Create MFA Policy (report-only first)**

```powershell
# Uses $breakGlassIds from Workflow 1, Step 3. Define it first if you start here.
$policy = @{
    DisplayName = "Require MFA All Users"
    State = "enabledForReportingButNotEnforced"
    Conditions = @{ Users = @{ IncludeUsers = @("All"); ExcludeUsers = $breakGlassIds } }   # break-glass admin accounts stay out
    GrantControls = @{ Operator = "OR"; BuiltInControls = @("mfa") }
}
New-MgIdentityConditionalAccessPolicy -BodyParameter $policy
```

**Validation:** After 48 h, review Sign-in logs in Entra ID; confirm expected users would be challenged, then change `State` to `"enabled"`.

**Step 3: Review Secure Score**

```powershell
# Retrieve current Secure Score and top improvement actions
Get-MgSecuritySecureScore -Top 1 | Select-Object CurrentScore, MaxScore, ActiveUserCount
Get-MgSecuritySecureScoreControlProfile | Sort-Object -Property ActionType |
    Select-Object Title, ImplementationStatus, MaxScore | Format-Table -AutoSize
```

---

### Workflow 3: User Offboarding

**Step 1: Preview what will change (a printed list only; nothing changes, and it is not a dry run)**

```powershell
$upn = "departing.user@company.com"
$user = Get-MgUser -Filter "userPrincipalName eq '$upn'"

# Identify assigned licenses
$licenses = (Get-MgUserLicenseDetail -UserId $user.Id).SkuId

# Preview only: this prints a list and changes nothing. It is not a real -WhatIf run.
$licenses | ForEach-Object { Write-Host "Would remove SKU: $_" }
Write-Host "Would also block sign-in, revoke sessions, convert the mailbox to shared and remove group memberships for $upn"
# Show the list to the admin and wait for a clear yes before Step 2.
```

**Step 1b: Real dry run (before any removal).** Add `-WhatIf` to each change command in Steps 2 and 3 (for example `Update-MgUser ... -WhatIf`, `Set-MgUserLicense ... -WhatIf`, `Set-Mailbox ... -WhatIf`) and run them once. Or use the offboarding template in `references/powershell-templates.md`, which has a `-WhatIf` switch. Read what it says it would do, and only then ask the admin for the yes.

**Step 2: Block Sign-in and Revoke Sessions (only after the admin says yes)**

```powershell
# Block sign-in
Update-MgUser -UserId $user.Id -AccountEnabled:$false

# Revoke all active tokens
Invoke-MgInvalidateAllUserRefreshToken -UserId $user.Id
Write-Host "Sign-in blocked and sessions revoked for $upn"
```

**Step 3: Execute Offboarding (only after the admin says yes a second time; licence removal and group removal are hard to undo)**

```powershell
# Remove licenses
Set-MgUserLicense -UserId $user.Id -AddLicenses @() -RemoveLicenses $licenses

# Convert mailbox to shared (requires ExchangeOnlineManagement module and a sign-in first)
Connect-ExchangeOnline
Set-Mailbox -Identity $upn -Type Shared

# Remove from all groups
Get-MgUserMemberOf -UserId $user.Id | ForEach-Object {
    $groupId = $_.Id
    try { Remove-MgGroupMemberByRef -GroupId $groupId -DirectoryObjectId $user.Id } catch { Write-Warning "Could not remove $upn from group $groupId - $($_.Exception.Message)" }
}
Write-Host "Offboarding complete for $upn"
```

**Validation:** Confirm in the M365 admin portal that the account shows "Blocked," has no active licenses, and the mailbox type is "Shared."

**Next step:** read any warnings from the group removal and remove those memberships by hand. Then repeat the checks above in the admin portal.

---

## Best Practices

### Tenant Setup

1. Enable MFA before adding users
2. Configure named locations for Conditional Access
3. Use separate admin accounts with PIM
4. Verify custom domains (and DNS propagation) before bulk user creation
5. Apply Microsoft Secure Score recommendations

### Security Operations

1. Start Conditional Access policies in report-only mode
2. Review Sign-in logs for 48 h before enforcing a new policy
3. Never hardcode credentials in scripts — use Azure Key Vault or `Get-Credential`
4. Enable unified audit logging for all operations
5. Conduct quarterly security reviews and Secure Score check-ins

### PowerShell Automation

1. Prefer Microsoft Graph (`Microsoft.Graph` module) over legacy MSOnline
2. Include `try/catch` blocks for error handling
3. Implement `Write-Host`/`Write-Warning` logging for audit trails
4. Use `-WhatIf` or dry-run output before bulk destructive operations
5. Test in a non-production tenant first

---

## Reference Guides

**references/powershell-templates.md**
- Ready-to-use script templates
- Conditional Access policy examples
- Bulk user provisioning scripts
- Security audit scripts

**references/security-policies.md**
- Conditional Access configuration
- MFA enforcement strategies
- DLP and retention policies
- Security baseline settings

**references/troubleshooting.md**
- Common error resolutions
- PowerShell module issues
- Permission troubleshooting
- DNS propagation problems

---

## Limitations

| Constraint | Impact |
|------------|--------|
| Global Admin required | Full tenant setup needs highest privilege |
| API rate limits | Bulk operations may be throttled |
| License dependencies | E3/E5 required for advanced features |
| Hybrid scenarios | On-premises AD needs additional configuration |
| PowerShell prerequisites | Microsoft.Graph module required |

### Required PowerShell Modules

```powershell
Install-Module Microsoft.Graph -Scope CurrentUser
Install-Module ExchangeOnlineManagement -Scope CurrentUser
Install-Module MicrosoftTeams -Scope CurrentUser
```

### Required Permissions

- **Global Administrator** — Full tenant setup
- **User Administrator** — User management
- **Security Administrator** — Security policies
- **Exchange Administrator** — Mailbox management

## Output format

Return the work in this order. Leave out a block that does not apply.

```
Job: <what was asked>
Checked first: <tenant domain, hybrid or cloud-only, break-glass accounts, test tenant>
Script(s): <one named .ps1 block per task, with a one-line comment on what it changes>
Accounts or policies touched: <count>
Passwords file: <where it is saved, and the reminder to hand over safely and delete>
Check after running: <what to look at in the admin portal or sign-in logs>
Next step: <one suggestion>
```

For a security audit, list each finding with its risk and the fix. Do not run a fix without a yes.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Dependency security and licence scanner](https://useaiblocks.com/skills/dependency-risk-scanner). It takes the codebase.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
