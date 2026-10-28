# Added by AI Blocks (2026-10-28), under this item's MIT licence.
# Local Windows credential storage only. This file makes no tenant or network calls.
function Get-PasswordHandoverDirectory {
    param([Parameter(Mandatory=$true)][string]$Directory)
    if ([Environment]::OSVersion.Platform -ne [PlatformID]::Win32NT) {
        throw 'Stop: password handover requires Windows DPAPI. No accounts have been created by this helper.'
    }
    $folder = Get-Item -LiteralPath $Directory -ErrorAction Stop
    if (-not $folder.PSIsContainer -or $folder.PSProvider.Name -ne 'FileSystem') {
        throw 'Choose an existing local folder for password handover.'
    }
    $drive = [System.IO.DriveInfo]::new([System.IO.Path]::GetPathRoot($folder.FullName))
    if ($drive.DriveType -ne [System.IO.DriveType]::Fixed -or
        ($folder.Attributes -band [System.IO.FileAttributes]::ReparsePoint)) {
        throw 'Choose a local fixed-drive folder, rather than a network path or linked folder.'
    }
    return $folder.FullName
}

function New-TemporaryUserCredential {
    param(
        [Parameter(Mandatory=$true)][string]$UserPrincipalName,
        [Parameter(Mandatory=$true)][string]$Directory
    )
    $folder = Get-PasswordHandoverDirectory -Directory $Directory
    $bytes = New-Object byte[] 24
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($bytes) } finally { $rng.Dispose() }
    # 192 random bits. The tail meets common password complexity rules.
    $password = [Convert]::ToBase64String($bytes) + '!a1'
    $credential = [System.Management.Automation.PSCredential]::new(
        $UserPrincipalName, (ConvertTo-SecureString -String $password -AsPlainText -Force)
    )
    $file = Join-Path $folder ([Guid]::NewGuid().ToString('N') + '.credential.clixml')
    # On Windows this encrypts the password with DPAPI, for this Windows user and machine.
    # Persist BEFORE account creation: even an uncertain API response cannot lose the password.
    $credential | Export-Clixml -LiteralPath $file -NoClobber -ErrorAction Stop
    $saved = Import-Clixml -LiteralPath $file -ErrorAction Stop
    if ($saved.UserName -cne $UserPrincipalName -or $saved.GetNetworkCredential().Password -cne $password) {
        throw 'Password handover could not be verified. Stop before creating an account.'
    }
    # Caller must assign this result. Never print it or pass it to chat/logs.
    return [pscustomobject]@{ Credential = $credential; HandoverFile = $file }
}
