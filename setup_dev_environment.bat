git reset HEAD source.zip
@echo off
echo ========================================
echo Cynaps Dev Environment Setup
echo ========================================
echo.

echo [1/7] Checking Docker...
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running
    exit /b 1
)
echo OK: Docker is running
echo.

echo [2/7] Starting infrastructure...
docker-compose -f docker-compose.dev.yml down >nul 2>&1
docker-compose -f docker-compose.dev.yml up -d
echo.

echo [3/7] Waiting for services (10 seconds)...
timeout /t 10 /nobreak >nul
echo.

echo [4/7] Installing Python dependencies...
pip install --quiet boto3 django-storages redis celery psycopg2-binary
echo.

echo [5/6] Loading environment variables...
set CYNAPS_BASE_DATA_DIR=%CD%\data
for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
    set "%%a=%%b"
)
echo.

echo [6/6] Running database migrations...
python cynaps/manage.py migrate --noinput
echo.

echo [7/7] Collecting static files...
python cynaps/manage.py collectstatic --noinput --clear
echo.

echo ========================================
echo DEVELOPMENT ENVIRONMENT READY!
echo ========================================
echo.
echo Access Points:
echo   Cynaps:     http://localhost:8080
echo   MinIO Console:    http://localhost:9001 (User: minioadmin, Pass: minioadmin123)
echo.
echo Database: PostgreSQL at localhost:5432 (cynaps / devpassword123)
echo Storage:  MinIO at localhost:9000 (bucket: cynaps-dev)
echo.
echo Starting Cynaps server...
echo.
python cynaps/manage.py runserver 127.0.0.1:8080



