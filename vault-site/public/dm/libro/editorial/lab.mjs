import './editorial-page.mjs';
import './dialogue-page.mjs';
import { assets } from './assets.mjs';
import { cropRect, cameraFrame } from './camera.mjs';
import { sampleContent, importDocument, readLocal, writeLocal, readLegacy } from './library.mjs';

const sidebar = document.querySelector('.sidebar'),
  nodes = Object.fromEntries([...sidebar.querySelectorAll('[id]')].map((el) => [el.id, el]));
const boxes = [...document.querySelectorAll('.canvas')],
  widths = [960, 360];
const mobileWidth = document.getElementById('mobileWidth');
try {
  const saved = Number(localStorage.getItem('editorial:mobile-preview-width'));
  if (saved >= 240 && saved <= 1200) widths[1] = saved;
} catch {}
mobileWidth.value = widths[1];
function updateMobileWidth() {
  if (!mobileWidth.validity.valid || !mobileWidth.value) return;
  widths[1] = Number(mobileWidth.value);
  mobileWidth.closest('figure').style.setProperty('--mobile-preview-width', widths[1] + 'px');
  if (pages[1]) {
    pages[1].style.width = widths[1] + 'px';
    pages[1].schedule();
  }
  try {
    localStorage.setItem('editorial:mobile-preview-width', String(widths[1]));
  } catch {}
  requestAnimationFrame(fit);
}
mobileWidth.addEventListener('input', updateMobileWidth);
const kind = () => nodes.component.value,
  design = () => nodes.design.value,
  key = () => kind() + '-' + design(),
  scope = () => nodes.scope.value;
const status = (value) => (nodes.status.textContent = value);
let pages = [],
  controls = new Map(),
  epoch = 0,
  ready = false,
  saveChain = Promise.resolve(),
  framePhase = 'Start',
  cameraTarget = 'design',
  mapImage,
  frames = [],
  phaseSelect,
  targetSelect;
const page = () => pages[0];
const catalogKey = 'editorial:design-library-v1';
function getCatalog() {
  try {
    const data = JSON.parse(localStorage.getItem(catalogKey) || '[]');
    return Array.isArray(data)
      ? data.filter((x) => x && typeof x.id === 'string' && typeof x.name === 'string' && x.kind === kind())
      : [];
  } catch {
    return [];
  }
}
function showCatalog(selected = 'forja') {
  nodes.design.replaceChildren(
    new Option('Forja del Ancla · bóveda', 'forja'),
    new Option('Plaza del Cuervo Gris · bóveda', 'plaza'),
    ...getCatalog().map((x) => new Option(x.name + ' · en este navegador', x.id)),
  );
  nodes.design.value = [...nodes.design.options].some((x) => x.value === selected) ? selected : 'forja';
  nodes.vault.disabled = !['forja', 'plaza'].includes(nodes.design.value);
}
const sourceURL = () => new URL('./designs/' + key() + '.json', import.meta.url);
function download(blob, name) {
  const url = URL.createObjectURL(blob),
    a = document.createElement('a');
  a.download = name;
  a.href = url;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function downloadJSON(data, name) {
  download(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), name + '.json');
}
function persist() {
  const id = key(),
    generation = epoch,
    data = { settings: page().getSettings(), content: page().content };
  saveChain = saveChain.catch(() => {}).then(() => writeLocal(id, data));
  saveChain.then(
    () => {
      if (epoch === generation) status('Guardado en este navegador.');
    },
    () => {
      if (epoch === generation) status('No se pudo guardar aquí. Descargá el proyecto.');
    },
  );
}
function fit() {
  for (const [i, box] of boxes.entries()) {
    const p = pages[i];
    if (!p) continue;
    const scale = Math.min(1, box.clientWidth / widths[i]);
    p.style.transform = 'scale(' + scale + ')';
    box.style.height = p.offsetHeight * scale + 'px';
    box.parentElement.style.setProperty('--ratio', widths[i] / Math.max(p.offsetHeight, 1));
  }
  drawMap();
}
const sizeObserver = new ResizeObserver(fit);
boxes.forEach((b) => sizeObserver.observe(b));
updateMobileWidth();
for (const b of boxes)
  b.previousElementSibling.querySelector('button').onclick = () =>
    document.fullscreenElement ? document.exitFullscreen() : b.parentElement.requestFullscreen();
