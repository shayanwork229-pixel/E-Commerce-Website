@echo off
cd /d "%~dp0"

start "" cmd /k "npm run dev"

set "URL=http://localhost:8080"
for /l %%I in (1,1,20) do (
    curl -fsS "%URL%" >nul 2>&1
    if not errorlevel 1 goto open
    timeout /t 1 /nobreak >nul
)

:open
start "" "%URL%"
