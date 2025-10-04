# ========================================
# Queue Factor Visualizer - Auto Launcher
# Developed by Harsh Jain (B54)
# ========================================

param(
    [int]$Port = 8000,
    [switch]$SkipBrowser = $false,
    [switch]$Verbose = $false,
    [switch]$Help = $false
)

# Show help if requested
if ($Help) {
    Write-Host ""
    Write-Host "Queue Factor Visualizer - Auto Launcher" -ForegroundColor Yellow
    Write-Host "Developed by Harsh Jain (B54)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage: .\run.ps1 [OPTIONS]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Options:" -ForegroundColor White
    Write-Host "  -Port PORT           Set the port number (default: 8000)" -ForegroundColor Gray
    Write-Host "  -SkipBrowser         Don't open browser automatically" -ForegroundColor Gray
    Write-Host "  -Verbose             Enable verbose output" -ForegroundColor Gray
    Write-Host "  -Help                Show this help message" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\run.ps1                    # Run with default settings" -ForegroundColor Gray
    Write-Host "  .\run.ps1 -Port 3000         # Run on port 3000" -ForegroundColor Gray
    Write-Host "  .\run.ps1 -SkipBrowser       # Run without opening browser" -ForegroundColor Gray
    Write-Host "  .\run.ps1 -Verbose           # Run with verbose output" -ForegroundColor Gray
    Write-Host ""
    exit 0
}

# Set console colors for better visibility
$Host.UI.RawUI.BackgroundColor = "Black"
$Host.UI.RawUI.ForegroundColor = "White"
Clear-Host

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Queue Factor Visualizer - Auto Launcher" -ForegroundColor Yellow
Write-Host " Developed by Harsh Jain (B54)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Ensure we're in the correct directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Check if we're in the correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "[ERROR] package.json not found. Please run this script from the project root directory." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[INFO] Starting Queue Factor Visualizer setup..." -ForegroundColor Green
Write-Host ""

# ========================================
# Check for Node.js and npm
# ========================================
Write-Host "[1/6] Checking Node.js installation..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Node.js not found"
    }
    Write-Host "[SUCCESS] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed or not in PATH." -ForegroundColor Red
    Write-Host "[INFO] Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "[INFO] Make sure to check 'Add to PATH' during installation." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "npm not found"
    }
    Write-Host "[SUCCESS] npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm is not installed or not in PATH." -ForegroundColor Red
    Write-Host "[INFO] npm should come with Node.js installation." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# ========================================
# Check for Python (for HTTP server fallback)
# ========================================
Write-Host "[2/6] Checking Python installation..." -ForegroundColor Yellow

try {
    $pythonVersion = python --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Python not found"
    }
    Write-Host "[SUCCESS] Python found: $pythonVersion" -ForegroundColor Green
    $usePython = $true
} catch {
    Write-Host "[WARNING] Python not found. Will use Node.js HTTP server instead." -ForegroundColor Yellow
    $usePython = $false
}

Write-Host ""

# ========================================
# Install dependencies
# ========================================
Write-Host "[3/6] Installing/updating dependencies..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies for the first time..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies." -ForegroundColor Red
        Write-Host "[INFO] Please check your internet connection and try again." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[SUCCESS] Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "[INFO] Dependencies already installed. Checking for updates..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[WARNING] Some dependencies may not be up to date, but continuing..." -ForegroundColor Yellow
    } else {
        Write-Host "[SUCCESS] Dependencies updated successfully!" -ForegroundColor Green
    }
}

Write-Host ""

# ========================================
# Check for required files
# ========================================
Write-Host "[4/6] Verifying project files..." -ForegroundColor Yellow

$requiredFiles = @("index.html", "App.tsx", "components")
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "[ERROR] $file not found!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "[SUCCESS] All required files found!" -ForegroundColor Green
Write-Host ""

# ========================================
# Choose server method
# ========================================
Write-Host "[5/6] Setting up local server..." -ForegroundColor Yellow

# Try to use http-server (Node.js) first
try {
    $httpServerVersion = npx http-server --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "http-server not found"
    }
    Write-Host "[SUCCESS] http-server is ready!" -ForegroundColor Green
} catch {
    Write-Host "[INFO] Installing http-server..." -ForegroundColor Cyan
    npm install -g http-server
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[WARNING] Failed to install http-server globally. Trying local installation..." -ForegroundColor Yellow
        try {
            $httpServerVersion = npx http-server --version 2>$null
            if ($LASTEXITCODE -ne 0) {
                throw "http-server not found"
            }
        } catch {
            Write-Host "[ERROR] Cannot install http-server. Please check your internet connection." -ForegroundColor Red
            Read-Host "Press Enter to exit"
            exit 1
        }
    }
}

Write-Host ""

# ========================================
# Launch application
# ========================================
Write-Host "[6/6] Launching Queue Factor Visualizer..." -ForegroundColor Yellow
Write-Host ""

# Check if port is available
$portInUse = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "[WARNING] Port $Port is already in use. Trying port 8001..." -ForegroundColor Yellow
    $Port = 8001
    $portInUse = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($portInUse) {
        Write-Host "[WARNING] Port 8001 is also in use. Trying port 8002..." -ForegroundColor Yellow
        $Port = 8002
    }
}

Write-Host "[INFO] Starting server on port $Port..." -ForegroundColor Cyan
Write-Host "[INFO] Application will open in your default browser automatically." -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Queue Factor Visualizer is starting..." -ForegroundColor Yellow
Write-Host " URL: http://localhost:$Port" -ForegroundColor Green
Write-Host " Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start the server and open browser
if (-not $SkipBrowser) {
    Start-Process "http://localhost:$Port"
}

# Function to cleanup on exit
function Cleanup {
    Write-Host ""
    Write-Host "[INFO] Cleaning up..." -ForegroundColor Yellow
    if ($ServerProcess -and !$ServerProcess.HasExited) {
        Write-Host "[INFO] Stopping server..." -ForegroundColor Yellow
        $ServerProcess.Kill()
        $ServerProcess.WaitForExit(5000)
    }
    Write-Host "[INFO] Server stopped. Thank you for using Queue Factor Visualizer!" -ForegroundColor Green
    Write-Host "[INFO] Developed by Harsh Jain (B54)" -ForegroundColor Cyan
}

# Set up cleanup on script exit
Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

# Start the HTTP server
try {
    Write-Host "[INFO] Starting HTTP server..." -ForegroundColor Cyan
    
    if ($Verbose) {
        $ServerProcess = Start-Process -FilePath "npx" -ArgumentList "http-server", "-p", $Port, "--cors" -PassThru -NoNewWindow
    } else {
        $ServerProcess = Start-Process -FilePath "npx" -ArgumentList "http-server", "-p", $Port, "--cors", "--silent" -PassThru -NoNewWindow
    }
    
    # Wait a moment for server to start
    Start-Sleep -Seconds 2
    
    # Check if server is running
    if ($ServerProcess.HasExited) {
        throw "Server process exited immediately"
    }
    
    Write-Host "[SUCCESS] Server started successfully on port $Port!" -ForegroundColor Green
    Write-Host "[INFO] Server PID: $($ServerProcess.Id)" -ForegroundColor Cyan
    
    # Wait for user to stop the server
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server..." -ForegroundColor Yellow
    $ServerProcess.WaitForExit()
    
} catch {
    Write-Host "[ERROR] Failed to start the server." -ForegroundColor Red
    Write-Host "[INFO] Error: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "[INFO] Please try running the command manually: npx http-server -p $Port --cors" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
} finally {
    Cleanup
}