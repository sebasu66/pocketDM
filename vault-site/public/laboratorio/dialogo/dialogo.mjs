import { demoCheck, outcomes } from '../../libro/check-contract.mjs';
import { encounterSites, preferredViews, scenes, skills } from './escenas.mjs';

const artPath = '/docs/art-references/stormkeep-work-20261125/';
const selection = document.querySelector('#npc');
const rollMode = document.querySelector('#roll');
const reset = document.querySelector('#reset');
const scene = document.querySelector('.scene');
const loading = document.querySelector('#loading');
const speaker = document.querySelector('#speaker');
const occupation = document.querySelector('#occupation');
const location = document.querySelector('#location');
const portrait = document.querySelector('#portrait');
const background = document.querySelector('#background');
const ambient = document.querySelector('#ambient');
const reading = document.querySelector('#reading');
const chosen = document.querySelector('#chosen');
const check = document.querySelector('#check');
const line = document.querySelector('#line');
const choices = document.querySelector('#choices');

async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error('No se pudo cargar ' + path);
  return response.json();
}

function artwork(entry) {
  if (!entry?.image) return null;
  return entry.image.startsWith('/') ? entry.image : artPath + entry.image;
}

function buildCast(population, manifest) {
  const art = new Map(manifest.entries.map(entry => [entry.key, entry]));
  const sites = new Map(population.sites.map(site => [site.id, site.name]));
  return population.actors.map(actor => {
    const key = actor.id.split('.').at(-1);
    const site = encounterSites[key] ?? actor.workplaceId ?? actor.homeAreaId;
    const backdrop = art.get(preferredViews[site]);
    if (!scenes[key] || !backdrop?.image) throw new Error('Escena incompleta: ' + actor.name);
    return {
      key,
      name: actor.name,
      role: actor.role,
      location: sites.get(site),
      backdrop: artwork(backdrop),
      portrait: artwork(art.get(key)),
      dialogue: scenes[key],
    };
  }).sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

function addChoice(label, action, skillName) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  if (skillName) {
    const tag = document.createElement('small');
    tag.textContent = skillName;
    button.append(' ', tag);
  }
  button.addEventListener('click', action);
  choices.append(button);
}

function presentResult(label, answer, result) {
  chosen.textContent = label;
  chosen.hidden = false;
  check.hidden = !result;
  check.replaceChildren();
  if (result) {
    const title = document.createElement('strong');
    title.textContent = result.skillName + ' · ' + outcomes[result.outcome];
    const numbers = document.createElement('p');
    numbers.textContent = result.difficulty + ' · D100: ' + result.roll + ' · Objetivo: ' + result.target + '% (base ' + result.base + '%)';
    check.dataset.outcome = result.outcome;
    check.append(title, numbers);
  }
  line.textContent = answer;
  reading.scrollTop = 0;
  choices.replaceChildren();
  reading.focus({ preventScroll: true });
}

function showOptions(focusFirst = false) {
  const { dialogue } = cast.get(selection.value);
  chosen.hidden = true;
  check.hidden = true;
  line.textContent = dialogue.opening;
  reading.scrollTop = 0;
  choices.replaceChildren();
  addChoice(dialogue.ask, () => presentResult(dialogue.ask, dialogue.answer));
  const skill = skills[dialogue.skill];
  addChoice(dialogue.attempt, () => {
    const presetRolls = { success: 28, failure: 76 };
    const roll = presetRolls[rollMode.value] ?? 1 + Math.floor(Math.random() * 100);
    const result = demoCheck({
      id: 'demo-dialogue-' + selection.value,
      actorId: 'demo-visitor',
      actorName: 'Viajero de prueba',
      skillId: dialogue.skill,
      skillName: skill.name,
      base: skill.base,
      difficulty: skill.difficulty,
      roll,
      reason: dialogue.attempt,
    });
    presentResult(dialogue.attempt, dialogue[result.outcome], result);
  }, skill.name);
  if (focusFirst) choices.firstElementChild.focus({ preventScroll: true });
}

function changeNPC() {
  const npc = cast.get(selection.value);
  speaker.textContent = npc.name;
  occupation.textContent = npc.role;
  location.textContent = npc.location + (npc.portrait ? '' : ' · Retrato pendiente');
  background.src = npc.backdrop;
  ambient.src = npc.backdrop;
  ambient.hidden = false;
  portrait.hidden = !npc.portrait;
  if (npc.portrait) portrait.src = npc.portrait;
  else portrait.removeAttribute('src');
  showOptions();
}

let cast;
async function init() {
  const [population, manifest] = await Promise.all([
    loadJSON('/data/stormkeep-population-v02.json'),
    loadJSON(artPath + 'manifest.json'),
  ]);
  const residents = buildCast(population, manifest);
  cast = new Map(residents.map(npc => [npc.key, npc]));
  selection.replaceChildren(...residents.map(npc => new Option(npc.name, npc.key)));
  selection.value = 'hald';
  changeNPC();
  loading.hidden = true;
  scene.hidden = false;
  selection.disabled = false;
  reset.disabled = false;
  selection.addEventListener('change', changeNPC);
  reset.addEventListener('click', () => showOptions(true));
}

init().catch(error => {
  console.error(error);
  loading.textContent = 'No se pudo cargar el laboratorio de Stormkeep. Recargá la página para volver a intentar.';
});
