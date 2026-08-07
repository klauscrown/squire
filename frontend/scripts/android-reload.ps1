# Recarrega o dev client Android apontando para Metro 8083 (bundle fresco).
# Uso: npm run android:reload
#      npm run android:reload:clean

param(
  [switch]$ClearData
)

$ErrorActionPreference = "Stop"

$env:ANDROID_HOME = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$env:Path = "$env:ANDROID_HOME\platform-tools;$env:Path"
$Port = 8083
$Package = "com.squire.app"

function Test-Metro {
  return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

function Get-LanIp {
  $ip = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object {
      $_.IPAddress -notlike '127.*' -and
      $_.IPAddress -notlike '169.254.*' -and
      $_.PrefixOrigin -ne 'WellKnown'
    } |
    Select-Object -First 1 -ExpandProperty IPAddress
  return $ip
}

function Invoke-Tap([int]$x, [int]$y) {
  adb shell input tap $x $y | Out-Null
  Start-Sleep -Milliseconds 600
}

function Dismiss-DevClientOverlays {
  # Intro "Continue" (primeira abertura apos clear data)
  Invoke-Tap 540 2168
  Start-Sleep -Seconds 1
  # Fechar overlay do dev menu (X canto superior direito)
  Invoke-Tap 970 1081
  Start-Sleep -Seconds 2
}

Write-Host "==> Verificando dispositivo Android" -ForegroundColor Cyan
$deviceLines = @(adb devices -l | Select-String "device\s")
if (-not $deviceLines.Count) {
  throw "Nenhum dispositivo/emulador Android conectado."
}

$isEmulator = [bool]($deviceLines | Select-String "emulator")

Write-Host "==> Verificando Metro na porta $Port" -ForegroundColor Cyan
if (-not (Test-Metro)) {
  throw "Metro nao esta rodando em http://localhost:$Port. Rode: npm run start:clean"
}

if ($isEmulator) {
  $metroHost = "http://10.0.2.2:$Port"
  Write-Host "==> Emulador: $metroHost" -ForegroundColor Cyan
} else {
  adb reverse "tcp:$Port" "tcp:$Port" | Out-Null
  $metroHost = "http://127.0.0.1:$Port"
  $lanIp = Get-LanIp
  Write-Host "==> Dispositivo fisico (USB): $metroHost" -ForegroundColor Cyan
  if ($lanIp) {
    Write-Host "    Wi-Fi: http://${lanIp}:$Port" -ForegroundColor DarkGray
  }
}

if ($ClearData) {
  Write-Host "==> Limpando dados do app" -ForegroundColor Cyan
  adb shell pm clear $Package | Out-Null
  Start-Sleep -Seconds 2
}

Write-Host "==> Abrindo dev client" -ForegroundColor Cyan
$metroUrl = [uri]::EscapeDataString($metroHost)
adb shell am force-stop $Package | Out-Null
Start-Sleep -Seconds 1
adb shell am start -a android.intent.action.VIEW -d "exp+squire://expo-development-client/?url=$metroUrl" | Out-Null

Write-Host "==> Aguardando bundle (~35s)..." -ForegroundColor Cyan
Start-Sleep -Seconds 35

if ($ClearData) {
  Write-Host "==> Fechando menu do desenvolvedor" -ForegroundColor Cyan
  Dismiss-DevClientOverlays
}

Write-Host ""
Write-Host "Pronto. A tela de login deve estar visivel." -ForegroundColor Green
Write-Host "Se ainda ver o menu dev: toque Continue e depois X (fechar)." -ForegroundColor Yellow
