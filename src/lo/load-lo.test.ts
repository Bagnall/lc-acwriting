/**
 * load-lo.test.ts — the two readers, against the real LOs on disk.
 *
 * The point of the second assertion set is Part D: the pre-render runs in plain Node,
 * so "the same LO loads from Node" has to be TESTED, not assumed. Both readers feed
 * the same assembler, so their output must be identical.
 *
 * Content-agnostic: expectations come from each LO's own `lo.json`, so this holds for
 * whatever course is in `lo-config/`. (It used to name the template's example LO,
 * which this course no longer ships — see src/test-fixtures/example-lo.ts.)
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test, expect } from 'vitest';
import { loadLo as loadLoFromGlob, listLoSlugs as globSlugs } from './load-lo-glob';
import { loadLo as loadLoFromDisk, listLoSlugs as diskSlugs } from './load-lo-disk';
import { LO_CONFIG_DIR } from './lo-folders';

const SLUGS = diskSlugs();

interface RawManifest {
  title: string;
  sections: { id: string; blocks?: string[]; exercises?: string[] }[];
}
const manifestOf = (slug: string): RawManifest =>
  JSON.parse(readFileSync(path.join(LO_CONFIG_DIR, slug, 'lo.json'), 'utf-8')) as RawManifest;

test('the course ships at least one LO', () => {
  expect(SLUGS.length).toBeGreaterThan(0);
});

test.each(SLUGS)('loadLo (glob): %s loads with its sections and parts in order', (slug) => {
  const lo = loadLoFromGlob(slug);
  const manifest = manifestOf(slug);

  expect(lo.slug).toBe(slug);
  expect(lo.title).toBe(manifest.title);
  expect(lo.sections.map((section) => section.id)).toEqual(
    manifest.sections.map((section) => section.id),
  );
  // Parts are resolved, not left as refs, and keep their declared order.
  lo.sections.forEach((section, index) => {
    expect(section.blocks.map((block) => block.ref)).toEqual(manifest.sections[index].blocks ?? []);
    expect(section.exercises.map((exercise) => exercise.ref)).toEqual(
      manifest.sections[index].exercises ?? [],
    );
    for (const block of section.blocks) expect(block.config.type.length).toBeGreaterThan(0);
  });
});

test.each(SLUGS)('loadLo (disk): %s is exactly the same LO as the glob reader', (slug) => {
  expect(loadLoFromDisk(slug)).toEqual(loadLoFromGlob(slug));
});

test('listLoSlugs: both readers discover the same LOs', () => {
  expect(globSlugs()).toEqual(diskSlugs());
});

test('loadLo: an unknown slug fails naming the file it looked for', () => {
  expect(() => loadLoFromGlob('lo-99-nope')).toThrow(/lo-config\/lo-99-nope\/lo\.json/);
  expect(() => loadLoFromDisk('lo-99-nope')).toThrow(/lo-config\/lo-99-nope\/lo\.json/);
});