function section(name) {
  const d = document.createElement('details'),
    summary = document.createElement('summary'),
    fields = document.createElement('div');
  summary.textContent = name;
  fields.className = 'fields';
  d.append(summary, fields);
  nodes.groups.append(d);
  return fields;
}
function select(items) {
  const el = document.createElement('select');
  for (const [value, label] of items) el.add(new Option(label, value));
  return el;
}
function labelled(text, input) {
  const label = document.createElement('label'),
    span = document.createElement('span');
  span.textContent = text;
  input.setAttribute('aria-label', text);
  label.append(span, input);
  return label;
}
function button(text, fn) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = text;
  b.onclick = fn;
  return b;
}
function mapTools(group) {
  targetSelect = select([
    ['design', 'Predeterminada del diseño'],
    ['image', 'Excepción de esta imagen'],
  ]);
  targetSelect.value = cameraTarget;
  targetSelect.onchange = () => {
    cameraTarget = targetSelect.value;
    refresh();
  };
  phaseSelect = select([
    ['Start', 'Inicial · línea continua'],
    ['End', 'Final · línea discontinua'],
  ]);
  phaseSelect.value = framePhase;
  phaseSelect.onchange = () => (framePhase = phaseSelect.value);
  const map = document.createElement('div');
  map.className = 'camera-map';
  mapImage = document.createElement('img');
  mapImage.alt = 'Imagen completa y encuadres de cámara';
  mapImage.onload = drawMap;
  map.append(mapImage);
  frames = ['Inicial', 'Final'].map((name, i) => {
    const f = document.createElement('div');
    f.textContent = name;
    f.className = 'frame ' + (i ? 'end' : 'start');
    map.append(f);
    return f;
  });
  const pan = (e) => {
    const r = map.getBoundingClientRect(),
      coord = (v, min, span) => Math.round(100 * Math.min(1, Math.max(0, (v - min) / span)));
    change(
      {
        ['camera' + framePhase + 'X']: coord(e.clientX, r.left, r.width),
        ['camera' + framePhase + 'Y']: coord(e.clientY, r.top, r.height),
      },
      false,
    );
  };
  map.onpointerdown = (e) => {
    map.setPointerCapture(e.pointerId);
    pan(e);
  };
  map.onpointermove = (e) => {
    if (map.hasPointerCapture(e.pointerId)) pan(e);
  };
  map.onpointerup = () => persist();
  map.onpointercancel = () => persist();
  group.append(
    labelled('Cámara', targetSelect),
    labelled('Mover encuadre', phaseSelect),
    map,
    button('Reproducir en ambas vistas', () => {
      change({ cameraEnabled: true });
      requestAnimationFrame(() => pages.forEach((p) => p.playCamera()));
    }),
  );
}
function drawMap() {
  if (!mapImage?.naturalWidth || !pages.length) return;
  const p = pages[scope() === 'mobile' ? 1 : 0],
    s = cameraTarget === 'image' ? p.effective : p.getResolvedSettings(p.view);
  frames.forEach((f, i) => {
    const rect = cropRect(mapImage.naturalWidth / mapImage.naturalHeight, p.imageRatio, cameraFrame(s, !!i));
    Object.assign(f.style, {
      left: rect.x * 100 + '%',
      top: rect.y * 100 + '%',
      width: rect.width * 100 + '%',
      height: rect.height * 100 + '%',
    });
  });
}
function build() {
  const open = [...nodes.groups.querySelectorAll('details[open] summary')].map((s) => s.textContent);
  controls.clear();
  nodes.groups.replaceChildren();
  const groups = new Map();
  for (const [id, field] of Object.entries(page().constructor.editableProperties)) {
    if (!page().constructor.showsProperty(id)) continue;
    let group = groups.get(field.group);
    if (!group) {
      group = section(field.group);
      group.parentElement.open = open.includes(field.group);
      groups.set(field.group, group);
      if (field.group === 'Cámara') mapTools(group);
    }
    const input =
      field.type === 'select' ? select(field.options.map((v) => [v, v])) : document.createElement('input');
    if (field.type !== 'select')
      input.type = { boolean: 'checkbox', number: 'number', color: 'color' }[field.type];
    if (field.type === 'number') Object.assign(input, { min: field.min, max: field.max, step: field.step });
    input.dataset.property = id;
    const hint = document.createElement('small'),
      reset = button('Heredar', () => change({ [id]: undefined }));
    reset.className = 'restore';
    reset.setAttribute('aria-label', 'Heredar ' + field.label);
    input.oninput = () => {
      if (!input.validity.valid || (field.type === 'number' && input.value === '')) return;
      change({
        [id]:
          field.type === 'boolean'
            ? input.checked
            : field.type === 'number'
              ? Number(input.value)
              : input.value,
      });
    };
    const row = document.createElement('div');
    row.className = 'field';
    const label = labelled(field.label, input);
    row.append(label, hint, reset);
    group.append(row);
    controls.set(id, { input, hint, reset, field });
  }
  refresh();
}
function refresh() {
  if (!page()) return;
  const settings = page().getSettings(),
    c = page().content,
    view = scope() === 'mobile' ? 'mobile' : 'desktop';
  for (const [id, { input, hint, reset, field }] of controls) {
    const image = cameraTarget === 'image' && id.startsWith('camera'),
      layer = image ? c.camera : scope() === 'base' ? settings.base : settings.responsive[scope()] || {},
      v = layer[id] ?? (image ? page().getResolvedSettings(view)[id] : settings.base[id]),
      specific = image || scope() !== 'base';
    if (field.type === 'boolean') input.checked = v;
    else input.value = v;
    hint.hidden = !specific;
    hint.textContent = Object.hasOwn(layer, id) ? 'Excepción' : 'Heredado';
    reset.hidden = !specific || !Object.hasOwn(layer, id);
  }
  if (kind() === 'dialogue') {
    const dialogue = c.dialogue;
    for (let i = 1; i <= 1; i++) {
      nodes['person' + i + 'Name'].value = dialogue.people[i - 1].name;
      nodes['person' + i + 'Emotion'].value = dialogue.people[i - 1].emotion;
    }
    nodes.dialogueLine.value = dialogue.line;
    nodes.dialogueChoices.value = dialogue.choices.map((x) => x.label).join('\n');
  }
  for (const id of ['title', 'kicker', 'alt']) nodes[id].value = c[id];
  nodes.paragraphs.value = c.paragraphs.join('\n\n');
  if (mapImage.getAttribute('src') !== c.image) mapImage.src = c.image;
  requestAnimationFrame(fit);
}
function change(values, save = true) {
  if (!ready) return;
  const image = cameraTarget === 'image' && Object.keys(values).every((k) => k.startsWith('camera')),
    s = page().getSettings(),
    c = page().content,
    layer = image ? c.camera : scope() === 'base' ? s.base : (s.responsive[scope()] ??= {});
  for (const [k, v] of Object.entries(values)) {
    if (v === undefined) delete layer[k];
    else layer[k] = v;
  }
  for (const p of pages) {
    if (image) p.content = c;
    else p.applySettings(s);
  }
  refresh();
  if (save) persist();
}
function setContent(c) {
  for (const p of pages) p.content = c;
  refresh();
  persist();
}
function apply(doc) {
  const probe = document.createElement(page().localName);
  probe.applySettings(doc.settings);
  probe.content = doc.content;
  for (const p of pages) {
    p.applySettings(doc.settings);
    p.content = doc.content;
  }
}
async function openDesign(vault = false) {
  const generation = ++epoch;
  ready = false;
  sidebar.setAttribute('aria-busy', 'true');
  for (const child of sidebar.children) if (!child.contains(nodes.design)) child.inert = true;
  status('Cargando diseño…');
  try {
    await saveChain.catch(() => {});
    const id = key(),
      k = kind(),
      d = design(),
      url = sourceURL(),
      tag = 'book-editorial-' + k,
      cached = vault ? null : await readLocal(id),
      probe = document.createElement(tag);
    const legacy = !vault && !cached ? await readLegacy(d) : null;
    const restored = cached || (legacy ? importDocument(legacy, probe, sampleContent(k, d), k) : null);
    if (restored) probe.applySettings(restored.settings);
    else await probe.loadSettingsFromURL(url);
    probe.content = restored?.content ?? sampleContent(k, d);
    if (generation !== epoch) return;
    for (const p of pages) sizeObserver.unobserve(p);
    pages = boxes.map((box, i) => {
      const p = document.createElement(tag);
      p.style.width = widths[i] + 'px';
      p.setAttribute('preview-view', i ? 'mobile' : 'desktop');
      box.replaceChildren(p);
      sizeObserver.observe(p);
      return p;
    });
    apply({
      settings: probe.getSettings(),
      content: vault && previousContent ? previousContent : probe.content,
    });
    activeDesign = { kind: k, design: d };
    nodes.dialogueEditor.hidden = k !== 'dialogue';
    document.getElementById('pageType').textContent = nodes.component.selectedOptions[0].textContent;
    ready = true;
    build();
    status(
      legacy
        ? 'Proyecto V11 recuperado.'
        : cached
          ? 'Borrador local recuperado.'
          : 'Diseño cargado desde la bóveda.',
    );
    if (vault || legacy) persist();
  } catch (error) {
    if (generation === epoch) {
      if (activeDesign) {
        nodes.component.value = activeDesign.kind;
        nodes.design.value = activeDesign.design;
        ready = true;
      }
      status('Error al cargar el diseño: ' + error.message);
    }
  } finally {
    if (generation === epoch) {
      for (const child of sidebar.children) child.inert = false;
      sidebar.removeAttribute('aria-busy');
    }
  }
}
let previousContent = null,
  activeDesign = null;
