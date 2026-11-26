import { profile, bounds, shapes } from './contour-data.mjs';
import { cropRect } from './camera.mjs';
const [min, max, sourceWidth, sourceHeight] = bounds;
function sample(t) {
  const u = Math.max(0, Math.min(1, t)) * (profile.length - 1),
    i = Math.min(profile.length - 2, Math.floor(u)),
    a = profile[i],
    b = profile[i + 1];
  return a.map((v, k) => v + (b[k] - v) * (u - i));
}
export function contour(s, width, height, vertical) {
  const scale = Math.min(
      0.085,
      (((100 * (vertical ? width / height : height / width)) / sourceWidth) * s.thick) / 4,
    ),
    origin = 90 - (max - min) * scale;
  function edge(y) {
    if (s.mask === 'none') return 100;
    if (s.mask === 'rasgado') return origin + (sample(y / 100)[1] - min) * scale;
    const points = shapes[s.mask].slice(1, -1);
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      if (y <= b[1]) return a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1] || 1);
    }
    return points.at(-1)[0];
  }
  const thickness = (y) => (s.mask === 'none' ? 0 : (sample(y / 100)[2] - sample(y / 100)[1]) * scale);
  return {
    edge,
    scale,
    origin,
    thickness,
    band: (y) => (s.burnSide === 'paper' && s.burn ? thickness(y) : 0),
  };
}
function orient(ctx, side, n) {
  if (side === 'top') ctx.transform(0, 1, 1, 0, 0, 0);
  if (side === 'bottom') ctx.transform(0, -1, 1, 0, 0, n);
  if (side === 'right') ctx.transform(-1, 0, 0, 1, n, 0);
}
export function maskPath(geometry, side, n) {
  const p = new Path2D();
  p.moveTo(0, 0);
  for (let i = 0; i <= 1000; i++) p.lineTo((geometry.edge(i / 10) * n) / 100, (i * n) / 1000);
  p.lineTo(0, n);
  p.closePath();
  const output = new Path2D();
  const matrix = { right: [-1, 0, 0, 1, n, 0], top: [0, 1, 1, 0, 0, 0], bottom: [0, -1, 1, 0, 0, n] }[
    side
  ] || [1, 0, 0, 1, 0, 0];
  output.addPath(p, new DOMMatrix(matrix));
  return output;
}
export function drawArt(canvas, image, pose, mask, ratio) {
  const ctx = canvas.getContext('2d'),
    n = canvas.width;
  ctx.clearRect(0, 0, n, n);
  if (!image?.naturalWidth || !ratio) return;
  const w = image.naturalWidth,
    h = image.naturalHeight,
    r = cropRect(w / h, ratio, pose);
  ctx.save();
  if (mask) ctx.clip(mask);
  ctx.drawImage(image, r.x * w, r.y * h, r.width * w, r.height * h, 0, 0, n, n);
  ctx.restore();
}
export function drawBurn(canvas, image, s, g, side) {
  const ctx = canvas.getContext('2d'),
    n = canvas.width;
  ctx.clearRect(0, 0, n, n);
  if (!s.burn || s.mask === 'none' || !image.naturalWidth) return;
  const onPaper = s.burnSide === 'paper';
  ctx.save();
  orient(ctx, side, n);
  if (s.mask === 'rasgado' && onPaper) {
    ctx.transform(
      0,
      n / sourceWidth,
      (g.scale * n) / 100,
      0,
      ((g.origin - min * g.scale) * n) / 100 - 0.6,
      0,
    );
    ctx.drawImage(image, 0, 0);
  } else
    for (let y = 0; y < n; y++) {
      const t = (y + 0.5) / n,
        [x, lo, hi] = sample(t),
        sy = Math.max(0, lo - 2);
      ctx.save();
      ctx.translate((g.edge(t * 100) * n) / 100 + (onPaper ? -0.6 : 0.6), y);
      ctx.transform(0, 1, onPaper ? 1 : -1, 0, 0, 0);
      ctx.drawImage(
        image,
        x,
        sy,
        Math.max(1, sourceWidth / n),
        Math.min(sourceHeight - sy, hi - sy + 3),
        0,
        0,
        1.15,
        (g.thickness(t * 100) * n) / 100,
      );
      ctx.restore();
    }
  ctx.restore();
}
