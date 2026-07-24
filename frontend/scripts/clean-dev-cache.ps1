# Limpeza segura de caches de desenvolvimento (Windows).
# Uso: npm run android:clean-cache

$ErrorActionPreference = "SilentlyContinue"

$FrontendRoot = Split-Path $PSScriptRoot -Parent
$env:GRADLE_USER_HOME = "D:\gradle"

Write-Host "=== Espaco ANTES ==="
$d = Get-PSDrive C
Write-Host ("Livre: {0:N2} GB" -f ($d.Free / 1GB))

if (Test-Path "$FrontendRoot\android\gradlew.bat") {
  Push-Location "$FrontendRoot\android"
  & .\gradlew.bat --stop 2>$null
  Pop-Location
}

$targets = @(
  "$env:LOCALAPPDATA\Temp",
  "$env:TEMP",
  "$env:LOCALAPPDATA\Temp\cursor-sandbox-cache",
  "$env:GRADLE_USER_HOME\caches",
  "$env:LOCALAPPDATA\npm-cache",
  "$FrontendRoot\android\app\build",
  "$FrontendRoot\android\build",
  "$FrontendRoot\android\app\.cxx",
  "$FrontendRoot\android\.gradle"
)

foreach ($p in $targets) {
  if (-not (Test-Path $p)) { continue }
  Get-ChildItem $p -Force | Remove-Item -Recurse -Force
  Write-Host "[ok] $p"
}

npm cache clean --force 2>$null
Clear-RecycleBin -Force 2>$null

Write-Host "=== Espaco DEPOIS ==="
$d2 = Get-PSDrive C
Write-Host ("Livre: {0:N2} GB" -f ($d2.Free / 1GB))
