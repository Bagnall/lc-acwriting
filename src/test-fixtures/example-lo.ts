/**
 * example-lo.ts — the template's worked example LO, kept as a TEST FIXTURE.
 *
 * The template ships `lo-config/lo-00-example/`; this course removed it so it does not
 * appear on the landing page. The folder lives on here, unchanged, because it is the
 * one LO that exercises every part kind (blocks, exercises, modals) and rich-text
 * feature (modal links, audio icons) against real files. Nothing under
 * `src/test-fixtures/` is built into the course.
 *
 * Its public/ assets (audio/lo-00-example/, images/lo-placeholder.svg) stay where
 * they were, so the fixture's paths still resolve.
 */
import path from 'node:path';
import { assembleLo, type AssembledLo } from '@/lo/assemble-lo';
import { readLoTree } from '@/lo/load-lo-disk';

export const EXAMPLE_SLUG = 'lo-00-example';

/** The fixture folder, resolved from this file (repo-root independent). */
export const EXAMPLE_LO_DIR = path.resolve(import.meta.dirname, EXAMPLE_SLUG);

/** Load the example through the same assembler the course uses. */
export function loadExampleLo(): AssembledLo {
  return assembleLo(EXAMPLE_SLUG, readLoTree(EXAMPLE_LO_DIR));
}
