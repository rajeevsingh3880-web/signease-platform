@echo off
echo Starting SignEase E-Sign Platform with PostgreSQL...
echo Datasource: jdbc:postgresql://localhost:5432/esign_db
cd /d "%~dp0"
call mvnw.cmd spring-boot:run

