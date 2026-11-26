import { BookEditorialPage } from './editorial-page.mjs';

const number = (label, value, min, max, step = 1) => ({
  group: 'Retratos',
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
    person1X: number('NPC · posición horizontal', 50, 0, 100),
    person1Y: number('NPC · posición vertical', 0, 0, 100),
    person1Zoom: number('NPC · zoom', 1, 1, 3, 0.05),
  });
  constructor() {
    super();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('./dialogue-page.css', import.meta.url);
    this.shadowRoot.append(link);
    this.panel = document.createElement('section');
    this.panel.className = 'conversation';
    this.panel.innerHTML =
      '<div class="people"><figure><img><figcaption></figcaption></figure></div><div class="exchange"><p class="line" aria-live="polite"></p><div class="choices" role="group" aria-label="Respuestas"></div></div>';
    this.sheet.append(this.panel);
    this.selected = null;
    this.panel.addEventListener('click', (event) => {
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
        typeof person.emotion !== 'string' ||
        !person.emotions ||
        typeof person.emotions !== 'object'
      )
        throw TypeError('Personaje inválido');
    }
    if (dialogue.choices.some((choice) => !choice || typeof choice.label !== 'string'))
      throw TypeError('Respuesta inválida');
    super.content = value;
    this.selected = null;
  }
  render() {
    super.render();
    if (this.panel && this._content.dialogue) this.renderDialogue();
  }
  renderDialogue() {
    const data = this._content.dialogue,
      settings = this.effective;
    this.panel.querySelectorAll('figure').forEach((figure, index) => {
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
      figure.querySelector('figcaption').textContent = person.name;
    });
    this.panel.querySelector('.line').textContent =
      this.selected === null ? data.line : data.choices[this.selected].label;
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
