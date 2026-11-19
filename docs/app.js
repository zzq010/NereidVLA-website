'use strict';

const evaluationData = {
  simulation: {
    labels: ['Obstacle avoidance', 'Target search', 'Pipeline navigation', 'Cave navigation'],
    models: [
      { name: 'Qwen3-VL-8B', values: [84, 52, 71.2, 82.4], overall: 72.4 },
      { name: 'InternVLA-N1', values: [83.2, 46.4, 87.2, 76], overall: 73.2 },
      { name: 'NereidVLA', values: [85.6, 81.6, 86.4, 84], overall: 84.4, ours: true }
    ],
    label: 'MARINE SPATIAL PRETRAINING', gain: '+12.0',
    title: 'Knowledge makes a difference.',
    copy: 'Simulation success improves from 72.4% to 84.4% over direct Qwen3-VL-8B navigation fine-tuning, under matched training and execution settings.',
    note: '500 simulation trials per model: four tasks, 25 instances per task, and five lighting and water conditions. Selected baselines from Table 3 of the paper.',
    caption: 'Success rate by simulation task, in percent'
  },
  real: {
    labels: ['Target approach', 'Obstacle avoidance', 'Goal with obstacles', 'Narrow passage'],
    models: [
      { name: 'Qwen3-VL-8B', values: [35, 80, 15, 10], overall: 35 },
      { name: 'InternVLA-N1', values: [60, 85, 30, 15], overall: 47.5 },
      { name: 'NereidVLA', values: [90, 95, 70, 60], overall: 78.75, ours: true }
    ],
    label: 'TRANSFER TO A PHYSICAL ROBOT', gain: '+31.25',
    title: 'From learning to deployment.',
    copy: 'NereidVLA achieves 78.75% success versus 47.50% for InternVLA-N1 in laboratory-pool trials, without fine-tuning on the real test environment.',
    note: 'Laboratory-pool evaluation on BlueROVHeavy. Overall success is the mean across four equally weighted tasks. Values from Table 4 of the paper.',
    caption: 'Success rate by real-robot task, in percent'
  }
};

const tabs = [...document.querySelectorAll('[data-setting]')];
function renderResults(setting) {
  const data = evaluationData[setting];
  tabs.forEach(button => {
    const selected = button.dataset.setting === setting;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  document.querySelector('#results-panel').setAttribute('aria-labelledby', `tab-${setting}`);
  document.querySelector('#comparison-bars').innerHTML = [...data.models].reverse().map(model => `
    <div class="bar-row${model.ours ? ' ours' : ''}">
      <div class="bar-label"><span>${model.name}</span><span>${model.overall.toFixed(setting === 'real' ? 2 : 1)}%</span></div>
      <div class="bar-track" aria-hidden="true"><div class="bar-fill" style="--value:${model.overall}%"></div></div>
    </div>`).join('');
  document.querySelector('#results-head').innerHTML = `<tr><th scope="col">Model</th>${data.labels.map(label => `<th scope="col">${label}</th>`).join('')}<th scope="col">Overall</th></tr>`;
  document.querySelector('#results-body').innerHTML = data.models.map(model => `<tr${model.ours ? ' class="ours"' : ''}><th scope="row">${model.name}</th>${model.values.map(value => `<td>${value.toFixed(2)}</td>`).join('')}<td>${model.overall.toFixed(2)}</td></tr>`).join('');
  document.querySelector('#table-caption').textContent = data.caption;
  document.querySelector('#insight-label').textContent = data.label;
  document.querySelector('#insight-number').innerHTML = `${data.gain}<span>pp</span>`;
  document.querySelector('#insight-title').textContent = data.title;
  document.querySelector('#insight-copy').textContent = data.copy;
  document.querySelector('#results-note').textContent = data.note;
}
tabs.forEach((button, index) => {
  button.addEventListener('click', () => renderResults(button.dataset.setting));
  button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = 1 - index;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    renderResults(tabs[next].dataset.setting);
    tabs[next].focus();
  });
});
renderResults('simulation');

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  mobileNav.hidden = true;
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mobileNav.hidden = !open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const figureDialog = document.querySelector('#figure-dialog');
document.querySelectorAll('[data-zoom]').forEach(button => {
  button.addEventListener('click', () => {
    const image = document.querySelector('#dialog-image');
    image.src = button.dataset.zoom;
    image.alt = button.querySelector('img').alt;
    document.querySelector('#dialog-caption').textContent = button.dataset.caption;
    figureDialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
document.querySelector('#close-dialog').addEventListener('click', () => figureDialog.close());
figureDialog.addEventListener('click', event => {
  const rect = figureDialog.getBoundingClientRect();
  if (event.target === figureDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) figureDialog.close();
});
figureDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));

document.querySelector('#copy-citation').addEventListener('click', async event => {
  const button = event.currentTarget;
  const text = document.querySelector('#bibtex').textContent;
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(text);
    button.querySelector('span').textContent = 'Copied!';
    status.textContent = 'Citation copied to clipboard.';
    setTimeout(() => { button.querySelector('span').textContent = 'Copy citation'; }, 2400);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('#bibtex'));
    selection.removeAllRanges();
    selection.addRange(range);
    button.querySelector('span').textContent = 'Press Ctrl/Cmd+C';
    status.textContent = 'Citation selected. Press Control C or Command C to copy.';
  }
});

const observedSections = [...document.querySelectorAll('section[id]')];
const navigationLinks = [...document.querySelectorAll('.desktop-nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const active = entries.find(entry => entry.isIntersecting);
    if (!active) return;
    navigationLinks.forEach(link => {
      if (link.hash === `#${active.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });
  observedSections.forEach(section => observer.observe(section));
}
