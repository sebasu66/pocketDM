import { BookEditorialPage } from './editorial-page.mjs?v=15';
import { drawArt } from './artwork.mjs?v=15';

const number = (group, label, value, min, max, step = 1) => ({
  group,
  label,
  type: 'number',
  default: value,
  min,
  max,
  step,
});
export class BookEditorialDialogue extends BookEditorialPage {
  static componentType = 'book-editorial-dialogue';
  static editableProperties = Object.freeze({
    ...super.editableProperties,
    dialogLayoutVersion: number('Diálogo', 'Versión', 2, 1, 2),
    backgroundX: number('Fondo', 'Posición horizontal (%)', 50, 0, 100),
    backgroundY: number('Fondo', 'Posición vertical (%)', 50, 0, 100),
    backgroundZoom: number('Fondo', 'Zoom', 1, 1, 3, 0.05),
    nameLeft: number('Placa', 'Posición horizontal (%)', 29, -100, 100),
    nameTop: number('Placa', 'Posición vertical (%)', 84, -100, 100),
    nameWidth: number('Placa', 'Ancho (%)', 30, 5, 100),
    person1X: number('Encuadre del NPC', 'Encuadre horizontal', 50, 0, 100),
    person1Y: number('Encuadre del NPC', 'Encuadre vertical', 0, 0, 100),
    person1Zoom: number('Encuadre del NPC', 'Zoom', 1, 1, 3, 0.05),
    personLeft: number('Encuadre del NPC', 'Posición horizontal (%)', 25, -100, 100),
    personTop: number('Encuadre del NPC', 'Posición vertical (%)', 0, -100, 100),
    personWidth: number('Encuadre del NPC', 'Ancho (%)', 38, 10, 100),
    personHeight: number('Encuadre del NPC', 'Alto (%)', 100, 10, 100),
    dialogLeft: number('Diálogo', 'Posición horizontal (%)', 59, -100, 100),
    dialogTop: number('Diálogo', 'Posición vertical (%)', 4, -100, 100),
    dialogWidth: number('Diálogo', 'Ancho (%)', 38, 15, 100),
    dialogHeight: number('Diálogo', 'Alto (%)', 92, 15, 100),
  });
  static responsiveDefaults = Object.freeze({
    mobile: Object.freeze({
      ...BookEditorialPage.responsiveDefaults.mobile,
      personLeft: 0,
      personTop: 0,
      personWidth: 100,
      personHeight: 50,
      dialogLeft: 2,
      dialogTop: 52,
      dialogWidth: 96,
      dialogHeight: 46,
      nameLeft: 16,
      nameTop: 44,
      nameWidth: 68,
    }),
  });
  static showsProperty(id) {
    return ![
      'dialogLayoutVersion',
      'person1X',
      'person1Y',
      'pos',
      'orientation',
      'side',
      'width',
      'mask',
      'burnSide',
      'blend',
      'burn',
      'thick',
      'titlePlacement',
      'columns',
      'columnGap',
      'edgeGap',
      'capital',
      'capitalSize',
    ].includes(id);
  }
  constructor() {
    super();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('./dialogue-page.css?v=15', import.meta.url);
    link.onload = () => this.schedule();
    this.shadowRoot.append(link);
    this.panel = document.createElement('section');
    this.sheet.classList.add('dialogue-sheet');
    this.panel.className = 'conversation';
    this.panel.innerHTML =
      '<div class="background-hit" data-edit="background" aria-label="Fondo"></div><figure class="person" data-edit="person"><img draggable="false"></figure><div class="nameplate" data-edit="name"><strong></strong><span></span></div><section class="exchange" data-edit="dialog"><p class="line" aria-live="polite"></p><p class="selected-answer" hidden></p><div class="choice-area"><div class="choices" role="group" aria-label="Respuestas"></div><div class="choice-nav"><button type="button" data-slide="-1" aria-label="Respuestas anteriores">‹</button><button type="button" data-slide="1" aria-label="Respuestas siguientes">›</button></div></div></section>';
    this.sheet.append(this.panel);
    this.selected = null;
    let drag = null;
    const label = {
      background: 'Fondo',
      person: 'Personaje',
      name: 'Placa de nombre',
      dialog: 'Panel de diálogo',
    };
    this.panel.addEventListener('pointerdown', (event) => {
      if (
        !this.hasAttribute('editor-mode') ||
        event.pointerType === 'touch' ||
        event.button !== 0 ||
        event.target.closest('button')
      )
        return;
      const target = event.target.closest('[data-edit]');
      if (!target) return;
      const kind = target.dataset.edit,
        rectangle = this.sheet.getBoundingClientRect();
      drag = { kind, x: event.clientX, y: event.clientY, rectangle, start: this.effective, moved: false };
      this.panel
        .querySelectorAll('[data-edit]')
        .forEach((node) => node.toggleAttribute('data-selected', node === target));
      this.panel.setPointerCapture(event.pointerId);
      this.dispatchEvent(
        new CustomEvent('editor-move', {
          detail: { phase: 'start', label: label[kind], view: this.view },
          bubbles: true,
          composed: true,
        }),
      );
    });
    this.panel.addEventListener('pointermove', (event) => {
      if (!drag) return;
      const dx = ((event.clientX - drag.x) / drag.rectangle.width) * 100;
      const dy = ((event.clientY - drag.y) / drag.rectangle.height) * 100;
      if (Math.abs(dx) + Math.abs(dy) < 0.3) return;
      drag.moved = true;
      const clamp = (value, min, max) => Math.round(Math.max(min, Math.min(max, value)) * 10) / 10;
      const initial = drag.start,
        values = {};
      if (drag.kind === 'background') {
        values.backgroundX = clamp(initial.backgroundX - dx, 0, 100);
        values.backgroundY = clamp(initial.backgroundY - dy, 0, 100);
      } else {
        const prefix = drag.kind === 'person' ? 'person' : drag.kind === 'name' ? 'name' : 'dialog';
        values[prefix + 'Left'] = clamp(initial[prefix + 'Left'] + dx, -100, 100);
        values[prefix + 'Top'] = clamp(initial[prefix + 'Top'] + dy, -100, 100);
        if (prefix === 'person') {
          values.nameLeft = clamp(initial.nameLeft + dx, -100, 100);
          values.nameTop = clamp(initial.nameTop + dy, -100, 100);
        }
      }
      this.dispatchEvent(
        new CustomEvent('editor-move', {
          detail: { phase: 'move', values, view: this.view },
          bubbles: true,
          composed: true,
        }),
      );
    });
    const endDrag = () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      this.dispatchEvent(
        new CustomEvent('editor-move', {
          detail: { phase: 'end', moved, view: this.view },
          bubbles: true,
          composed: true,
        }),
      );
    };
    this.panel.addEventListener('pointerup', endDrag);
    this.panel.addEventListener('pointercancel', endDrag);
    this.panel.addEventListener('click', (event) => {
      const slide = event.target.closest('button[data-slide]');
      if (slide) {
        const rail = this.panel.querySelector('.choices');
        rail.scrollBy({
          left: Number(slide.dataset.slide) * rail.clientWidth * 0.75,
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
        return;
      }
      const button = event.target.closest('button[data-index]');
      if (!button || this.selected !== null) return;
      const choice = this.content.dialogue?.choices[Number(button.dataset.index)];
      if (!choice) return;
      this.selected = Number(button.dataset.index);
      this.renderDialogue();
      this.dispatchEvent(
        new CustomEvent('dialogue-choice', {
          detail: structuredClone(choice),
          bubbles: true,
          composed: true,
        }),
      );
    });
  }
  applySettings(value) {
    const input = typeof value === 'string' ? JSON.parse(value) : structuredClone(value);
    if (input?.base && (input.base.dialogLayoutVersion || 0) < 2) {
      const previous = input.base.dialogLayoutVersion || 0;
      input.base.dialogLayoutVersion = 2;
      if (!Object.hasOwn(input.base, 'backgroundX')) input.base.backgroundX = Number(input.base.pos ?? 50);
      const mobile = input.responsive?.mobile || {};
      const defaults = this.constructor.responsiveDefaults.mobile;
      const addition =
        previous === 0
          ? defaults
          : { nameLeft: defaults.nameLeft, nameTop: defaults.nameTop, nameWidth: defaults.nameWidth };
      input.responsive = { ...input.responsive, mobile: { ...addition, ...mobile } };
    }
    return super.applySettings(input);
  }
  get content() {
    return super.content;
  }
  set content(value) {
    const dialogue = value.dialogue;
    if (
      !dialogue ||
      !Array.isArray(dialogue.people) ||
      dialogue.people.length !== 1 ||
      !Array.isArray(dialogue.choices) ||
      typeof dialogue.line !== 'string'
    )
      throw TypeError('Diálogo inválido');
    for (const person of dialogue.people) {
      if (
        !person ||
        typeof person.name !== 'string' ||
        typeof person.image !== 'string' ||
        (person.role !== undefined && typeof person.role !== 'string') ||
        typeof person.emotion !== 'string' ||
        !person.emotions ||
        typeof person.emotions !== 'object'
      )
        throw TypeError('Personaje inválido');
    }
    if (dialogue.choices.some((choice) => !choice || typeof choice.label !== 'string'))
      throw TypeError('Respuesta inválida');
    const content = structuredClone(value);
    content.dialogue.people = content.dialogue.people.map((person) => ({
      ...person,
      role: person.role ?? (person.name === 'Hald Eirik' ? 'Capitán de la guardia' : ''),
    }));
    super.content = content;
    this.selected = null;
  }
  paintArt() {
    const settings = this.effective;
    const pose = settings.cameraEnabled
      ? this.camera.pose(settings)
      : {
          x: settings.backgroundX / 100,
          y: settings.backgroundY / 100,
          zoom: settings.backgroundZoom,
          alignment: true,
        };
    drawArt(this.artCanvas, this.art, pose, null, this.imageRatio);
  }
  render() {
    super.render();
    if (this.panel && this._content.dialogue) {
      this.renderDialogue();
    }
  }
  renderDialogue() {
    this.sheet.dataset.dialogueView = this.view;
    const data = this._content.dialogue,
      settings = this.effective;
    const figure = this.panel.querySelector('figure');
    const exchange = this.panel.querySelector('.exchange');
    const plate = this.panel.querySelector('.nameplate');
    Object.assign(plate.style, {
      left: settings.nameLeft + '%',
      top: settings.nameTop + '%',
      width: settings.nameWidth + '%',
    });
    Object.assign(figure.style, {
      left: settings.personLeft + '%',
      top: settings.personTop + '%',
      width: settings.personWidth + '%',
      height: settings.personHeight + '%',
    });
    Object.assign(exchange.style, {
      left: settings.dialogLeft + '%',
      top: settings.dialogTop + '%',
      width: settings.dialogWidth + '%',
      height: settings.dialogHeight + '%',
    });
    exchange.style.setProperty('--dialog-text', settings.ink);
    exchange.style.setProperty('--dialog-paper', settings.paper);
    exchange.style.setProperty('--dialog-size', settings.fs + 'px');
    [figure].forEach((figure, index) => {
      const person = data.people[index],
        image = figure.querySelector('img'),
        n = index + 1;
      const src = person.emotions[person.emotion] || person.image;
      image.onerror = () => {
        if (src !== person.image && person.image) {
          image.onerror = null;
          image.src = person.image;
        }
      };
      if (src && image.getAttribute('src') !== src) image.src = src;
      if (!src) image.removeAttribute('src');
      image.alt = person.name;
      image.style.objectPosition = settings['person' + n + 'X'] + '% ' + settings['person' + n + 'Y'] + '%';
      image.style.transform = 'scale(' + settings['person' + n + 'Zoom'] + ')';
      image.style.transformOrigin = settings['person' + n + 'X'] + '% ' + settings['person' + n + 'Y'] + '%';
      plate.querySelector('strong').textContent = person.name;
      plate.querySelector('span').textContent = person.role || '';
    });
    this.panel.querySelector('.line').textContent = data.line;
    const selected = this.panel.querySelector('.selected-answer');
    selected.hidden = this.selected === null;
    selected.textContent = this.selected === null ? '' : data.choices[this.selected].label;
    this.panel.querySelector('.choice-area').hidden = this.selected !== null;
    const choices = this.panel.querySelector('.choices');
    choices.replaceChildren();
    if (this.selected === null)
      data.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.index = index;
        button.textContent = choice.label;
        choices.append(button);
      });
  }
}
customElements.define(BookEditorialDialogue.componentType, BookEditorialDialogue);
