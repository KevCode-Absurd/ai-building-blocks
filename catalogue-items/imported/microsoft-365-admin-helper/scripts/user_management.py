"""
User lifecycle management module for Microsoft 365.
Handles user creation, modification, license assignment, and deprovisioning.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
from pathlib import Path
import re


def powershell_literal(value: Any) -> str:
    """Quote input as PowerShell data, never as an interpolated expression."""
    value = str(value)
    if any(ord(c) < 32 for c in value):
        raise ValueError("User fields must not contain control characters")
    return "'" + value.replace("'", "''") + "'"


class UserLifecycleManager:
    """Manage Microsoft 365 user lifecycle operations."""

    def __init__(self, domain: str):
        """
        Initialize with tenant domain.

        Args:
            domain: Primary domain name for the tenant
        """
        if not re.fullmatch(r"[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*\.[A-Za-z0-9]+", domain):
            raise ValueError("Use a tenant DNS domain, without commands or control characters")
        self.domain = domain
        self.operations_log = []

    def generate_user_creation_script(self, users: List[Dict[str, Any]]) -> str:
        """Generate an admin-reviewed Windows script; no tenant calls run in Python."""
        helper = Path(__file__).with_name('password-handover.ps1').read_text(encoding='utf-8')
        rows = []
        fields = ('UserPrincipalName', 'DisplayName', 'GivenName', 'Surname', 'JobTitle', 'Department', 'LicenseSku', 'UsageLocation')
        for user in users:
            validation = self.validate_user_data(user)
            if not validation['is_valid']:
                raise ValueError('; '.join(validation['errors']))
            values = (f"{user['username']}@{self.domain}", user.get('display_name', ''),
                      user.get('first_name', ''), user.get('last_name', ''), user.get('job_title', ''),
                      user.get('department', ''), user['license_sku'], user['usage_location'])
            rows.append('    @{\n' + '\n'.join(f'        {key} = {powershell_literal(value)}' for key, value in zip(fields, values)) + '\n    }')
        script = """# Added by AI Blocks: save Windows-encrypted handover credentials before any account is created.
# Review this script and the user count. Obtain the tenant owner's approval before running.
[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$HandoverDirectory)
$ErrorActionPreference = 'Stop'
""" + helper + """
$HandoverDirectory = Get-PasswordHandoverDirectory -Directory $HandoverDirectory
Connect-MgGraph -Scopes 'User.ReadWrite.All', 'Organization.Read.All', 'LicenseAssignment.ReadWrite.All'
try {
$users = @(
""" + '\n'.join(rows) + """
)
# Resolve every requested licence before creating anyone. Never substitute a default licence.
$skus = @(Get-MgSubscribedSku -All -ErrorAction Stop)
foreach ($user in $users) {
    $matches = @($skus | Where-Object { $_.SkuPartNumber -eq $user.LicenseSku })
    if ($matches.Count -ne 1) { throw 'A licence SKU is missing or ambiguous. No users have been created.' }
    $user.SkuId = $matches[0].SkuId
}
foreach ($user in $users) {
    # If saving fails, stop here, before the account API call.
    $handover = New-TemporaryUserCredential -UserPrincipalName $user.UserPrincipalName -Directory $HandoverDirectory
    $stage = 'account creation'
    try {
        $profile = @{ Password = $handover.Credential.GetNetworkCredential().Password; ForceChangePasswordNextSignIn = $true }
        $newUser = New-MgUser -UserPrincipalName $user.UserPrincipalName `
            -DisplayName $user.DisplayName -GivenName $user.GivenName -Surname $user.Surname `
            -JobTitle $user.JobTitle -Department $user.Department -UsageLocation $user.UsageLocation `
            -PasswordProfile $profile -AccountEnabled:$true `
            -MailNickname ($user.UserPrincipalName -split '@')[0] -ErrorAction Stop
        $stage = 'licence assignment'
        Set-MgUserLicense -UserId $newUser.Id -AddLicenses @(@{ SkuId = $user.SkuId }) -RemoveLicenses @() -ErrorAction Stop | Out-Null
        Write-Host "Created and licensed: $($user.UserPrincipalName). Handover file: $($handover.HandoverFile)"
    } catch {
        # Do not echo API exceptions: they may contain request details, including credentials.
        Write-Warning "Stopped during $stage for $($user.UserPrincipalName). Keep $($handover.HandoverFile)."
        throw 'Check the actual account and licence state before any retry. Do not rerun bulk creation blindly.'
    } finally {
        if ($profile) { $profile.Password = $null }
        $handover = $null
    }
}
} finally {
    Disconnect-MgGraph -ErrorAction SilentlyContinue | Out-Null
}
# The admin retrieves each credential with Import-Clixml on this Windows account and machine.
# Share passwords through an approved password manager, never chat or email to the new account.
# Delete the handover files after confirmed secure delivery. Never commit them to source control.
"""
        return script

    def generate_user_offboarding_script(self, user_email: str) -> str:
        """
        Generate script for secure user offboarding.

        Args:
            user_email: Email address of user to offboard

        Returns:
            PowerShell script for offboarding
        """
        script = f"""<#
