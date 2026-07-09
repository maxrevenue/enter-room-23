@echo off
cd /d "C:\Users\Alec\Desktop\enter-room-23-new\enter-room-23-new\frontend"
echo [1/3] Restoring dotnet tools...
"C:\Users\Alec\AppData\Local\Microsoft\dotnet\dotnet.exe" tool restore
if %errorlevel% neq 0 (
  echo ERROR: dotnet tool restore failed
  exit /b %errorlevel%
)

echo.
echo [2/3] Running Fable 5.6.0 compilation check...
"C:\Users\Alec\AppData\Local\Microsoft\dotnet\dotnet.exe" fable src/App.fsproj -o build --noCache
if %errorlevel% neq 0 (
  echo ERROR: Fable compilation failed
  exit /b %errorlevel%
)

echo.
echo [3/3] Build passed - Fable compilation successful!
exit /b 0