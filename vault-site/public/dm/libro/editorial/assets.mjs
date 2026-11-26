const files = {
  plaza: 'assets/plaza.webp',
  extended: 'assets/extended.webp',
  forja: 'assets/forja.webp',
  burn: 'assets/burn.png',
  paper: 'assets/paper.webp',
};
export const assets = Object.fromEntries(
  Object.entries(files).map(([key, path]) => [key, new URL(path, import.meta.url).href]),
);
