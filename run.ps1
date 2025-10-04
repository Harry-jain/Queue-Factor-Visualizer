Param(
    [switch]$ForceReinstall
)

$ErrorActionPreference = 'Stop'

function Write-Info($msg) { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Ok($msg) { Write-Host "[ OK ] $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg) { Write-Host "[ERR ] $msg" -ForegroundColor Red }

# Ensure we run from the script directory
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Path)

# Check Node and npm
try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    Write-Ok "Node $nodeVersion, npm $npmVersion detected"
} catch {
    Write-Err "Node.js and npm are required. Install from https://nodejs.org and retry."
    exit 1
}

# Install dependencies if needed
$needInstall = $ForceReinstall -or !(Test-Path node_modules)
if ($needInstall) {
    Write-Info "Installing dependencies (npm ci if lockfile exists, else npm install)..."
    if (Test-Path package-lock.json) {
        npm ci --no-fund --no-audit
    } else {
        npm install --no-fund --no-audit
    }
    Write-Ok "Dependencies installed"
} else {
    Write-Info "Dependencies already present (use -ForceReinstall to reinstall)"
}

# Start dev server
Write-Info "Starting dev server (Vite) on http://localhost:3000 ..."

# Use Start-Process to detach; capture output to a log
$logPath = Join-Path $PWD 'dev-server.log'
if (Test-Path $logPath) { Remove-Item $logPath -Force }

$startInfo = @{
    FilePath = 'npm'
    ArgumentList = @('run','dev','--silent')
    RedirectStandardOutput = $true
    RedirectStandardError = $true
    CreateNoWindow = $true
    UseNewWindow = $false
    PassThru = $true
}

$proc = Start-Process @startInfo

# Async pump logs to file
Start-Job -ScriptBlock {
    Param($Id,$Path)
    $p = Get-Process -Id $Id
    $fs = [System.IO.File]::Open($Path,[System.IO.FileMode]::Append,[System.IO.FileAccess]::Write,[System.IO.FileShare]::ReadWrite)
    $sw = New-Object System.IO.StreamWriter($fs)
    try {
        while (-not $p.HasExited) {
            Start-Sleep -Milliseconds 300
        }
    } finally {
        $sw.Flush(); $sw.Dispose(); $fs.Dispose()
    }
} -ArgumentList $proc.Id,$logPath | Out-Null

# Wait for server readiness
$url = 'http://localhost:3000'
$deadline = (Get-Date).AddMinutes(2)
while ((Get-Date) -lt $deadline) {
    try {
        $code = (Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 2).StatusCode
        if ($code -ge 200 -and $code -lt 500) { break }
    } catch {
        # ignore until ready
    }
    Start-Sleep -Milliseconds 500
}

try {
    $code = (Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 2).StatusCode
} catch {
    $code = $null
}

if (-not $code) {
    Write-Warn "Server did not respond in time. Check dev-server.log for details."
} else {
    Write-Ok "Server is up at $url"
    try { Start-Process $url | Out-Null } catch { Write-Warn "Could not open browser automatically." }
}

Write-Info "Press Ctrl+C in this window to stop the background server if it's attached."