.SYNOPSIS
    User Offboarding Script - Secure Deprovisioning

.DESCRIPTION
    Securely offboards the user supplied below after owner review.
    - Revokes access and signs out all sessions
    - Converts mailbox to shared (preserves emails)
    - Removes licenses
    - Archives OneDrive
    - Documents all actions
#>

# Connect to services
Connect-MgGraph -Scopes "User.ReadWrite.All", "Directory.ReadWrite.All"
Connect-ExchangeOnline

$userEmail = {powershell_literal(user_email)}
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

Write-Host "Starting offboarding for: $userEmail" -ForegroundColor Cyan

try {{
    # Step 1: Get user details
    $user = Get-MgUser -UserId $userEmail
    Write-Host "✓ User found: $($user.DisplayName)" -ForegroundColor Green

    # Step 2: Disable sign-in (immediately revokes access)
    Update-MgUser -UserId $user.Id -AccountEnabled $false
    Write-Host "✓ Account disabled - user cannot sign in" -ForegroundColor Green

    # Step 3: Revoke all active sessions
    Revoke-MgUserSignInSession -UserId $user.Id
    Write-Host "✓ All active sessions revoked" -ForegroundColor Green

    # Step 4: Remove from all groups (except retained groups)
    $groups = Get-MgUserMemberOf -UserId $user.Id
    foreach ($group in $groups) {{
        if ($group.AdditionalProperties["@odata.type"] -eq "#microsoft.graph.group") {{
            Remove-MgGroupMemberByRef -GroupId $group.Id -DirectoryObjectId $user.Id
            Write-Host "  - Removed from group: $($group.AdditionalProperties.displayName)"
        }}
    }}
    Write-Host "✓ Removed from all groups" -ForegroundColor Green

    # Step 5: Remove mobile devices
    $devices = Get-MgUserRegisteredDevice -UserId $user.Id
    foreach ($device in $devices) {{
        Remove-MgUserRegisteredDeviceByRef -UserId $user.Id -DirectoryObjectId $device.Id
        Write-Host "  - Removed device: $($device.AdditionalProperties.displayName)"
    }}
    Write-Host "✓ All mobile devices removed" -ForegroundColor Green

    # Step 6: Convert mailbox to shared (preserves emails, removes license requirement)
    Set-Mailbox -Identity $userEmail -Type Shared
    Write-Host "✓ Mailbox converted to shared mailbox" -ForegroundColor Green

    # Step 7: Set up email forwarding (optional - update recipient as needed)
    # Set-Mailbox -Identity $userEmail -ForwardingAddress "manager@{self.domain}"
    # Write-Host "✓ Email forwarding configured" -ForegroundColor Green

    # Step 8: Set auto-reply
    $autoReplyMessage = @"
Thank you for your email. This mailbox is no longer actively monitored as the employee has left the organization.
For assistance, please contact: support@{self.domain}
"@

    Set-MailboxAutoReplyConfiguration -Identity $userEmail `
        -AutoReplyState Enabled `
        -InternalMessage $autoReplyMessage `
        -ExternalMessage $autoReplyMessage
    Write-Host "✓ Auto-reply configured" -ForegroundColor Green

    # Step 9: Remove licenses (wait a bit after mailbox conversion)
    Start-Sleep -Seconds 30
    $licenses = Get-MgUserLicenseDetail -UserId $user.Id
    if ($licenses) {{
        $licenseParams = @{{
            RemoveLicenses = @($licenses.SkuId)
        }}
        Set-MgUserLicense -UserId $user.Id -BodyParameter $licenseParams
        Write-Host "✓ Licenses removed" -ForegroundColor Green
    }}

    # Step 10: Hide from GAL (Global Address List)
    Set-Mailbox -Identity $userEmail -HiddenFromAddressListsEnabled $true
    Write-Host "✓ Hidden from Global Address List" -ForegroundColor Green

    # Step 11: Document offboarding
    $offboardingReport = @{{
        UserEmail = $userEmail
        DisplayName = $user.DisplayName
        OffboardingDate = Get-Date
        MailboxStatus = "Converted to Shared"
        LicensesRemoved = $licenses.SkuPartNumber -join ", "
        AccountDisabled = $true
        SessionsRevoked = $true
    }}

    $offboardingReport | Export-Csv -Path "Offboarding_${{userEmail}}_$timestamp.csv" -NoTypeInformation

    Write-Host "`n✓ Offboarding completed successfully!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Archive user's OneDrive data (available for 30 days by default)"
    Write-Host "2. Review shared mailbox permissions"
    Write-Host "3. After 30 days, consider permanently deleting the account if no longer needed"
    Write-Host "4. Review and transfer any owned resources (Teams, SharePoint sites, etc.)"

}} catch {{
    Write-Host "✗ Error during offboarding: $_" -ForegroundColor Red
}}

