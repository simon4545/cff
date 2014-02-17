@echo off
SET BuildPath=%cd%
cd ../

set ExecPath=%cd%\Build\lib
set NodePath=%ExecPath%\node-x86.exe
if /i "%PROCESSOR_IDENTIFIER:~0,3%" neq "x86" SET NodePath=%ExecPath%\node-64.exe


if exist "%NodePath%" (
	start /wait /B "" "%NodePath%" %BuildPath%\server.js
) else (
	echo "Node Env is not exist!"
	rem exit
)
pause
