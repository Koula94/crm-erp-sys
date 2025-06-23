@echo off
echo Testing KADIMAR ERP Backend...
echo.

echo 1. Building the project...
call mvn clean compile
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo 2. Running tests...
call mvn test
if %errorlevel% neq 0 (
    echo Tests failed!
    pause
    exit /b 1
)

echo.
echo 3. Creating JAR file...
call mvn package -DskipTests
if %errorlevel% neq 0 (
    echo Package creation failed!
    pause
    exit /b 1
)

echo.
echo Backend build completed successfully!
echo.
echo To start the backend server, run:
echo java -jar target/erp-backend-0.0.1-SNAPSHOT.jar
echo.
echo The server will be available at: http://localhost:8080
echo Test endpoints:
echo - Health check: http://localhost:8080/api/test/health
echo - Database test: http://localhost:8080/api/test/database
echo - CORS test: http://localhost:8080/api/test/cors
echo.
pause