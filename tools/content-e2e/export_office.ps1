param([Parameter(Mandatory=$true)][string]$OutputRoot)
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath $OutputRoot).Path
$app = New-Object -ComObject PowerPoint.Application
try {
    foreach ($name in @('presentation','case-competition')) {
        $inputPath = Join-Path $root "artifacts/$name.pptx"
        $deck = $app.Presentations.Open($inputPath, -1, 0, 0)
        try {
            $target = Join-Path $root "qa/$name-office"
            New-Item -ItemType Directory -Force -Path $target | Out-Null
            $deck.Export($target, 'PNG', 1600, 900)
            $deck.SaveAs((Join-Path $root "artifacts/$name.pdf"), 32)
            Write-Output "$name : $($deck.Slides.Count) slides exported by Microsoft PowerPoint"
        } finally { $deck.Close() }
    }
} finally { $app.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($app) }
if (Test-Path -LiteralPath (Join-Path $root 'artifacts/research-paper.docx')) {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    try {
        $doc = $word.Documents.Open((Join-Path $root 'artifacts/research-paper.docx'), $false, $true)
        try {
            $doc.ExportAsFixedFormat((Join-Path $root 'artifacts/research-paper.pdf'), 17)
            Write-Output "research-paper : $($doc.ComputeStatistics(2)) pages exported by Microsoft Word"
        } finally { $doc.Close(0) }
    } finally { $word.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($word) }
}
