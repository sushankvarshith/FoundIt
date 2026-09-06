@echo off
title FoundIt MySQL Database Setup
echo =====================================================================
echo                Setting up FoundIt Database in MySQL                  
echo =====================================================================

set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe
if not exist "%MYSQL_PATH%" (
    set MYSQL_PATH=mysql
)

echo Checking MySQL client...
"%MYSQL_PATH%" --version
if %errorlevel% neq 0 (
    echo [WARNING] MySQL client not found. Please ensure XAMPP MySQL is running!
    pause
    exit /b %errorlevel%
)

echo.
echo 1. Executing database/schema.sql (Creating database and tables)...
"%MYSQL_PATH%" -u root < "%~dp0database\schema.sql"

echo 2. Executing database/seed_data.sql (Populating realistic sample data)...
"%MYSQL_PATH%" -u root < "%~dp0database\seed_data.sql"

echo.
echo =====================================================================
echo [SUCCESS] Database 'foundit_db' setup complete!
echo Tables: users, items, claims, comments, chat_messages, notifications.
echo =====================================================================
pause
