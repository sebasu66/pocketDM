import { EditorialSettingsElement, baseFields, normalizeValues } from '/libro/edition/editorial-settings.mjs';
import { assets } from './assets.mjs';
import { EditorialCamera } from './camera.mjs?v=15';
import { contour, maskPath, drawArt, drawBurn } from './artwork.mjs?v=15';
import { createTextFlow } from './text-flow.mjs';

const css = new URL('./page.css', import.meta.url);
const sheetTemplate = document.createElement('template');
sheetTemplate.innerHTML = `<link rel="stylesheet" href="${css}">
<section class="sheet" id="sheet"><header class="scene-heading"><div class="eyebrow"></div><h2></h2><div class="title-rule" aria-hidden="true"><span class="orn">❦</span></div></header>
<div class="scene-content"><figure class="artFloat" id="fig"><canvas id="artCanvas" role="img" width="1000" height="1000"></canvas><canvas class="burnLayer" id="burnCanvas" width="1000" height="1000" aria-hidden="true"></canvas></figure>
<article id="reading" tabindex="0" aria-label="Narración desplazable"><div id="paragraphs"><div id="textContour" aria-hidden="true"></div></div></article></div><div class="folio"></div></section>`;
const blank = { title: '', kicker: '', paragraphs: [], image: '', alt: '', folio: '', camera: {} };
export class BookEditorialPage extends EditorialSettingsElement {
  static editableProperties = Object.freeze({
    ...baseFields,
    cameraEasing: {
      group: 'Cámara',
      label: 'Aceleración',
      type: 'select',
      options: ['linear', 'ease-in', 'ease-out', 'ease-in-out'],
      default: 'ease-in-out',
    },
  });
  static introduction = false;
  static showsProperty() {
    return true;
  }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).append(sheetTemplate.content.cloneNode(true));
    const root = this.shadowRoot;
    this.sheet = root.getElementById('sheet');
    this.fig = root.getElementById('fig');
    this.artCanvas = root.getElementById('artCanvas');
    this.burnCanvas = root.getElementById('burnCanvas');
    this.reading = root.getElementById('reading');
    this.heading = root.querySelector('header');
    this.flow = createTextFlow(root);
    this._content = structuredClone(blank);
    this.art = new Image();
    this.burnImage = new Image();
    this.camera = new EditorialCamera(() => this.paintArt());
    this.observer = new ResizeObserver(() => this.schedule());
    this.onFonts = () => this.schedule();
    this.art.onload = () => this.schedule();
    this.burnImage.onload = () => this.schedule();
    this.burnImage.src = assets.burn;
    this.sheet.style.setProperty('--texture', 'url("' + assets.paper + '")');
    root.querySelector('link').onload = () => this.schedule();
    this.reading.addEventListener('scroll', () => this.scheduleFlow(), { passive: true });
  }
  connectedCallback() {
    this.observer.observe(this);
    document.fonts?.addEventListener('loadingdone', this.onFonts);
    this.schedule();
  }
  disconnectedCallback() {
    this.observer.disconnect();
    document.fonts?.removeEventListener('loadingdone', this.onFonts);
    this.camera.stop();
    cancelAnimationFrame(this.frame);
    cancelAnimationFrame(this.flowFrame);
    this.frame = this.flowFrame = 0;
  }
  schedule() {
    if (!this.isConnected || this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.render();
    });
  }
  scheduleFlow() {
    if (this.flowFrame || !this.geometry) return;
    this.flowFrame = requestAnimationFrame(() => {
      this.flowFrame = 0;
      this.updateFlow();
    });
  }
  settingsChanged() {
    this.camera.reset();
    this.schedule();
  }
  get content() {
    return structuredClone(this._content);
  }
  set content(value) {
    if (
      !value ||
      typeof value !== 'object' ||
      !Array.isArray(value.paragraphs) ||
      value.paragraphs.some((p) => typeof p !== 'string')
    )
      throw TypeError('Contenido narrativo inválido');
    const next = { ...blank, ...value };
    for (const k of ['title', 'kicker', 'image', 'alt', 'folio'])
      if (typeof next[k] !== 'string') throw TypeError(k);
    next.camera = normalizeValues(
      next.camera,
      Object.fromEntries(
        Object.entries(this.constructor.editableProperties).filter(([k]) => k.startsWith('camera')),
      ),
    );
    this._content = structuredClone(next);
    this.camera.reset();
    this.reading.scrollTop = 0;
    this.schedule();
  }
  applySettings(data) {
    const result = super.applySettings(data);
    this.loadToken = Symbol();
    return result;
  }
  async loadSettings(source) {
    if (source instanceof URL || (typeof source === 'string' && !source.trimStart().startsWith('{')))
      return this.loadSettingsFromURL(source);
    return this.applySettings(source);
  }
  async loadSettingsFromURL(url) {
    const token = (this.loadToken = Symbol());
    const response = await fetch(url);
    if (!response.ok) throw Error('No se pudo cargar el diseño (' + response.status + ')');
    const data = await response.json();
    return this.loadToken === token ? this.applySettings(data) : this.getSettings();
  }
  get view() {
    return this.getAttribute('preview-view') || (this.clientWidth <= 600 ? 'mobile' : 'desktop');
  }
  get effective() {
    return { ...this.getResolvedSettings(this.view), ...this._content.camera };
  }
  playCamera() {
    this.camera.play(this.effective);
  }
  get imageRatio() {
    return this.fig.clientWidth / Math.max(1, this.fig.clientHeight);
  }
  paintArt() {
    drawArt(this.artCanvas, this.art, this.camera.pose(this.effective), this.mask, this.imageRatio);
  }
  updateFlow() {
    this.flow(
      this.constructor.introduction ? { ...this.effective, columns: 'one' } : this.effective,
      this.geometry,
      this.stacked || this.constructor.introduction,
      this._content.paragraphs.join('\n\n'),
    );
  }
  render() {
    if (!this.clientWidth) return;
    const s = this.effective,
      c = this._content,
      intro = this.constructor.introduction,
      el = this.sheet;
    const source = c.image;
    if (this.source !== source) {
      this.source = source;
      if (source) this.art.src = source;
      else this.art.removeAttribute('src');
    }
    this.stacked = s.orientation === 'vertical' || ['top', 'bottom'].includes(s.side);
    const side = this.stacked ? (['right', 'bottom'].includes(s.side) ? 'bottom' : 'top') : s.side;
    el.dataset.side = side;
    el.dataset.intro = intro;
    el.dataset.align = s.titleAlign;
    el.dataset.artSide = side;
    const rgb = s.shadowColor.match(/\w\w/g).map((v) => parseInt(v, 16));
    const ink = intro ? s.introInk || s.ink : s.ink;
    const luma = ink.match(/\w\w/g).reduce((n, v, i) => n + parseInt(v, 16) * [0.2126, 0.7152, 0.0722][i], 0);
    const vars = {
      veil: luma < 150 ? '#e4e3dcbb' : this.art.src === assets.extended ? '#101b2d55' : s.paper,
      'page-ratio': s.ratio,
      'title-font': s.titleFont,
      'body-font': s.bodyFont,
      'title-size': s.titleSize + 'px',
      'title-ink': s.titleInk,
      'title-shadow':
        '0 ' +
        s.shadowOffset +
        'px ' +
        s.shadowBlur +
        'px rgba(' +
        rgb.join(',') +
        ',' +
        s.shadowOpacity / 100 +
        ')',
      'title-stroke': s.strokeWidth + 'px',
      'title-stroke-color': s.strokeColor,
      'rule-width': s.ruleWidth + 'px',
      'rule-gap': s.ruleGap + 'px',
      'rule-color': s.ruleColor,
      'rule-opacity': s.ruleOpacity / 100,
      paper: s.paper,
      tex: s.texture / 100,
      ink: ink,
      fs: s.fs + 'px',
      'body-align': s.bodyAlign,
      indent: s.indent + 'em',
      tabs: s.tabs,
      'capital-size': s.capitalSize,
      'line-height': s.lineHeight,
      'paragraph-gap': s.paragraphGap + 'em',
      'print-opacity': s.printOpacity / 100,
      'body-print-blend': s.printBlend === 'auto' ? (luma > 150 ? 'normal' : 'multiply') : s.printBlend,
      burn: s.burn / 100,
      w: s.width + '%',
    };
    for (const [k, v] of Object.entries(vars)) el.style.setProperty('--' + k, v);
    this.heading.dataset.align = s.titleAlign;
    this.heading.style.textAlign = s.titleAlign;
    this.heading.querySelector('h2').textContent = c.title;
    this.heading.querySelector('.eyebrow').textContent = c.kicker;
    this.shadowRoot.querySelector('.folio').textContent = s.showFolio === false ? '' : c.folio;
    this.shadowRoot
      .getElementById('paragraphs')
      .classList.toggle('capital', intro ? s.introCapital : s.capital);
    this.artCanvas.setAttribute('aria-label', c.alt || c.title);
    this.burnCanvas.style.mixBlendMode = s.blend;
    const fw = Math.max(1, this.fig.clientWidth),
      fh = Math.max(1, this.fig.clientHeight);
    this.geometry = contour(s, fw, fh, this.stacked);
    this.mask = intro ? null : maskPath(this.geometry, side, 1000);
    if (!intro) drawBurn(this.burnCanvas, this.burnImage, s, this.geometry, side);
    this.paintArt();
    const width = el.clientWidth,
      height = el.clientHeight;
    let left = 0,
      top = 0,
      headingWidth = width,
      readingTop = 0,
      readingBottom = 24;
    if (intro) {
      headingWidth = this.stacked ? width : width * 0.38;
      left = width - headingWidth;
      top = this.stacked ? height * 0.52 : height * 0.16;
      readingTop = top;
    } else if (this.stacked) {
      const bottom = side === 'bottom';
      top = s.titlePlacement === 'art' ? (bottom ? height - fh : 0) : bottom ? 0 : fh;
      readingTop = bottom ? 0 : fh;
      readingBottom = bottom ? fh : 24;
    } else {
      let max = 0;
      for (let y = 0; y <= 100; y += 0.25) max = Math.max(max, this.geometry.edge(y) + this.geometry.band(y));
      const inset = Math.ceil(fw * Math.min(1, max / 100) + 14);
      headingWidth =
        s.titlePlacement === 'full'
          ? width
          : s.titlePlacement === 'art'
            ? Math.max(0, fw - 12)
            : width - inset;
      left =
        s.titlePlacement === 'full'
          ? 0
          : s.titlePlacement === 'art'
            ? side === 'right'
              ? width - fw
              : 0
            : side === 'right'
              ? 0
              : inset;
    }
    Object.assign(this.heading.style, { top: top + 'px', left: left + 'px', width: headingWidth + 'px' });
    if (s.titlePlacement !== 'art' || intro)
      readingTop = Math.max(readingTop, top + this.heading.offsetHeight);
    Object.assign(this.reading.style, {
      top: Math.min(readingTop, Math.max(0, height - readingBottom - 50)) + 'px',
      bottom: readingBottom + 'px',
      left: (intro ? left : 0) + 'px',
    });
    this.updateFlow();
  }
}
customElements.define('book-editorial-base', BookEditorialPage);

export class BookEditorialScene extends BookEditorialPage {
  static componentType = 'book-editorial-scene';
  static editableProperties = Object.freeze({
    ...super.editableProperties,
    showFolio: { group: 'Escena', label: 'Mostrar folio', type: 'boolean', default: true },
  });
}
export class BookEditorialIntro extends BookEditorialPage {
  static componentType = 'book-editorial-intro';
  static introduction = true;
  static showsProperty(id) {
    return ![
      'side',
      'width',
      'mask',
      'burnSide',
      'blend',
      'burn',
      'thick',
      'ink',
      'columns',
      'columnGap',
      'edgeGap',
      'capital',
      'titlePlacement',
      'texture',
    ].includes(id);
  }
  static editableProperties = Object.freeze({
    ...super.editableProperties,
    introInk: { group: 'Presentación', label: 'Tinta de presentación', type: 'color', default: '#fff8ed' },
    introCapital: {
      group: 'Presentación',
      label: 'Capitular de presentación',
      type: 'boolean',
      default: true,
    },
  });
}
customElements.define(BookEditorialScene.componentType, BookEditorialScene);
customElements.define(BookEditorialIntro.componentType, BookEditorialIntro);