# Disconnect
Disconnect-MgGraph
Disconnect-ExchangeOnline -Confirm:$false
"""
        return script

    def generate_license_assignment_recommendations(self, user_role: str, department: str) -> Dict[str, Any]:
        """
        Recommend appropriate license based on user role and department.

        Args:
            user_role: Job title or role
            department: Department name

        Returns:
            License recommendations with justification
        """
        # License decision matrix
        if any(keyword in user_role.lower() for keyword in ['ceo', 'cto', 'cfo', 'executive', 'director', 'vp']):
            return {
                'recommended_license': 'Microsoft 365 E5',
                'justification': 'Executive level - requires advanced security, compliance, and full feature set',
                'features_needed': [
                    'Advanced Threat Protection',
                    'Azure AD P2 with PIM',
                    'Advanced compliance and eDiscovery',
                    'Phone System and Audio Conferencing'
                ],
                'monthly_cost': 57.00
            }

        elif any(keyword in user_role.lower() for keyword in ['admin', 'it', 'security', 'compliance']):
            return {
                'recommended_license': 'Microsoft 365 E5',
                'justification': 'IT/Security role - requires full admin and security capabilities',
                'features_needed': [
                    'Advanced security and compliance tools',
                    'Azure AD P2',
                    'Privileged Identity Management',
                    'Advanced analytics'
                ],
                'monthly_cost': 57.00
            }

        elif department.lower() in ['legal', 'finance', 'hr', 'accounting']:
            return {
                'recommended_license': 'Microsoft 365 E3',
                'justification': 'Handles sensitive data - requires enhanced security and compliance',
                'features_needed': [
                    'Data Loss Prevention',
                    'Information Protection',
                    'Azure AD P1',
                    'Advanced compliance tools'
                ],
                'monthly_cost': 36.00
            }

        elif any(keyword in user_role.lower() for keyword in ['manager', 'lead', 'supervisor']):
            return {
                'recommended_license': 'Microsoft 365 Business Premium',
                'justification': 'Management role - needs full productivity suite with security',
                'features_needed': [
                    'Desktop Office apps',
                    'Advanced security',
                    'Device management',
                    'Teams advanced features'
                ],
                'monthly_cost': 22.00
            }

        elif any(keyword in user_role.lower() for keyword in ['part-time', 'contractor', 'temporary', 'intern']):
            return {
                'recommended_license': 'Microsoft 365 Business Basic',
                'justification': 'Temporary/part-time role - web apps and basic features sufficient',
                'features_needed': [
                    'Web versions of Office apps',
                    'Teams',
                    'OneDrive (1TB)',
                    'Exchange (50GB)'
                ],
                'monthly_cost': 6.00
            }

        else:
            return {
                'recommended_license': 'Microsoft 365 Business Standard',
                'justification': 'Standard office worker - full productivity suite',
                'features_needed': [
                    'Desktop Office apps',
                    'Teams',
                    'OneDrive (1TB)',
                    'Exchange (50GB)',
                    'SharePoint'
                ],
                'monthly_cost': 12.50
            }

    def generate_group_membership_recommendations(self, user: Dict[str, Any]) -> List[str]:
        """
        Recommend security and distribution groups based on user attributes.

        Args:
            user: User dictionary with role, department, location

        Returns:
            List of recommended group names
        """
        recommended_groups = []

        # Department-based groups
        department = user.get('department', '').lower()
        if department:
            recommended_groups.append(f"DL-{department.capitalize()}")  # Distribution list
            recommended_groups.append(f"SG-{department.capitalize()}")  # Security group

        # Location-based groups
        location = user.get('location', '').lower()
        if location:
            recommended_groups.append(f"SG-Location-{location.capitalize()}")

        # Role-based groups
        job_title = user.get('job_title', '').lower()
        if any(keyword in job_title for keyword in ['manager', 'director', 'vp', 'executive']):
            recommended_groups.append("SG-Management")

        if any(keyword in job_title for keyword in ['admin', 'administrator']):
            recommended_groups.append("SG-ITAdmins")

        # Functional groups
        if user.get('needs_sharepoint_access'):
            recommended_groups.append(f"SG-SharePoint-{department.capitalize()}")

        if user.get('needs_project_access'):
            recommended_groups.append("SG-ProjectUsers")

        return recommended_groups

    def validate_user_data(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate user data before provisioning.

        Args:
            user_data: User information dictionary

        Returns:
            Validation results with errors and warnings
        """
        errors = []
        warnings = []

        # Required fields
        required_fields = ['first_name', 'last_name', 'username', 'display_name', 'license_sku', 'usage_location']
        for field in required_fields:
            if not user_data.get(field):
                errors.append(f"Missing required field: {field}")

        if user_data.get('usage_location') and not re.fullmatch(r'[A-Z]{2}', str(user_data['usage_location'])):
            errors.append('Usage location must be a two-letter uppercase country code')

        # Username validation
        username = user_data.get('username', '')
        if username:
            if ' ' in username:
                errors.append("Username cannot contain spaces")
            if not username.islower():
                warnings.append("Username should be lowercase")
            if len(username) < 3:
                errors.append("Username must be at least 3 characters")

        # Email validation
        email = user_data.get('email')
        if email and '@' not in email:
            errors.append("Invalid email format")

        # Display name
        if not user_data.get('display_name'):
            first = user_data.get('first_name', '')
            last = user_data.get('last_name', '')
            warnings.append(f"Display name not provided, will use: {first} {last}")

        # License validation
        if not user_data.get('license_sku'):
            warnings.append("No license specified, will need manual assignment")

        return {
            'is_valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }


def main():
    """CLI entry point."""
    import argparse
    import json

    parser = argparse.ArgumentParser(
        description="Generate M365 user lifecycle PowerShell scripts and license/group recommendations"
    )
    parser.add_argument("--domain", required=True, help="Primary tenant domain (e.g. acme.com)")
    parser.add_argument("--action", required=True, choices=["create", "offboard", "validate", "recommend"],
                        help="create = bulk user creation script; offboard = offboarding script; "
                             "validate = check user data; recommend = license + group recommendations")
    parser.add_argument("--users", help="Users JSON file (list of user objects) for create/validate/recommend")
    parser.add_argument("--user-email", help="User email for offboard action")
    parser.add_argument("--output", "-o", help="Output file (default: stdout)")
    args = parser.parse_args()

    manager = UserLifecycleManager(args.domain)

    if args.action == "offboard":
        if not args.user_email:
            parser.error("--user-email is required for --action offboard")
        result = manager.generate_user_offboarding_script(args.user_email)
    else:
        if not args.users:
            parser.error("--users is required for this action")
        with open(args.users, "r", encoding="utf-8") as f:
            users = json.load(f)
        if isinstance(users, dict):
            users = users.get("users", [users])
        if args.action == "create":
            result = manager.generate_user_creation_script(users)
        elif args.action == "validate":
            result = json.dumps([manager.validate_user_data(u) for u in users], indent=2)
        else:  # recommend
            result = json.dumps([{
                "user": u.get("email", u.get("first_name", "unknown")),
                "licenses": manager.generate_license_assignment_recommendations(
                    u.get("role", "staff"), u.get("department", "general")),
                "groups": manager.generate_group_membership_recommendations(u),
            } for u in users], indent=2)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(result)
    else:
        print(result)


if __name__ == "__main__":
    main()
