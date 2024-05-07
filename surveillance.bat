@echo off
echo Démarrage de WampServer...
start "" "C:\wamp64\wampmanager.exe"

timeout /t 10

echo Démarrage du projet Next.js...
cd "C:\surveillance-app"
start npm start

echo Ouverture de Google Chrome sur localhost:3000...
start chrome http://localhost:3000