nodes.vault.onclick = () => {
  previousContent = page()?.content;
  openDesign(true);
};
nodes.component.onchange = () => {
  showCatalog(design());
  openDesign();
};
nodes.design.onchange = () => {
  nodes.vault.disabled = !['forja', 'plaza'].includes(design());
  openDesign();
};
nodes.newDesign.onclick = async () => {
  const name = nodes.newDesignName.value.trim();
  if (!name) {
    status('Escribí un nombre para el diseño.');
    nodes.newDesignName.focus();
    return;
  }
  if (!ready) return;
  const currentKind = kind(),
    id = 'local-' + crypto.randomUUID();
  const data = { settings: page().getSettings(), content: page().content };
  try {
    await saveChain;
    await writeLocal(currentKind + '-' + id, data);
    const all = JSON.parse(localStorage.getItem(catalogKey) || '[]');
    all.push({ id, name, kind: currentKind });
    localStorage.setItem(catalogKey, JSON.stringify(all));
    if (kind() !== currentKind) return;
    nodes.newDesignName.value = '';
    showCatalog(id);
    await openDesign();
    status('Diseño creado y guardado en este navegador.');
  } catch (error) {
    status('No se pudo crear el diseño: ' + error.message);
  }
};
nodes.scope.onchange = refresh;
for (const id of ['title', 'kicker', 'alt', 'paragraphs'])
  nodes[id].oninput = () => {
    if (!ready) return;
    const c = page().content;
    c[id] = id === 'paragraphs' ? nodes[id].value.split(/\n\s*\n/) : nodes[id].value;
    setContent(c);
  };
