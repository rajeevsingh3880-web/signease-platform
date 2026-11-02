@echo off
setlocal
set "DIR=%~dp0"
set "MVN_CMD=%DIR%.mvn-bin\bin\mvn.cmd"

if exist "%MVN_CMD%" (
    call "%MVN_CMD%" %*
) else (
    echo Maven binary not found in .mvn-bin, attempting system mvn...
    mvn %*
)

