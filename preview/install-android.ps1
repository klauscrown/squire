$ErrorActionPreference = "Stop"

$PreviewRoot = $PSScriptRoot
$ApkPath = Join-Path $PreviewRoot "android\squire-test.apk"

$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$adb = Join-Path $env:ANDROID_HOME "platform-tools\adb.exe"

if (-not (Test-Path $ApkPath)) {
  Write-Host "APK nao encontrado. Rode build-android.bat primeiro." -ForegroundColor Red
  exit 1
}

if (-not (Test-Path $adb)) {
  Write-Host "adb nao encontrado. Instale Android SDK Platform-Tools." -ForegroundColor Red
  exit 1
}

$devices = & $adb devices | Select-String "device$" | Measure-Object
if ($devices.Count -eq 0) {
  Write-Host "Nenhum dispositivo/emulador conectado." -ForegroundColor Yellow
  Write-Host "Conecte um celular (USB debug) ou inicie o emulador e tente de novo."
  exit 1
}

Write-Host ">> Instalando squire-test.apk..." -ForegroundColor Cyan
& $adb install -r $ApkPath

if ($LASTEXITCODE -eq 0) {
  Write-Host ">> Instalado com sucesso." -ForegroundColor Green
  & $adb shell monkey -p com.squire.app -c android.intent.category.LAUNCHER 1 | Out-Null
}
