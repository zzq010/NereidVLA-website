'use strict';

const evaluationSettings = {
  simulation: {
    chartModels: ['NereidVLA', 'InternVLA-N1', 'Qwen3-VL-8B'],
    chartIndex: 4, chartMax: 100, chartDecimals: 1, chartUnit: '%', chartTitle: 'Overall success',
    scale: ['0', '25', '50', '75', '100'], lowerColumns: [5], decimals: [2, 2, 2, 2, 2, 4, 2],
    rateColumns: [0, 1, 2, 3, 4, 6],
    label: 'MARINE SPATIAL PRETRAINING', gain: '+12.0', gainUnit: 'pp',
    title: 'Knowledge makes a difference.',
    copy: 'Sea2Know initialization improves success from 72.4% to 84.4% over direct Qwen3-VL-8B navigation adaptation, with matched downstream supervision and execution settings.',
    metric: 'Success & efficiency: higher is better · Jerk: lower',
    note: 'Paper Table 3 · 500 executions per model. † U0 and π₀.₅-USIM retain their original checkpoints without navigation adaptation. Other baselines share navigation training samples, but not necessarily architectures or optimization settings.',
    caption: 'Closed-loop simulation: task success, overall success, and Grid-SPL in percent; Jerk RMS in meters per second cubed',
    protocol: '<p>Each model is evaluated on four tasks, 25 instances per task, and five water and lighting conditions. The policy replans at 1 Hz of simulated time. Success requires completing the goal within the time limit without safety violations; collisions and timeouts are failures.</p><p><strong>Grid-SPL</strong> measures success-weighted path efficiency against robot-aware A* reference paths on a 0.25 m 3D occupancy grid. <strong>Jerk RMS</strong> measures translational smoothness in m/s³, averaging all runs, including failures. Higher Grid-SPL and lower Jerk RMS are better.</p>'
  },
  real: {
    chartModels: ['NereidVLA', 'InternVLA-N1', 'Qwen3-VL-8B'],
    chartIndex: 4, chartMax: 100, chartDecimals: 2, chartUnit: '%', chartTitle: 'Overall success',
    scale: ['0', '25', '50', '75', '100'], lowerColumns: [], decimals: [2, 2, 2, 2, 2],
    rateColumns: [0, 1, 2, 3, 4],
    label: 'TRANSFER TO A PHYSICAL ROBOT', gain: '+31.25', gainUnit: 'pp',
    title: 'From learning to execution.',
    copy: 'NereidVLA completes 63 of 80 laboratory-pool trials: 78.75% success compared with 47.50% for InternVLA-N1, without fine-tuning on the real test environment.',
    metric: 'Task success rate · Higher is better',
    note: 'Paper Table 4 · BlueROVHeavy laboratory-pool experiments. Each model runs 20 trials per task, with varied target positions and obstacle layouts, using the same controller and evaluation conditions.',
    caption: 'Laboratory-pool success rate by task, in percent',
    protocol: '<p>Each model completes 80 trials across four equally weighted tasks. Success requires task completion without collision. Target-approach tasks require reaching within 1.5 m of the target; narrow-passage trials require crossing the specified endpoint.</p><p>No data from the real test environment are used for fine-tuning. These results evaluate transfer to laboratory-pool robot execution.</p>'
  },
  offline: {
    chartModels: ['NereidVLA (8B)', 'SimpleVLN (8B)', 'InternVLA-N1'],
    chartIndex: 0, chartMax: 0.25, chartDecimals: 5, chartUnit: 'm', chartTitle: 'Average displacement error',
    scale: ['0', '0.05', '0.10', '0.15', '0.20', '0.25'], lowerColumns: [0, 1, 2, 3, 4], decimals: [5, 5, 5, 5, 5],
    rateColumns: [],
    label: 'OFFLINE TRAJECTORY PREDICTION', gain: '4 / 5', gainUnit: 'metrics',
    title: 'More accurate local trajectories.',
    copy: 'NereidVLA achieves the lowest error on four of five reported metrics in unseen scenes. SimpleVLN has the lower ADE P95.',
    metric: 'Trajectory errors in meters · Lower is better',
    note: 'Paper Table 2 · Predicted trajectories are compared with expert trajectories in unseen scenes, independently of closed-loop task success. All errors are measured in meters.',
    caption: 'Offline trajectory prediction errors in meters; lower is better for all five metrics',
    protocol: '<p><strong>ADE</strong> is the mean waypoint error. <strong>FDE</strong> is the final endpoint error. <strong>Z MAE</strong> measures vertical error. <strong>P95</strong> reports the 95th percentile across test samples.</p><p>Offline evaluation uses approximately 10,000 samples. Offline prediction and closed-loop simulation use 50 independent held-out scenes with unseen assets, layouts, and structures.</p>'
  }
};