for (let i = 1; i <= 1; i++) {
  for (const field of ['Name', 'Emotion'])
    nodes['person' + i + field].onchange = () => {
      const c = page().content;
      c.dialogue.people[i - 1][field.toLowerCase()] = nodes['person' + i + field].value;
      setContent(c);
    };
  for (const field of ['Image', 'Mood'])
    nodes['person' + i + field].onchange = async (e) => {
      const file = e.target.files[0],
        token = epoch;
      if (!file) return;
      try {
        const src = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const img = new Image();
        img.src = src;
        await img.decode();
        if (token !== epoch) return;
        const c = page().content,
          person = c.dialogue.people[i - 1];
        if (field === 'Mood') {
          if (!person.emotion.trim()) throw Error('Indicá primero una emoción');
          person.emotions[person.emotion] = src;
        } else person.image = src;
        setContent(c);
      } catch (err) {
        status('No se pudo cargar la imagen: ' + err.message);
      } finally {
        e.target.value = '';
      }
    };
}
nodes.dialogueLine.onchange = () => {
  const c = page().content;
  c.dialogue.line = nodes.dialogueLine.value;
  setContent(c);
};
nodes.dialogueChoices.onchange = () => {
  const c = page().content;
  c.dialogue.choices = nodes.dialogueChoices.value
    .split('\n')
    .filter(Boolean)
    .map((label) => ({ label }));
  setContent(c);
};
nodes.upload.onchange = async () => {
  const file = nodes.upload.files[0],
    token = epoch;
  if (!file) return;
  try {
    const data = await new Promise((ok, fail) => {
      const r = new FileReader();
      r.onload = () => ok(r.result);
      r.onerror = fail;
      r.readAsDataURL(file);
    });
    const img = new Image();
    img.src = data;
    await img.decode();
    if (token === epoch) setContent({ ...page().content, image: data });
  } catch {
    status('No se pudo leer esta imagen.');
  } finally {
    nodes.upload.value = '';
  }
};
nodes.originalImage.onclick = () =>
  setContent({ ...page().content, image: sampleContent(kind(), design()).image });
