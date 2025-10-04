@echo off
setlocal

REM Ensure we run from the script directory
cd /d "%~dp0"

REM Use PowerShell with ExecutionPolicy Bypass to run the main script
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run.ps1" %*

endlocal

