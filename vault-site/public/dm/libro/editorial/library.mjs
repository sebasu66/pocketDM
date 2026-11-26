import { assets } from './assets.mjs';
import { locationPlace } from '/libro/edition/location-pages.mjs';
export function sampleContent(kind, design) {
  const place = locationPlace(design === 'plaza' ? 0 : 2),
    intro = kind === 'intro';
  return {
    kicker: intro ? 'Stormkeep / Las Marcas' : 'Stormkeep / Cuaderno de viaje',
    title: intro ? place.name : place.title,
    paragraphs: intro ? [place.intro] : [...place.paragraphs],
    image: new URL(assets[intro && design === 'plaza' ? 'extended' : design]).pathname,
    alt: place.name,
    folio: intro ? '' : 'Muestra editorial · II',
    camera: {},
    ...(kind === 'dialogue'
      ? {
          dialogue: {
            line: '¿Qué noticias traés?',
            people: [
              {
                name: 'Hald Eirik',
                role: 'Capitán de la guardia',
                image: '/docs/art-references/stormkeep-work-20261125/assets/hald-capitan.png',
                emotion: 'neutral',
                emotions: {},
              },
            ],
            choices: [
              { label: 'Preguntar por el lugar' },
              { label: '¿Qué ocurre en Stormkeep?' },
              { label: '¿Necesitás ayuda?' },
              { label: 'Contar lo que vi en el camino' },
              { label: 'Despedirse' },
            ],
          },
        }
      : {}),
  };
}
export function importDocument(obj, page, content, kind) {
  if (obj?.values) {
    const data = sampleContent(kind, obj.values.art === 'plaza' ? 'plaza' : 'forja'),
      v = obj.values,
      intro = kind === 'intro';
    data.title = v[intro ? 'heroTitle' : 'sceneTitle'] ?? data.title;
    const raw = v[intro ? 'heroText' : 'sceneText'];
    if (typeof raw === 'string') data.paragraphs = raw.split(/\n\s*\n/);
    data.image = obj.images?.[intro ? 'hero' : 'scene'] || data.image;
    const settings = page.getSettings();
    settings.base = Object.fromEntries(
      Object.entries(v).filter(([k]) => Object.hasOwn(page.constructor.editableProperties, k)),
    );
    return { settings, content: data };
  }
  if (obj.kind === 'pocketdm-editorial-project' && obj.schemaVersion === 1)
    return { settings: obj.settings, content: obj.content };
  return { settings: obj, content };
}
let db;
function database() {
  return (db ??= new Promise((resolve, reject) => {
    const r = indexedDB.open('pocketdm-editorial-designs', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('designs');
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  }));
}
async function transaction(key, value) {
  const store = await database();
  return new Promise((resolve, reject) => {
    const tx = store.transaction('designs', value ? 'readwrite' : 'readonly'),
      s = tx.objectStore('designs'),
      r = value ? s.put(value, key) : s.get(key);
    tx.oncomplete = () => resolve(r.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
export async function readLocal(key) {
  let a, b;
  try {
    a = await transaction(key);
  } catch {}
  try {
    b = JSON.parse(localStorage.getItem('editorial:' + key));
  } catch {}
  return (a?.time ?? 0) >= (b?.time ?? 0) ? a?.data : b?.data;
}
export async function writeLocal(key, data) {
  const obj = { time: Date.now(), data };
  try {
    await transaction(key, obj);
  } catch {
    localStorage.setItem('editorial:' + key, JSON.stringify(obj));
  }
}

// Recover V11 projects on first open. Reading the old DB never creates or replaces an old project.
export async function readLegacy(design) {
  let saved, cached;
  try {
    cached = JSON.parse(
      localStorage.getItem('pocketdm-editorial-v9-settings') ||
        localStorage.getItem('pocketdm-editorial-v8-settings') ||
        'null',
    );
  } catch {}
  try {
    if ((await indexedDB.databases()).some((db) => db.name === 'pocketdm-editorial-v8')) {
      saved = await new Promise((resolve, reject) => {
        const r = indexedDB.open('pocketdm-editorial-v8');
        r.onerror = () => reject(r.error);
        r.onsuccess = () => {
          const old = r.result,
            tx = old.transaction('projects'),
            request = tx.objectStore('projects').get('current');
          tx.oncomplete = () => {
            old.close();
            resolve(request.result);
          };
          tx.onerror = () => {
            old.close();
            reject(tx.error);
          };
        };
      });
    }
  } catch {}
  const values = { ...saved?.values, ...cached?.values };
  if (!values.art || (values.art === 'plaza' ? 'plaza' : 'forja') !== design) return null;
  return { values, images: saved?.images };
}
