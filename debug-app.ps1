# ============================================================
#  E2match debug runner
#  - kills any process on Metro ports (8081/8082/8083)
#  - clears the logcat buffer
#  - opens a NEW window with the logcat filter for YOUR app
#  - starts Metro in THIS window (keep it open!)
#  Then you just tap the app on your phone.
# ============================================================

$ErrorActionPreference = 'SilentlyContinue'

#  ADB is in the PATH for this script session
$env:Path = "$($env:USERPROFILE)\AppData\Local\Android\Sdk\platform-tools;$env:Path"
Write-Host ">> Temporarily adding Android SDK platform-tools to PATH..." -ForegroundColor Yellow

# 1. Kill stale Metro / port holders
Write-Host ">> Killing any process on 8081/8082/8083..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 8081, 8082, 8083 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
Get-Process node, metro*, java -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

# 1.5. Restart ADB server to fix 'device offline' issues
Write-Host ">> Restarting ADB server..." -ForegroundColor Yellow
& adb kill-server
& adb start-server
Start-Sleep -Seconds 2 # Give ADB a moment to find devices
Write-Host ">> Connected devices:" -ForegroundColor Yellow
& adb devices


# 1.6. Find the active device to target
Write-Host ">> Searching for an active device..." -ForegroundColor Yellow
$deviceLines = & adb devices | Select-String -Pattern "`tdevice$"
$deviceSerial = $null

if ($deviceLines) {
    # If multiple devices are found, use the first one.
    $deviceSerial = ($deviceLines[0].ToString()).Split("`t")[0].Trim()
}

if (-not $deviceSerial) {
    Write-Host "!! ERROR: No active Android device found." -ForegroundColor Red
    Write-Host "!! Please ensure one device is connected and online, then try again." -ForegroundColor Red
    exit 1
}

Write-Host ">> Targeting device: $deviceSerial" -ForegroundColor Green

# 2. Clear logcat on the target device
Write-Host ">> Clearing logcat on $deviceSerial..." -ForegroundColor Yellow
& adb -s $deviceSerial logcat -c

# 3. Open a NEW PowerShell window that streams ONLY your app's log
Write-Host ">> Opening logcat window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Write-Host '  --- E2MATCH APP LOG (device: $deviceSerial) ---' -ForegroundColor Cyan; adb -s $deviceSerial logcat ReactNative:V ReactNativeJS:V AndroidRuntime:E *:S"
)

# 4. Start Metro in a NEW window.
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  The script will now open TWO new windows:" -ForegroundColor Green
Write-Host "    1. Metro Bundler" -ForegroundColor Green
Write-Host "    2. Application Log" -ForegroundColor Green
Write-Host "  It will then automatically launch the app on your device." -ForegroundColor Green
Write-Host "  You don't need to press 'a' or tap the app icon." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Write-Host '--- METRO BUNDLER ---' -ForegroundColor Magenta; npx expo start --dev-client --port 8081"
)

# 5. Wait for Metro to initialize, then launch the app.
Write-Host ">> Waiting 15s for Metro to start before launching the app..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ">> Launching app on $deviceSerial..." -ForegroundColor Yellow
& adb -s $deviceSerial shell monkey -p com.e2soft.e2match -c android.intent.category.LAUNCHER 1

Write-Host ">> Done! The script has finished. You can close this window." -ForegroundColor Green
