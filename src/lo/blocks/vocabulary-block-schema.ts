/**
 * vocabulary-block-schema.ts — the per-type `content` contract for
 * `type: "vocabulary"`, mirroring the per-engine `*-schema.ts` convention.
 */
import { z } from 'zod';

export const VocabularyItemSchema = z.object({
  /** The target-language word or phrase. */
  term: z.string().min(1),
  /** Its UI-language gloss. */
  gloss: z.string().min(1),
  /**
   * Optional clip of the TERM being said, rendered as a speaker button beside it.
   *
   * Optional because a vocabulary list is useful without audio and a course may not
   * have recordings yet — a required field would make every clone record audio before
   * it could ship a word list. `audio` is a key guard d already sweeps, so a path
   * pointing at a file that is not there fails the build rather than going silent in
   * the browser.
   */
  audio: z.string().min(1).optional(),
});
export type VocabularyItem = z.infer<typeof VocabularyItemSchema>;

export const VocabularyBlockContentSchema = z.object({
  /** Accordion-level instructions, rendered by LoAccordion's one instructions slot. */
  instructions: z.string().min(1).optional(),
  items: z.array(VocabularyItemSchema).min(1),
});
export type VocabularyBlockContent = z.infer<typeof VocabularyBlockContentSchema>;
