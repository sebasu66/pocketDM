// Native V11 paragraph flow. Geometry stays aligned with the fixed figure while reading scrolls.
export function createTextFlow(root) {
  const $ = (id) => root.getElementById(id),
    obstacleNode = $('textContour');
  let s,
    edge,
    band,
    stacked,
    narration,
    columnSignature = '';
  function arrangeColumns() {
    const read = $('reading'),
      fig = $('fig'),
      flow = $('paragraphs'),
      right = s.side === 'right',
      gap = +s.columnGap,
      cs = getComputedStyle(read);
    const usable = read.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    let edgeMax = 0;
    for (let i = 0; i <= 100; i++) edgeMax = Math.max(edgeMax, edge(i) + band(i));
    const artInset = stacked
      ? 0
      : Math.max(0, fig.clientWidth * Math.min(1, edgeMax / 100) + +s.edgeGap - 14);
    const narrow = (usable - artInset - gap) / 2;
    const choice = s.columns,
      fs = +s.fs;
    const two = choice !== 'one' && narrow >= Math.max(130, fs * (choice === 'two' ? 8 : 12));
    const widthA = right ? narrow : narrow + artInset,
      widthB = right ? narrow + artInset : narrow;
    flow.style.setProperty('--col-a', widthA + 'px');
    flow.style.setProperty('--col-b', widthB + 'px');
    flow.style.setProperty('--column-gap', gap + 'px');
    const raw = narration,
      sig = JSON.stringify([raw, two, right]);
    if (sig === columnSignature) return;
    columnSignature = sig;
    const paragraphs = raw.split(/\n\s*\n/).filter((x) => x.trim());
    function makeP(value, continued = false) {
      const p = document.createElement('p');
      p.textContent = value;
      if (continued) p.className = 'continued';
      return p;
    }
    flow.classList.toggle('two-column', two);
    if (!two) {
      flow.replaceChildren(obstacleNode, ...paragraphs.map((x) => makeP(x)));
      return;
    }
    const total = paragraphs.reduce((n, p) => n + p.length, 0),
      target = total / 2;
    // Prefer whole paragraphs. Split only when the imbalance would be conspicuous; keep reading order.
    let count = 0,
      best = 0,
      diff = Infinity;
    for (let i = 1; i < paragraphs.length; i++) {
      count += paragraphs[i - 1].length;
      const d = Math.abs(count - target);
      if (d < diff) {
        best = i;
        diff = d;
      }
    }
    let first = [],
      second = [];
    let continuation = false;
    if (best > 0 && diff <= total * 0.2) {
      first = paragraphs.slice(0, best);
      second = paragraphs.slice(best);
    } else {
      let offset = 0;
      for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i];
        if (offset + p.length >= target) {
          const local = target - offset;
          let stops = [...p.matchAll(/[.!?](?=\s)/g)].map((m) => m.index + 1);
          let cut = stops.sort((a, b) => Math.abs(a - local) - Math.abs(b - local))[0];
          if (!cut || Math.abs(cut - local) > Math.max(20, p.length * 0.2)) {
            const spaces = [...p.matchAll(/\s+/g)].map((m) => m.index);
            cut = spaces.sort((a, b) => Math.abs(a - local) - Math.abs(b - local))[0] || p.length;
          }
          first = [...paragraphs.slice(0, i), p.slice(0, cut).trimEnd()].filter(Boolean);
          second = [p.slice(cut).trimStart(), ...paragraphs.slice(i + 1)].filter(Boolean);
          continuation = cut < p.length;
          break;
        }
        offset += p.length;
      }
    }
    const a = document.createElement('div'),
      b = document.createElement('div');
    a.className = b.className = 'text-column';
    if (!right) a.append(obstacleNode);
    else b.append(obstacleNode);
    a.append(...first.map((x) => makeP(x)));
    b.append(...second.map((x, i) => makeP(x, i === 0 && continuation)));
    flow.replaceChildren(a, b);
  }

  function wrapContour() {
    const read = $('reading'),
      fig = $('fig');
    if (!read.clientHeight || !fig.clientHeight) return;
    arrangeColumns();
    const obstacle = $('textContour'),
      flow = obstacle.parentElement;
    const scale = fig.getBoundingClientRect().width / fig.offsetWidth || 1;
    const rect = (node) => {
      const r = node.getBoundingClientRect();
      return { top: r.top / scale, bottom: r.bottom / scale, left: r.left / scale, right: r.right / scale };
    };
    const rr = rect(read),
      fr = rect(fig),
      pr = rect(flow),
      right = s.side === 'right',
      css = getComputedStyle(read),
      innerLeft = pr.left,
      innerRight = pr.right;
    const width = fig.clientWidth,
      height = fig.clientHeight,
      gap = +s.edgeGap;
    const offset = right ? innerRight - fr.right : fr.left - innerLeft;
    const extent = (t) => Math.max(0, offset + width * Math.min(1, (edge(t) + band(t)) / 100) + gap);
    if (stacked) {
      obstacle.style.cssText = 'display:none';
      $('paragraphs').style.height = 'auto';
      return;
    }
    obstacle.style.display = 'block';
    let max = 0;
    for (let y = 0; y <= 100; y += 0.2) max = Math.max(max, extent(y));
    const maxW = Math.min(Math.ceil(max), Math.max(0, flow.clientWidth - 16));
    const yStart = Math.max(0, rr.top + parseFloat(css.paddingTop) - pr.top),
      yEnd = Math.max(yStart, rr.bottom - parseFloat(css.paddingBottom) - pr.top);
    const h = Math.max(100000, yEnd + 1000);
    const points = [
      [0, 0],
      [maxW, 0],
      [maxW, yStart],
    ];
    // Sample the source contour in physical viewport coordinates, not content coordinates.
    for (let y = yStart; y < yEnd; y += 2) {
      const screenY = pr.top + y;
      const t = 100 * Math.max(0, Math.min(1, (screenY - fr.top) / height));
      points.push([Math.min(maxW, extent(t)), y]);
    }
    const t = 100 * Math.max(0, Math.min(1, (pr.top + yEnd - fr.top) / height));
    points.push([Math.min(maxW, extent(t)), yEnd], [maxW, yEnd], [maxW, h], [0, h]);
    obstacle.classList.toggle('right', right);
    obstacle.style.width = maxW + 'px';
    obstacle.style.height = h + 'px';
    obstacle.style.shapeOutside =
      'polygon(' +
      points.map(([x, y]) => `${(right ? maxW - x : x).toFixed(2)}px ${y.toFixed(2)}px`).join(',') +
      ')';
    // The tall exclusion is purely geometric, not part of the narrative's scroll extent. Clip it to the actual paragraph boxes.
    const textRoot = $('paragraphs'),
      top = rect(textRoot).top;
    const bottoms = [...textRoot.querySelectorAll('p')].map((p) => rect(p).bottom - top);
    textRoot.style.height = Math.max(1, Math.ceil(Math.max(0, ...bottoms))) + 'px';
  }

  return (settings, geometry, vertical, text) => {
    s = settings;
    ({ edge, band } = geometry);
    stacked = vertical;
    narration = text;
    wrapContour();
  };
}
