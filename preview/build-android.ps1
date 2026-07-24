$ErrorActionPreference = "Stop"

$PreviewRoot = $PSScriptRoot
$ProjectRoot = Split-Path $PreviewRoot -Parent
$FrontendRoot = Join-Path $ProjectRoot "frontend"
$AndroidRoot = Join-Path $FrontendRoot "android"
$OutDir = Join-Path $PreviewRoot "android"
$ApkName = "squire-test.apk"
$ApkPath = Join-Path $OutDir $ApkName
$InfoPath = Join-Path $OutDir "BUILD.txt"

$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:PATH"

Write-Host ""
Write-Host "  Squire — build Android" -ForegroundColor Magenta
Write-Host "  ----------------------" -ForegroundColor DarkGray
Write-Host ""

if (-not (Test-Path $AndroidRoot)) {
  Write-Host ">> Pasta android/ nao encontrada. Rodando prebuild..." -ForegroundColor Yellow
  Set-Location $FrontendRoot
  npm run prebuild
}

Write-Host ">> Compilando APK release (pode levar alguns minutos)..." -ForegroundColor Cyan
Set-Location $FrontendRoot
npx expo run:android --variant release --no-install --no-bundler

$releaseApk = Join-Path $AndroidRoot "app\build\outputs\apk\release\app-release.apk"
if (-not (Test-Path $releaseApk)) {
  Write-Host ">> Release nao encontrado, tentando debug..." -ForegroundColor Yellow
  Set-Location $FrontendRoot
  npx expo run:android --variant debug --no-install --no-bundler
  $releaseApk = Join-Path $AndroidRoot "app\build\outputs\apk\debug\app-debug.apk"
}

if (-not (Test-Path $releaseApk)) {
  throw "APK nao gerado. Verifique Android Studio / SDK."
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
Copy-Item -Path $releaseApk -Destination $ApkPath -Force

$info = @(
  "Squire — APK de teste",
  "Gerado: $(Get-Date -Format 'yyyy-MM-dd HH:mm')",
  "",
  "Arquivo: preview/android/squire-test.apk",
  "Pacote:  com.squire.app",
  "",
  "Instalar (com celular/emulador conectado):",
  "  preview\install.bat",
  "",
  "Ou manualmente:",
  "  adb install -r preview\android\squire-test.apk"
)

Set-Content -Path $InfoPath -Value ($info -join [Environment]::NewLine) -Encoding UTF8

Write-Host ""
Write-Host "  APK pronto: preview/android/squire-test.apk" -ForegroundColor Green
Write-Host "  Info:       preview/android/BUILD.txt" -ForegroundColor DarkGray
Write-Host ""
