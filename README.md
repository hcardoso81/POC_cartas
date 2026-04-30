# POC Cartas

Prototype with Expo, React Native, TypeScript, and a small REST backend for animating a Spanish deck.

## Run

```powershell
npm install
npm run server
npm run mobile
```

The mobile app uses `EXPO_PUBLIC_API_URL=http://localhost:4000` by default. For a physical phone, set it to your computer LAN IP.

cd C:\repos\poc_cartas
npm run server
En otra terminal:

powershell

cd C:\repos\poc_cartas
$env:EXPO_PUBLIC_API_URL="http://192.168.1.7:4000"
npm --workspace apps/mobile run start -- --lan --clear