nodes.export.onclick = () => downloadJSON(page().getSettings(), key());
nodes.exportProject.onclick = () =>
  downloadJSON(
    {
      kind: 'pocketdm-editorial-project',
      schemaVersion: 1,
      settings: page().getSettings(),
      content: page().content,
    },
    key() + '-proyecto',
  );
nodes.import.onchange = async () => {
  const file = nodes.import.files[0],
    token = epoch;
  if (!file) return;
  try {
    const obj = JSON.parse(await file.text());
    if (token !== epoch) return;
    const doc = importDocument(obj, page(), page().content, kind());
    apply(doc);
    refresh();
    persist();
  } catch (error) {
    status('Importación rechazada: ' + error.message);
  } finally {
    nodes.import.value = '';
  }
};
nodes.palette.onclick = () => {
  try {
    const img = page().art;
    if (!img.naturalWidth) return;
    let colors;
    if (Object.values(assets).includes(img.src)) {
      colors = img.src === assets.forja ? ['#252b32', '#efa76b'] : ['#132e51', '#da3107'];
    } else {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 64;
      const ctx = cv.getContext('2d');
      ctx.drawImage(img, 0, 0, 64, 64);
      const pixels = ctx.getImageData(0, 0, 64, 64).data,
        values = [];
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] > 200) values.push([...pixels.slice(i, i + 3)]);
      }
      values.sort((a, b) => lum(a) - lum(b));
      if (!values.length) return;
      const mean = (list) =>
        '#' +
        [0, 1, 2]
          .map((i) =>
            Math.round(list.reduce((n, p) => n + p[i], 0) / list.length)
              .toString(16)
              .padStart(2, '0'),
          )
          .join('');
      colors = [
        mean(values.slice(Math.floor(values.length * 0.18), Math.max(1, Math.ceil(values.length * 0.4)))),
        mean(
          values
            .slice(Math.floor(values.length * 0.7))
            .sort((a, b) => sat(b) - sat(a))
            .slice(0, Math.max(1, Math.floor(values.length * 0.07))),
        ),
      ];
    }
    change({
      paper: colors[0],
      titleInk: colors[1],
      ink: '#fff8ed',
      ...(kind() === 'intro' ? { introInk: '#fff8ed' } : {}),
    });
  } catch {
    status('No se pudo leer la paleta de esta imagen.');
  }
};
const lum = (a) => a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722,
  sat = (a) => Math.max(...a) - Math.min(...a) + lum(a) * 0.25;
nodes.png.onclick = () =>
  pages[scope() === 'mobile' ? 1 : 0].artCanvas.toBlob((blob) => blob && download(blob, key() + '.png'));
function outline() {
  const p = pages[scope() === 'mobile' ? 1 : 0],
    side = p.sheet.dataset.side,
    pts = [[0, 0]];
  for (let i = 0; i <= 1000; i++)
    pts.push([p.constructor.introduction ? 100 : p.geometry.edge(i / 10), i / 10]);
  pts.push([0, 100]);
  return pts.map(([x, y]) =>
    ({ left: [x, y], right: [100 - x, y], top: [y, x], bottom: [y, 100 - x] })[side].map((n) => n.toFixed(2)),
  );
}
nodes.svg.onclick = () =>
  download(
    new Blob(
      [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon fill="white" points="' +
          outline()
            .map((p) => p.join(','))
            .join(' ') +
          '"/></svg>',
      ],
      { type: 'image/svg+xml' },
    ),
    key() + '-mascara.svg',
  );
nodes.edge.onclick = async () => download(await (await fetch(assets.burn)).blob(), 'borde-original.png');
nodes.css.onclick = async () => {
  try {
    await navigator.clipboard.writeText(
      'clip-path: polygon(' +
        outline()
          .map((p) => p.join('% ') + '%')
          .join(', ') +
        ');',
    );
    status('Contorno CSS copiado.');
  } catch {
    status('El navegador bloqueó el portapapeles.');
  }
};
const styles = await (await fetch(new URL('./inspector.css', import.meta.url))).text();
window.pocketDMContextTools = {
  mount(host) {
    document.querySelector('main').classList.add('mounted');
    host.mountTools(sidebar, styles, 'UI · Herramientas');
    return true;
  },
};
if (parent !== window) {
  try {
    const host = parent.document.querySelector('dm-context-panel');
    if (host && !window.frameElement.closest('[hidden]')) window.pocketDMContextTools.mount(host);
  } catch {}
}
showCatalog();
await openDesign();
