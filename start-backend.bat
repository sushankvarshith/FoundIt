@echo off
title FoundIt Java REST Backend (Port 8080)
echo =====================================================================
echo                Starting FoundIt Core Java REST API                   
echo =====================================================================
echo Checking Java compiler...
javac -version
if %errorlevel% neq 0 (
    echo [ERROR] javac compiler not found in PATH. Please ensure JDK 21+ is installed.
    pause
    exit /b %errorlevel%
)

if not exist "backend\bin" mkdir backend\bin

echo Compiling Java source files...
javac -cp "backend\lib\mysql-connector-j.jar" -d backend\bin backend\src\server\models\*.java backend\src\server\utils\*.java backend\src\server\db\*.java backend\src\server\dao\*.java backend\src\server\handlers\*.java backend\src\server\FoundItServer.java

if %errorlevel% neq 0 (
    echo [ERROR] Java compilation failed!
    pause
    exit /b %errorlevel%
)

echo.
echo Starting FoundItServer on http://localhost:8080 ...
echo Database: MySQL localhost:3306 (foundit_db) with In-Memory fallback.
echo.
java -cp "backend\bin;backend\lib\mysql-connector-j.jar" server.FoundItServer
pause
