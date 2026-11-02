@echo off
echo Starting SignEase E-Sign Platform in DEV Mode (In-Memory Database)...
cd /d "%~dp0"
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev

