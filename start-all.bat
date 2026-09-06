@echo off
title FoundIt Full-Stack Launcher
echo =====================================================================
echo                Starting FoundIt Full-Stack System                    
echo =====================================================================
echo 1. Starting Java REST Backend (Port 8080)...
start "FoundIt Java Backend" cmd /c "%~dp0start-backend.bat"

echo 2. Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak >nul

echo 3. Starting Web Frontend Server (Port 3000)...
start "FoundIt Frontend" cmd /c "%~dp0start-frontend.bat"

echo.
echo =====================================================================
echo FoundIt Full-Stack application is starting up!
echo   Frontend URL: http://localhost:3000
echo   Backend URL:  http://localhost:8080/api/health
echo =====================================================================
timeout /t 5 >nul
start http://localhost:3000
