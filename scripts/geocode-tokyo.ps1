param([int]$Skip = 0, [int]$Take = 35)
$ErrorActionPreference = 'Continue'
$inputFile = Join-Path $PSScriptRoot '..\outputs\tokyo-architecture-35-google-my-maps.csv'
$outputFile = Join-Path $PSScriptRoot "..\outputs\tokyo-architecture-35-coordinates-$Skip.json"
$rows = Import-Csv $inputFile | Select-Object -Skip $Skip -First $Take
$results = foreach ($row in $rows) {
  $query = [uri]::EscapeDataString($row.'Google Maps search query')
  try {
    $match = Invoke-RestMethod -Uri "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=$query" -Headers @{ 'User-Agent' = 'Codex-Tokyo-Map/1.0' }
    if ($match -and $match.Count -gt 0) {
      [pscustomobject]@{ Number=[int]$row.Number; Building=$row.Building; Architect=$row.'Architect(s)'; Neighborhood=$row.Neighborhood; Query=$row.'Google Maps search query'; Lat=[double]$match[0].lat; Lon=[double]$match[0].lon; Found=$match[0].display_name }
    } else {
      [pscustomobject]@{ Number=[int]$row.Number; Building=$row.Building; Architect=$row.'Architect(s)'; Neighborhood=$row.Neighborhood; Query=$row.'Google Maps search query'; Lat=$null; Lon=$null; Found=$null }
    }
  } catch {
    [pscustomobject]@{ Number=[int]$row.Number; Building=$row.Building; Architect=$row.'Architect(s)'; Neighborhood=$row.Neighborhood; Query=$row.'Google Maps search query'; Lat=$null; Lon=$null; Found=$null }
  }
  Start-Sleep -Seconds 1
}
$results | ConvertTo-Json -Depth 3 | Set-Content -Encoding utf8 $outputFile
$results | Where-Object { $null -eq $_.Lat } | Select-Object Number,Building | Format-Table -AutoSize
