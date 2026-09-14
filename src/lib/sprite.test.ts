/**
 * Tests for spriteHref. As in assets.test.ts, `bun run test` has no Vite
 * `import.meta.env`, so BASE_URL falls back to "/" — these lock the root-served
 * shape and, more importantly, that the URL is built THROUGH resolveAsset rather
 * than hand-written.
 */
import { expect, test } from 'vitest';
import { resolveAsset } from './assets';
import { spriteHref } from './sprite';

test('spriteHref: a symbol id becomes a base-aware `<use href>`', () => {
  expect(spriteHref('brand-facebook')).toBe('/icons.svg#brand-facebook');
});

test('spriteHref: the sprite path is resolveAsset output, not a hand-written literal', () => {
  // The assertion that actually protects anti-pattern #28: whatever resolveAsset
  // makes of `icons.svg` under a non-root base, this is a prefix of it — so a future
  // edit to the base logic cannot leave this helper behind.
  expect(spriteHref('brand-x').startsWith(resolveAsset('icons.svg'))).toBe(true);
});

test('spriteHref: never emits a root-absolute `/icons.svg` independent of the base', () => {
  const [path] = spriteHref('brand-youtube').split('#');
  expect(path).toBe(resolveAsset('icons.svg'));
});
