// Start a static server at vault-site/public and pass its URL (or a published preview).
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const origin = process.argv[2] || 'http://localhost:8000';
try {
  const p = await browser.newPage({ viewport: { width: 1460, height: 850 } }),
    errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.goto(new URL('/dm/libro/#ui', origin).href);
  const panel = p.locator('dm-context-panel'),
    f = p.frameLocator('.editorial-frame'),
    both = f.locator('.canvas > *'),
    first = both.nth(0);
  await first.locator('h2').waitFor();
  const value = (el, prop) => el.evaluate((page, prop) => page.effective[prop], prop);
  assert.equal(await both.count(), 2);
  assert.equal(await first.evaluate((x) => x.localName), await both.nth(1).evaluate((x) => x.localName));
  assert.deepEqual(await both.evaluateAll((xs) => xs.map((x) => x.view)), ['desktop', 'mobile']);
  await panel.locator('#design').selectOption('plaza');
  await first.getByText('Una voz entre la niebla').waitFor();
  await panel
    .locator('summary')
    .filter({ hasText: /^Título$/ })
    .click();
  const size = panel.locator('[data-property=titleSize]');
  await size.fill('48');
  await panel.locator('#scope').selectOption('mobile');
  await size.fill('35');
  assert.equal(await value(first, 'titleSize'), 48);
  assert.equal(await value(both.nth(1), 'titleSize'), 35);
  await size
    .locator('xpath=../..')
    .getByRole('button', { name: /Heredar/ })
    .click();
  assert.equal(await value(both.nth(1), 'titleSize'), 48);
  await panel.locator('#scope').selectOption('base');
  const isolation = await first.evaluate(async (el) => {
    const other = el.parentNode.parentNode.nextElementSibling.querySelector('.canvas').firstElementChild;
    const initial = el.getSettings(),
      unchanged = other.getSettings(),
      detached = el.getSettings();
    detached.base.fs = 25;
    if (el.getSettings().base.fs === 25) return false;
    await el.loadSettings(detached);
    const independent = other.getSettings().base.fs === unchanged.base.fs;
    await el.loadSettingsFromURL(new URL('./editorial/designs/scene-plaza.json', location.href));
    const loaded = el.getSettings().base.titleSize === 61;
    await el.loadSettings(JSON.stringify(initial));
    const roundtrip = JSON.stringify(el.getSettings()) === JSON.stringify(initial);
    let rejected = false;
    try {
      await el.loadSettings({ ...initial, base: { width: 999 } });
    } catch {
      rejected = true;
    }
    return (
      independent && loaded && roundtrip && rejected && el.getSettings().base.width === initial.base.width
    );
  });
  assert(isolation);
  await panel
    .locator('summary')
    .filter({ hasText: /^Cámara$/ })
    .click();
  await panel.locator('[data-property=cameraDuration]').fill('0.2');
  await panel.locator('[data-property=cameraStartZoom]').fill('1.5');
  await panel.locator('[data-property=cameraEndZoom]').fill('2');
  await panel.locator('.camera-map img').waitFor();
  const map = panel.locator('.camera-map');
  await map.click({ position: { x: 20, y: 20 } });
  assert((await value(first, 'cameraStartX')) < 50);
  assert.equal(await map.locator('.frame').count(), 2);
  await panel.getByRole('button', { name: 'Reproducir en ambas vistas' }).click();
  await p.waitForTimeout(420);
  const cameraResult = await first.evaluate((el) => [el.camera.progress, el.artCanvas.toDataURL()]);
  await p.waitForTimeout(100);
  assert.equal(cameraResult[0], 1);
  assert.equal(await first.evaluate((el) => el.artCanvas.toDataURL()), cameraResult[1]);
  await p.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(
    await first.evaluate((el) => {
      el.playCamera();
      return el.camera.progress;
    }),
    1,
  );
  const target = panel.getByLabel('Cámara', { exact: true });
  await target.selectOption('image');
  await panel.locator('[data-property=cameraEndZoom]').fill('2.5');
  assert.deepEqual(
    await first.evaluate((p) => [p.getSettings().base.cameraEndZoom, p.content.camera.cameraEndZoom]),
    [2, 2.5],
  );
  await panel.locator('[data-property=cameraEndZoom]').locator('xpath=../..').getByRole('button').click();
  assert.equal(await first.evaluate((p) => p.effective.cameraEndZoom), 2);
  await target.selectOption('design');
  const resized = await first.evaluate(async (el) => {
    const p = document.createElement('book-editorial-base');
    p.style.width = '700px';
    el.parentNode.after(p);
    p.content = el.content;
    await new Promise(requestAnimationFrame);
    const desktop = p.view;
    p.style.width = '400px';
    await new Promise(requestAnimationFrame);
    const result = [desktop, p.view, p.effective.orientation];
    p.remove();
    return result;
  });
  assert.deepEqual(resized, ['desktop', 'mobile', 'vertical']);
  const flow = await first.evaluate(async (el) => {
    const c = el.content;
    c.paragraphs = Array.from({ length: 24 }, (_, i) => 'Párrafo ' + (i + 1) + '. ' + c.paragraphs[0]);
    el.content = c;
    const s = el.getSettings();
    Object.assign(s.base, { columns: 'one', side: 'right', burn: 80 });
    el.settings = s;
    const settle = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await settle();
    const contour = el.shadowRoot.getElementById('textContour'),
      before = contour.style.shapeOutside;
    el.reading.scrollTop = 300;
    await settle();
    const burn = el.burnCanvas
      .getContext('2d')
      .getImageData(0, 0, 1000, 1000)
      .data.some((v, i) => i % 4 === 3 && v > 0);
    return [
      burn,
      contour.classList.contains('right'),
      before !== contour.style.shapeOutside,
      el.reading.scrollTop > 0,
      el.reading.textContent.includes('Párrafo 24.'),
      getComputedStyle(el.sheet, '::before').backgroundImage.includes('paper.webp'),
    ];
  });
  assert.deepEqual(flow, Array(6).fill(true));
  await panel
    .locator('summary')
    .filter({ hasText: /Archivo y bóveda/ })
    .click();
  const dl = p.waitForEvent('download');
  await panel.locator('#export').click();
  const file = await dl,
    settings = JSON.parse(await readFile(await file.path(), 'utf8'));
  assert.equal(settings.component, 'book-editorial-scene');
  assert.equal(settings.base.side, 'right');
  assert(!('paragraphs' in settings.base));
  await panel.locator('#import').setInputFiles({
    name: 'design.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(settings)),
  });
  await panel.locator('#status').filter({ hasText: 'Guardado' }).waitFor();
  await p.reload();
  await p.locator('dm-context-panel #design').selectOption('plaza');
  await first.getByText('Una voz entre la niebla').waitFor();
  assert.equal(await value(first, 'side'), 'right');
  await panel.locator('#component').selectOption('intro');
  await first.getByText('La plaza del Cuervo Gris').waitFor();
  assert.equal(await first.evaluate((x) => x.localName), 'book-editorial-intro');
  await p.locator('a[href="/dm/libro/#navegacion"]').click();
  await p.locator('#navegacion').waitFor();
  await panel.waitFor({ state: 'hidden' });
  await p.locator('a[href="/dm/libro/#ui"]').click();
  await panel.waitFor();
  await p.setViewportSize({ width: 390, height: 780 });
  assert.equal(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(errors, []);
  console.log(
    'PASS: instancias, JSON y URL, herencia y restauración, cámara y reducción de movimiento, quemado, contorno en scroll, contenido, persistencia, hijos y navegación.',
  );
} finally {
  await browser.close();
}
