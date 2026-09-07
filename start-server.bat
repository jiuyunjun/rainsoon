@echo off
chcp 65001 >nul
cd /d "%~dp0"

set PORT=8000

where python >nul 2>nul
if %errorlevel%==0 (
    echo Starting server at http://localhost:%PORT%/
    start "" http://localhost:%PORT%/
    python -m http.server %PORT%
    goto :eof
)

where py >nul 2>nul
if %errorlevel%==0 (
    echo Starting server at http://localhost:%PORT%/
    start "" http://localhost:%PORT%/
    py -m http.server %PORT%
    goto :eof
)

echo Python not found. Please install Python first.
pause
