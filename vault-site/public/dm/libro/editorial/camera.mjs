// All rectangles use fractions of the original image. X/Y settings are percentages of its center.
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export function cropRect(sourceRatio, targetRatio, { x, y, zoom, alignment = false }) {
  const width = Math.min(1, targetRatio / sourceRatio) / zoom;
  const height = Math.min(1, sourceRatio / targetRatio) / zoom;
  return {
    x: alignment ? (1 - width) * x : clamp(x - width / 2, 0, 1 - width),
    y: clamp(y - height / 2, 0, 1 - height),
    width,
    height,
  };
}
export function cameraFrame(s, end = false) {
  const prefix = end ? 'cameraEnd' : 'cameraStart';
  return { x: s[prefix + 'X'] / 100, y: s[prefix + 'Y'] / 100, zoom: s[prefix + 'Zoom'] };
}
export class EditorialCamera {
  constructor(paint) {
    this.paint = paint;
    this.frame = 0;
    this.progress = 0;
  }
  stop() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }
  reset() {
    this.stop();
    this.progress = 0;
  }
  pose(s) {
    if (!s.cameraEnabled) return { x: s.pos / 100, y: 0.5, zoom: 1, alignment: true };
    const a = cameraFrame(s),
      b = cameraFrame(s, true),
      t = this.progress;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, zoom: a.zoom + (b.zoom - a.zoom) * t };
  }
  play(s) {
    this.stop();
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const start = performance.now();
    const tick = (now) => {
      const t =
        media.matches || !s.cameraEnabled ? 1 : clamp((now - start) / (1000 * s.cameraDuration), 0, 1);
      this.progress =
        { linear: t, 'ease-in': t * t, 'ease-out': 1 - (1 - t) ** 2, 'ease-in-out': t * t * (3 - 2 * t) }[
          s.cameraEasing
        ] ?? t;
      this.paint();
      this.frame = t < 1 ? requestAnimationFrame(tick) : 0;
    };
    tick(start);
  }
}
