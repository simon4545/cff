@echo off
SET BuildPath=%cd%
cd ../
set ExecPath=%cd%\Build\lib
set NodePath=%ExecPath%\node-x86.exe
if /i "%PROCESSOR_IDENTIFIER:~0,3%" neq "x86" SET NodePath=%ExecPath%\node-64.exe
echo %NodePath%
if exist "%NodePath%" (
	start /wait /B "" "%NodePath%" %BuildPath%\build.js
) else (
	echo "Node Env is not exist!"
	rem exit
)
pause
