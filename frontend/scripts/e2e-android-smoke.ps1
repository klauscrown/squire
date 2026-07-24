# Smoke E2E no emulador Android (dev client + Metro 8083)
$ErrorActionPreference = "Stop"

$FrontendRoot = Split-Path $PSScriptRoot -Parent
$env:ANDROID_HOME = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$env:Path = "$env:ANDROID_HOME\platform-tools;$env:Path"

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }

function Test-Metro {
  return [bool](Get-NetTCPConnection -LocalPort 8083 -State Listen -ErrorAction SilentlyContinue)
}

function Invoke-Tap([int]$x, [int]$y) {
  adb shell input tap $x $y | Out-Null
  Start-Sleep -Milliseconds 800
}

Write-Step "Verificando emulador"
$devices = adb devices | Select-String "device$"
if (-not $devices) { throw "Nenhum emulador conectado. Inicie Pixel_8_Pro." }

Write-Step "Verificando Metro 8083"
if (-not (Test-Metro)) {
  throw "Metro não está em http://localhost:8083. Rode: npx expo start --dev-client --port 8083"
}

Write-Step "adb reverse + abrir app"
adb reverse tcp:8083 tcp:8083 | Out-Null
$metroUrl = [uri]::EscapeDataString("http://127.0.0.1:8083")
adb shell am force-stop com.squire.app | Out-Null
Start-Sleep -Seconds 2
adb logcat -c | Out-Null
adb shell am start -a android.intent.action.VIEW -d "exp+squire://expo-development-client/?url=$metroUrl" | Out-Null

Write-Step "Aguardando bundle (~75s na primeira carga)"
Start-Sleep -Seconds 75

Write-Step "Fluxo: login explorador (se necessário)"
# Botão "Entrar como Explorador" — região inferior central
Invoke-Tap 672 2550
Start-Sleep -Seconds 4

Write-Step "Tab Crônicas"
Invoke-Tap 504 2920
Start-Sleep -Seconds 3

Write-Step "Tab Mestre (profile)"
Invoke-Tap 840 2920
Start-Sleep -Seconds 3

Write-Step "Tab Home"
Invoke-Tap 168 2920
Start-Sleep -Seconds 2

Write-Step "Atalho Rolar dados (grid superior esquerdo)"
Invoke-Tap 350 1750
Start-Sleep -Seconds 2
# Rolar d20
Invoke-Tap 672 2100
Start-Sleep -Seconds 1
# Fechar sheet (X canto superior)
Invoke-Tap 1250 450
Start-Sleep -Seconds 2

Write-Step "Scroll feed Últimas Runas + toque"
adb shell input swipe 672 2200 672 1200 400 | Out-Null
Start-Sleep -Seconds 1
Invoke-Tap 672 2400
Start-Sleep -Seconds 3
adb shell input keyevent 4 | Out-Null
Start-Sleep -Seconds 2

Write-Step "Crônicas -> primeira campanha (se existir)"
Invoke-Tap 504 2920
Start-Sleep -Seconds 2
Invoke-Tap 672 900
Start-Sleep -Seconds 4
adb shell input keyevent 4 | Out-Null

Write-Step "Logcat - erros JS/fatais"
$errors = adb logcat -d -t 400 2>&1 | Select-String -Pattern "ReactNativeJS.*Error|FATAL EXCEPTION|Cannot find native module|RedBox|Unhandled" 
if ($errors) {
  Write-Host "ERROS encontrados:" -ForegroundColor Red
  $errors | Select-Object -Last 15 | ForEach-Object { Write-Host $_.Line }
} else {
  Write-Host "Nenhum erro crítico no logcat." -ForegroundColor Green
}

Write-Step "Concluído"
Write-Host "Revise o emulador visualmente. Coordenadas: Pixel_8_Pro 1344x2992."