function makeBar(name, value, width, ours, formatted) {
  return `<div class="bar-row${ours ? ' ours' : ''}"><div class="bar-label"><span>${name}</span><span>${formatted}</span></div><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="--value:${width}%"></div></div></div>`;
}

const tabs = [...document.querySelectorAll('[data-setting]')];
function renderResults(setting) {
  const config = evaluationSettings[setting];
  const data = researchData[setting];
  tabs.forEach(button => {
    const selected = button.dataset.setting === setting;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  document.querySelector('#results-panel').setAttribute('aria-labelledby', `tab-${setting}`);
  document.querySelector('#chart-metric').textContent = config.chartTitle;
  document.querySelector('#chart-unit').textContent = config.chartUnit;
  document.querySelector('#metric-label').textContent = config.metric;
  document.querySelector('#chart-scale').innerHTML = config.scale.map(value => `<span>${value}</span>`).join('');
  document.querySelector('#comparison-bars').innerHTML = config.chartModels.map(name => {
    const model = data.models.find(item => item.name === name);
    const value = model.values[config.chartIndex];
    return makeBar(model.name, value, value / config.chartMax * 100, model.ours, `${value.toFixed(config.chartDecimals)}${config.chartUnit === 'm' ? ' m' : '%'}`);
  }).join('');
  document.querySelector('#chart-footnote').textContent = setting === 'real' ? 'All evaluated models · Detailed task results below' : 'Selected baselines · Full comparison below';
  document.querySelector('#results-head').innerHTML = `<tr>${data.headers.map(label => `<th scope="col">${label}</th>`).join('')}</tr>`;
  const best = data.headers.slice(1).map((_, index) => (config.lowerColumns.includes(index) ? Math.min : Math.max)(...data.models.map(model => model.values[index])));
  document.querySelector('#results-body').innerHTML = data.models.map(model => `<tr${model.ours ? ' class="ours"' : ''}><th scope="row">${model.name}</th>${model.values.map((value, index) => {
    const isBest = value === best[index];
    const content = value.toFixed(config.decimals[index]);
    return `<td${config.rateColumns.includes(index) ? ` class="data-cell" style="--cell-value:${value}%"` : ''}>${isBest ? `<strong title="Best in this column">${content}</strong>` : `<span>${content}</span>`}</td>`;
  }).join('')}</tr>`).join('');
  document.querySelector('#table-caption').textContent = config.caption;
  document.querySelector('#insight-label').textContent = config.label;
  document.querySelector('#insight-number').innerHTML = `${config.gain}<span>${config.gainUnit}</span>`;
  document.querySelector('#insight-title').textContent = config.title;
  document.querySelector('#insight-copy').textContent = config.copy;
  document.querySelector('#results-note').textContent = config.note;
  document.querySelector('#evaluation-protocol-copy').innerHTML = config.protocol;
  document.querySelector('.table-key').textContent = `Bold indicates the best value in each column.${setting === 'offline' ? '' : ' Subtle bars show percentage values.'}`;
}

function wireTabs(buttons, activate) {
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => activate(button));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      activate(buttons[next]);
      buttons[next].focus();
    });
  });
}
wireTabs(tabs, button => renderResults(button.dataset.setting));
renderResults('simulation');

const dimensionDescriptions = [
  'Locate the task-relevant target referred to in an underwater scene.',
  'Understand the relative spatial relationships between underwater objects.',
  'Recognize passage geometry, openings, and the structure of navigable spaces.',
  'Judge which parts of a scene are visually traversable. This tests perception rather than vehicle-specific dynamic feasibility.',
  'Reason about changes across four RGB observations, including target position, visibility, and apparent size.',
  'Choose visually plausible local actions. Questions with multiple correct answers require an exact match to the reference option set.'
];
const dimensionTabs = [...document.querySelectorAll('[data-dimension]')];
function renderDimension(button) {
  const index = Number(button.dataset.dimension);
  dimensionTabs.forEach(tab => {
    tab.setAttribute('aria-selected', String(tab === button));
    tab.tabIndex = tab === button ? 0 : -1;
  });
  document.querySelector('#dimension-panel').setAttribute('aria-labelledby', button.id);
  document.querySelector('#dimension-code').textContent = researchData.understanding.headers[index + 1];
  document.querySelector('#dimension-title').textContent = button.textContent;
  document.querySelector('#dimension-description').textContent = dimensionDescriptions[index];
  const baseline = researchData.understanding.models[0];
  const ours = researchData.understanding.models[1];
  const gain = (ours.values[index] - baseline.values[index]).toFixed(2);
  document.querySelector('#dimension-gain').innerHTML = `+${gain} <small>pp</small>`;
  document.querySelector('#dimension-bars').innerHTML = [ours, baseline].map(model => makeBar(model.name, model.values[index], model.values[index], model.ours, `${model.values[index].toFixed(2)}%`)).join('');
}
wireTabs(dimensionTabs, renderDimension);
renderDimension(dimensionTabs[0]);

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
window.matchMedia('(min-width: 981px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

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
