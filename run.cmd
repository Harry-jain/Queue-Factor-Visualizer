@echo off
setlocal enabledelayedexpansion

REM ========================================
REM Queue Factor Visualizer - Auto Launcher
REM Developed by Harsh Jain (B54)
REM ========================================

REM Set console colors
color 0F

REM Parse command line arguments
set PORT=8000
set SKIP_BROWSER=false
set VERBOSE=false
set HELP=false

:parse_args
if "%~1"=="" goto :args_done
if /i "%~1"=="-p" (
    set PORT=%~2
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--port" (
    set PORT=%~2
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--skip-browser" (
    set SKIP_BROWSER=true
    shift
    goto :parse_args
)
if /i "%~1"=="-v" (
    set VERBOSE=true
    shift
    goto :parse_args
)
if /i "%~1"=="--verbose" (
    set VERBOSE=true
    shift
    goto :parse_args
)
if /i "%~1"=="-h" (
    set HELP=true
    shift
    goto :parse_args
)
if /i "%~1"=="--help" (
    set HELP=true
    shift
    goto :parse_args
)
echo Unknown option: %~1
goto :show_help

:args_done
if "%HELP%"=="true" goto :show_help

REM Clear screen and show header
cls
echo.
echo ========================================
echo  Queue Factor Visualizer - Auto Launcher
echo  Developed by Harsh Jain (B54)
echo ========================================
echo.

REM Ensure we run from the script directory
cd /d "%~dp0"

REM Check if we're in the correct directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

echo [INFO] Starting Queue Factor Visualizer setup...
echo.

REM ========================================
REM Check for Node.js and npm
REM ========================================
echo [1/6] Checking Node.js installation...

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo [INFO] Please install Node.js from https://nodejs.org/
    echo [INFO] Make sure to check "Add to PATH" during installation.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [SUCCESS] Node.js found: !NODE_VERSION!
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed or not in PATH.
    echo [INFO] npm should come with Node.js installation.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [SUCCESS] npm found: !NPM_VERSION!
)

echo.

REM ========================================
REM Check for Python (for HTTP server fallback)
REM ========================================
echo [2/6] Checking Python installation...

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Python not found. Will use Node.js HTTP server instead.
    set USE_PYTHON=false
) else (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo [SUCCESS] Python found: !PYTHON_VERSION!
    set USE_PYTHON=true
)

echo.

REM ========================================
REM Install dependencies
REM ========================================
echo [3/6] Installing/updating dependencies...

if not exist "node_modules" (
    echo [INFO] Installing dependencies for the first time...
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        echo [INFO] Please check your internet connection and try again.
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies installed successfully!
) else (
    echo [INFO] Dependencies already installed. Checking for updates...
    npm install
    if %errorlevel% neq 0 (
        echo [WARNING] Some dependencies may not be up to date, but continuing...
    ) else (
        echo [SUCCESS] Dependencies updated successfully!
    )
)

echo.

REM ========================================
REM Check for required files
REM ========================================
echo [4/6] Verifying project files...

if not exist "index.html" (
    echo [ERROR] index.html not found!
    pause
    exit /b 1
)

if not exist "App.tsx" (
    echo [ERROR] App.tsx not found!
    pause
    exit /b 1
)

if not exist "components" (
    echo [ERROR] components directory not found!
    pause
    exit /b 1
)

echo [SUCCESS] All required files found!

echo.

REM ========================================
REM Choose server method
REM ========================================
echo [5/6] Setting up local server...

REM Try to use http-server (Node.js) first
npx http-server --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Installing http-server globally...
    npm install -g http-server
    if %errorlevel% neq 0 (
        echo [WARNING] Failed to install http-server globally. Trying local installation...
        npx http-server --version >nul 2>&1
        if %errorlevel% neq 0 (
            echo [ERROR] Cannot install http-server. Please check your internet connection.
            pause
            exit /b 1
        )
    )
)

echo [SUCCESS] http-server is ready!

echo.

REM ========================================
REM Launch application
REM ========================================
echo [6/6] Launching Queue Factor Visualizer...
echo.

REM Set the port
set PORT=8000

REM Check if port is available
netstat -an | findstr ":%PORT%" >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Port %PORT% is already in use. Trying port 8001...
    set PORT=8001
    netstat -an | findstr ":%PORT%" >nul 2>&1
    if %errorlevel% equ 0 (
        echo [WARNING] Port 8001 is also in use. Trying port 8002...
        set PORT=8002
    )
)

echo [INFO] Starting server on port %PORT%...
echo [INFO] Application will open in your default browser automatically.
echo.
echo ========================================
echo  Queue Factor Visualizer is starting...
echo  URL: http://localhost:%PORT%
echo  Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start the server and open browser
start "" "http://localhost:%PORT%"
npx http-server -p %PORT% -o --cors

REM If we reach here, the server was stopped
echo.
echo [INFO] Server stopped. Thank you for using Queue Factor Visualizer!
echo [INFO] Developed by Harsh Jain (B54)
pause
exit /b 0

:show_help
echo.
echo Queue Factor Visualizer - Auto Launcher
echo Developed by Harsh Jain (B54)
echo.
echo Usage: run.cmd [OPTIONS]
echo.
echo Options:
echo   -p, --port PORT        Set the port number (default: 8000)
echo   --skip-browser        Don't open browser automatically
echo   -v, --verbose         Enable verbose output
echo   -h, --help           Show this help message
echo.
echo Examples:
echo   run.cmd                    # Run with default settings
echo   run.cmd -p 3000           # Run on port 3000
echo   run.cmd --skip-browser    # Run without opening browser
echo   run.cmd -v                # Run with verbose output
echo.
pause
exit /b 0