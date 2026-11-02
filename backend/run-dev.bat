@echo off
echo Starting SignEase Spring Boot Backend (In-Memory DEV Mode)...
cd /d "%~dp0"
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev

