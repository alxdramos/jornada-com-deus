@echo off
set msg=%*
if "%msg%"=="" set msg=backup: update

git status
git add .
git commit -m "%msg%"
git push

pause
