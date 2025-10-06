# Firebase Emulators - Desarrollo Local

Guía para desarrollar con Firebase Emulators en lugar de la base de datos de producción.

## ¿Por qué usar Emulators?

✅ **Desarrollo seguro**: No afectas datos de producción
✅ **Velocidad**: Sin latencia de red
✅ **Testing**: Datos pueden ser eliminados/recreados fácilmente
✅ **Offline**: Trabaja sin conexión a internet
✅ **Costos**: Sin cargos de Firebase

## Setup Inicial

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

Verifica la instalación:
```bash
firebase --version
```

### 2. Login a Firebase

```bash
firebase login
```

### 3. Configurar .env.local

```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local y activa el emulator
# NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

O crea `.env.local` manualmente:

```env
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

## Uso Diario

### Opción 1: Script Automático (Recomendado)

```bash
./start-emulators.sh
```

Este script:
- ✅ Verifica que Firebase CLI esté instalado
- ✅ Verifica autenticación
- ✅ Crea .env.local si no existe
- ✅ Inicia emulators con import/export automático

### Opción 2: Manual

```bash
firebase emulators:start --import=./emulator-data --export-on-exit
```

**Flags importantes:**
- `--import=./emulator-data`: Carga datos guardados previamente
- `--export-on-exit`: Guarda datos al cerrar (Ctrl+C)

## Desarrollo

### Iniciar el Proyecto

**Terminal 1 - Emulators:**
```bash
./start-emulators.sh
```

**Terminal 2 - Next.js:**
```bash
npm run dev
```

### URLs Importantes

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Emulator UI** | http://localhost:4000 | Interfaz visual |
| **Next.js** | http://localhost:3000 | Tu aplicación |
| **Firestore** | localhost:8080 | Emulador Firestore |
| **Auth** | localhost:9099 | Emulador Auth |

## Gestión de Datos

### Ver Datos

Abre http://localhost:4000 para ver:
- Usuarios registrados
- Documentos en Firestore
- Estructura de colecciones

### Seed de Datos Iniciales

Los datos seed se cargan automáticamente desde:
- `src/lib/firebase/seed.ts`

Para resetear datos:
1. Detén emulators (Ctrl+C)
2. Borra `emulator-data/`
3. Reinicia emulators

### Exportar Datos

Cuando detienes emulators con Ctrl+C, los datos se guardan automáticamente en:
```
emulator-data/
├── auth_export/
└── firestore_export/
```

### Importar Datos de Producción

```bash
# Exportar desde producción
firebase firestore:export gs://lore-weaver-rt9pc.appspot.com/exports/$(date +%Y%m%d)

# Descargar
gsutil -m cp -r gs://lore-weaver-rt9pc.appspot.com/exports/YYYYMMDD ./prod-data

# Importar a emulators
firebase emulators:start --import=./prod-data
```

⚠️ **Cuidado**: Datos de producción pueden contener información sensible.

## Troubleshooting

### Error: "Port already in use"

Otro proceso usa los puertos. Opciones:

**1. Matar procesos:**
```bash
lsof -ti:8080,9099,4000 | xargs kill -9
```

**2. Cambiar puertos en `firebase.json`:**
```json
{
  "emulators": {
    "firestore": { "port": 8081 },
    "auth": { "port": 9100 },
    "ui": { "port": 4001 }
  }
}
```

### Error: "Firebase project not found"

```bash
# Verifica proyecto actual
firebase use

# Selecciona proyecto correcto
firebase use lore-weaver-rt9pc
```

### Emulator no se conecta

Verifica en la consola del navegador:
```
🔧 Connecting to Firebase Emulators...
✅ Firestore Emulator connected (localhost:8080)
✅ Auth Emulator connected (localhost:9099)
```

Si no ves esto:
1. Verifica que `.env.local` existe
2. Verifica que `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true`
3. Reinicia Next.js (`npm run dev`)

### Datos no persisten

Asegúrate de:
1. Usar `--export-on-exit` flag
2. Detener con Ctrl+C (no `kill -9`)
3. Verificar que `emulator-data/` se crea

## Workflow Recomendado

### Desarrollo de Features

```bash
# 1. Inicia emulators con datos limpios
rm -rf emulator-data
./start-emulators.sh

# 2. Desarrolla tu feature
# 3. Prueba en http://localhost:3000

# 4. Detén emulators (Ctrl+C) - datos se guardan
```

### Testing

```bash
# 1. Inicia con datos de testing
./start-emulators.sh

# 2. Ejecuta tests
npm test

# 3. No guardes datos de test al salir
# (Ctrl+C no exporta si no usas --export-on-exit)
```

### Deploy

```bash
# 1. Prueba en emulator
./start-emulators.sh

# 2. Si todo funciona, cambia a producción
# Edita .env.local:
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false

# 3. Reinicia Next.js
npm run dev

# 4. Prueba contra producción

# 5. Deploy
npm run build
firebase deploy --only hosting
```

## Diferencias con Producción

| Aspecto | Emulator | Producción |
|---------|----------|------------|
| **Datos** | Local, temporal | Persistente, real |
| **Latencia** | ~0ms | 50-200ms |
| **Reglas** | Se validan localmente | Se validan en Firebase |
| **Auth** | Usuarios ficticios | Usuarios reales |
| **Storage** | No emulado | Cloud Storage real |

⚠️ **Nota**: Storage (archivos) NO tiene emulator. Si tu app sube archivos, debes usar producción o mockear storage.

## Integración con Backend (DM Santa v3)

El backend **NO usa emulators**, siempre conecta a producción:
- Orchestrator escucha Firestore producción
- Backend lee/escribe Firestore producción

**Flujo mixto:**
```
Frontend (localhost:3000) → Emulator
Backend (Docker) → Producción Firestore
```

Para testing completo necesitas:
1. Frontend en emulator
2. Backend en emulator (requiere config adicional)

## Comandos Útiles

```bash
# Ver estado de emulators
firebase emulators:start --only firestore

# Solo UI (si emulators ya corren)
firebase emulators:ui

# Limpiar todo
rm -rf emulator-data
firebase emulators:start

# Exportar datos sin iniciar
firebase emulators:export ./backup-data
```

## Referencias

- [Firebase Emulator Docs](https://firebase.google.com/docs/emulator-suite)
- [Firestore Emulator API](https://firebase.google.com/docs/emulator-suite/connect_firestore)
- [Auth Emulator](https://firebase.google.com/docs/emulator-suite/connect_auth)

## Próximos Pasos

- [ ] Agregar seed script específico para emulators
- [ ] Configurar CI/CD con emulators
- [ ] Agregar emulator para Storage (si es necesario)
- [ ] Crear datos de prueba realistas
