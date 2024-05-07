@echo off
echo Démarrage de WampServer...
start "" "C:\wamp64\wampmanager.exe"

timeout /t 10

echo Démarrage du projet Next.js...
cd "C:\surveillance-app"
npm start
