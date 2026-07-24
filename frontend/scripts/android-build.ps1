# Build Android estavel para Windows (Expo dev client).
# Uso: npm run android:build

param(
  [switch]$FixCache,
  [switch]$NoBundler
)

$ErrorActionPreference = "Stop"

$FrontendRoot = Split-Path $PSScriptRoot -Parent
$AndroidDir = Join-Path $FrontendRoot "android"
$LockFile = Join-Path $AndroidDir ".gradle-build.lock"

$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$env:GRADLE_USER_HOME = "D:\gradle"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:Path"

function Test-DiskSpace {
  $drive = Get-PSDrive C
  $freeGb = [math]::Round($drive.Free / 1GB, 2)
  if ($freeGb -lt 5) {
    Write-Warning "Pouco espaco no disco C: ($freeGb GB livres). Recomendado: >= 5 GB antes do build."
    Write-Warning "Rode: npm run android:clean-cache"
  }
  return $freeGb
}

function Stop-GradleDaemons {
  if (Test-Path (Join-Path $AndroidDir "gradlew.bat")) {
    Push-Location $AndroidDir
    & .\gradlew.bat --stop 2>$null | Out-Null
    Pop-Location
  }
}

function Clear-GradleTransforms {
  $paths = @(
    "$env:GRADLE_USER_HOME\caches\9.3.1\transforms",
    "$env:GRADLE_USER_HOME\caches\build-cache-1",
    "$env:GRADLE_USER_HOME\caches\journal-1"
  )
  foreach ($p in $paths) {
    if (Test-Path $p) {
      Remove-Item $p -Recurse -Force -ErrorAction SilentlyContinue
      Write-Host "[cache] Removido: $p"
    }
  }
}

if (Test-Path $LockFile) {
  $lockAge = (Get-Date) - (Get-Item $LockFile).LastWriteTime
  if ($lockAge.TotalMinutes -lt 45) {
    throw "Build Android ja em andamento (lock: $LockFile). Aguarde ou remova o lock manualmente."
  }
  Remove-Item $LockFile -Force
}

New-Item -ItemType Directory -Force -Path $env:GRADLE_USER_HOME | Out-Null
New-Item -ItemType File -Force -Path $LockFile | Out-Null

try {
  Write-Host "=== Squire - build Android ==="
  Test-DiskSpace | Out-Null
  Stop-GradleDaemons

  if ($FixCache) {
    Write-Host "=== Limpando cache Gradle (transforms) ==="
    Clear-GradleTransforms
  }

  Push-Location $FrontendRoot

  $expoArgs = @("expo", "run:android")
  if ($NoBundler) { $expoArgs += "--no-bundler" }

  Write-Host ("=== Iniciando build. GRADLE_USER_HOME={0} ===" -f $env:GRADLE_USER_HOME)
  & npx @expoArgs
  exit $LASTEXITCODE
}
finally {
  if (Test-Path $LockFile) {
    Remove-Item $LockFile -Force -ErrorAction SilentlyContinue
  }
  Pop-Location -ErrorAction SilentlyContinue
}
