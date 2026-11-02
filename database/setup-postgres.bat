@echo off
echo ===================================================
echo Setting up PostgreSQL Database for SignEase...
echo ===================================================

echo Creating database 'esign_db'...
psql -U postgres -c "CREATE DATABASE esign_db;"

echo Applying schema and seed data...
psql -U postgres -d esign_db -f "%~dp0schema.sql"
psql -U postgres -d esign_db -f "%~dp0seed-data.sql"

echo.
echo Database setup completed successfully!
pause

