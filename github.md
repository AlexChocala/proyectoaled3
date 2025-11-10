# actualizar hosting

* [informacion](https://www.youtube.com/watch?v=bPUCguRUEtM)
# OPCION 1 (actualizacion automatizada)

## 1. crea el en github action el workflows (.github/workflows/main.yaml) desde github

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - firebase   # o la rama que uses para producción

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 22.15

      - name: Install dependencies
        run: npm install

      - name: contruir Angular app mediante node
        run: npm run build -- --configuration production

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: "${{ secrets.GITHUB_TOKEN }}"
          firebaseServiceAccount: "${{ secrets.FIREBASE_SERVICE_ACCOUNT }}"
          channelId: live
          projectId: algoritmo3-8ee11
```
## 2. registrate en tu proyecto:

```bash
firebase cli:ci

```
* procede a registrarte en tu cuenta, luego copia el token de firebase que te genero.

## 4. En github settings de TU PROYECTO EN TU RAMA agrega secrets, el token de firebase (FIREBASE_SERVICE_ACCOUNT) con el respectivo nombre

--

# OPCION 2: MANUAL

## 1. Ejecuta:
```
ng build --configuration production

```

## 2. si no iniciaste el servidor hosting:

```bash
firebase init hosting
```

## 3. En el archivo firebase.json, la propiedad "public" debe apuntar a la carpeta de salida de Angular, por ejemplo:

```json
{
  "hosting": {
    "public": "dist/nombre-de-tu-app",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```

## 4. finalmente despligua la app en el hosting

```bash
firebase deploy --only hosting
```
