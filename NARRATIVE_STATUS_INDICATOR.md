# Narrative Status Indicator

Indicador visual en tiempo real del progreso de generación de narrativa.

## Vista Previa

```
┌─────────────────────────────────┐
│ [🔄] Generando narrativa...     │
│      Kael                        │
└─────────────────────────────────┘
```

Aparece en la **esquina inferior izquierda** durante:
- Generación de narrativa inicial
- Procesamiento de cualquier contenido AI

## Estados

| Estado | Imagen | Animación | Descripción |
|--------|--------|-----------|-------------|
| `idle` | loading1.png | No | Sin actividad (no se muestra) |
| `init` | loading1-4.png | Ciclo 300ms | Preparando generación |
| `in_progress` | loading1-4.png | Ciclo 300ms | Gemini generando |
| `completed_no_tts` | tts.png | No | Narrativa lista, generando audio |
| `completed` | success.png | No | Todo listo (se oculta en 5s) |
| `error` | error.png | No | Error ocurrido |

**Imágenes**: Ubicadas en `public/ui/status/` con fondo transparente
**Loading Animation**: Cicla entre loading1.png → loading2.png → loading3.png → loading4.png cada 300ms

## Uso

### 1. Agregar al Layout Principal

```tsx
// app/layout.tsx o app/dashboard/layout.tsx
import NarrativeStatusIndicator from '@/components/NarrativeStatusIndicator';

export default function Layout({ children }) {
  const { user } = useAuth();

  return (
    <div>
      {children}

      {/* Indicador de estado (global) */}
      {user?.campaignId && (
        <NarrativeStatusIndicator campaignId={user.campaignId} />
      )}
    </div>
  );
}
```

### 2. Agregar Animación CSS (si no existe)

```css
/* app/globals.css */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
```

## Cómo Funciona

### Backend → Firestore

El orchestrator actualiza `campaign_status/{campaign_id}`:

```python
# orchestrator/campaign_creator.py

# 1. INIT
status_tracker.mark_narrative_init(campaign_id, character_name)

# 2. IN_PROGRESS
status_tracker.mark_narrative_in_progress(campaign_id, character_name)

# 3. COMPLETED_NO_TTS
status_tracker.mark_narrative_completed_no_tts(campaign_id)

# 4. COMPLETED (TTS worker)
status_ref.update({'narrative_status': 'completed'})
```

### Firestore → Frontend

```typescript
// Real-time listener
onSnapshot(
  doc(db, 'campaign_status', campaignId),
  (snapshot) => {
    const data = snapshot.data();
    setStatus(data.narrative_status);
  }
);
```

## Estructura de Datos

### Firestore: `campaign_status/{campaign_id}`

```json
{
  "narrative_status": "in_progress",
  "message": "Gemini creando narrativa personalizada para Kael...",
  "character_name": "Kael",
  "started_at": "2025-01-06T12:00:00Z",
  "last_updated": "2025-01-06T12:00:15Z"
}
```

### Cuando completa:

```json
{
  "narrative_status": "completed",
  "message": "¡Tu aventura está lista para comenzar!",
  "character_name": "Kael",
  "started_at": "2025-01-06T12:00:00Z",
  "completed_at": "2025-01-06T12:01:30Z",
  "last_updated": "2025-01-06T12:01:30Z"
}
```

### Si falla:

```json
{
  "narrative_status": "error",
  "message": "Error al generar narrativa",
  "error": "Gemini timeout after 60s",
  "character_name": "Kael",
  "started_at": "2025-01-06T12:00:00Z",
  "failed_at": "2025-01-06T12:01:00Z"
}
```

## Flujo Completo

```
1. GM crea personaje
   ↓
2. Orchestrator detecta → status: 'init'
   Frontend: 🔄 Inicializando...
   ↓
3. Orchestrator llama Gemini → status: 'in_progress'
   Frontend: ✨ Generando narrativa... (pulsa)
   ↓
4. Gemini termina → status: 'completed_no_tts'
   Frontend: 🎭 Generando audio...
   ↓
5. TTS termina → status: 'completed'
   Frontend: ✅ ¡Listo! (desaparece en 5s)
```

## Personalización

### Cambiar Posición

```tsx
// De bottom-left a bottom-right:
<div className="fixed bottom-4 right-4 z-50">
```

### Cambiar Velocidad de Animación

```tsx
// De 300ms a 500ms por frame:
setInterval(() => {
  setLoadingFrame((prev) => (prev % 4) + 1);
}, 500); // Más lento
```

### Cambiar Tamaño de Imagen

```tsx
// De w-12 h-12 a w-16 h-16:
<div className="relative w-16 h-16">
  <Image src={imageSrc} alt={currentStatus} fill className="object-contain" />
</div>
```

### Cambiar Tiempo de Auto-Ocultado

```tsx
// De 5s a 3s:
const timer = setTimeout(() => setIsVisible(false), 3000);
```

### Agregar Sonido

```tsx
useEffect(() => {
  if (status?.narrative_status === 'completed') {
    const audio = new Audio('/sounds/success.mp3');
    audio.play();
  }
}, [status]);
```

### Personalizar Mensajes

```tsx
const CUSTOM_MESSAGES: Record<NarrativeStatus, string> = {
  init: 'Preparando magia...',
  in_progress: 'El Dungeon Master está pensando...',
  completed_no_tts: 'Casi listo, añadiendo voz...',
  completed: '¡Tu aventura comienza!',
  error: 'Algo salió mal...',
};
```

### Usar Imágenes Personalizadas

Reemplaza las imágenes en `public/ui/status/`:
- `loading1.png` a `loading4.png`: Frames de animación de carga
- `tts.png`: Estado generando audio
- `success.png`: Estado completado
- `error.png`: Estado de error

Todas las imágenes deben tener fondo transparente (PNG con alpha)

## Testing

### En Local (con Emulators)

1. Inicia emulators y backend
2. Crea un nuevo GM
3. Crea un personaje
4. Verás el indicador aparecer automáticamente

### Forzar Estado (para testing UI)

```tsx
// Para testear el componente sin backend
<NarrativeStatusIndicator
  campaignId="test_campaign"
  mockStatus={{
    narrative_status: 'in_progress',
    message: 'Testing...',
    character_name: 'Test Character'
  }}
/>
```

## Troubleshooting

### Indicador no aparece

1. Verifica que `campaignId` sea válido
2. Verifica Firestore listener en consola:
```tsx
console.log('Listening to:', campaignId);
```

3. Verifica que exista el documento:
```bash
# Firestore UI (localhost:4000)
campaign_status/{campaign_id}
```

### Indicador se queda pegado

Si el backend falla y no actualiza el estado:

```typescript
// Agregar timeout de seguridad
useEffect(() => {
  if (status?.narrative_status === 'in_progress') {
    const timeout = setTimeout(() => {
      setStatus({ ...status, narrative_status: 'error', error: 'Timeout' });
    }, 120000); // 2 minutos

    return () => clearTimeout(timeout);
  }
}, [status]);
```

## Referencias

- Backend: `/mnt/e/DMSanta_v3/orchestrator/status_tracker.py`
- Frontend: `/mnt/e/pocketDM/pocketDM/src/components/NarrativeStatusIndicator.tsx`
- Tipos: Estados definidos en el componente
