/**
 * video-block-schema.ts — the per-type `content` contract for `type: "video"`,
 * mirroring the per-engine `*-schema.ts` convention the exercises use.
 *
 * A short looping animation beside optional prose and an optional attributed quote.
 * Added for the Academic Writing course, whose legacy (Tumult Hype) pages were each a
 * silent 2–6 second animation, a heading and a quotation from the literature.
 *
 * `video.label` IS REQUIRED BUT MAY BE THE EMPTY STRING — the same rule as the
 * outcomes block's `alt`. Required means no video ships without the author deciding;
 * empty means "decoration", which takes the element out of the accessibility tree.
 * These animations restate the heading visually and carry no audio, so most are
 * decorative; one that conveys information must describe it.
 *
 * `quote.text` and `quote.source` are INLINE RICH TEXT, so a book title can be `<em>`.
 */
import { z } from 'zod';
import { parseRichText } from '../rich-text/parse-rich-text';

export const VideoSchema = z.object({
  /** Project-relative asset path under `public/`; resolved through `resolveAsset()`. */
  src: z.string().min(1),
  /** Accessible description. `""` is the explicit decorative choice. */
  label: z.string(),
  /** Width / height of the source, so the box is reserved before the file loads. */
  aspectRatio: z.string().regex(/^\d+\s*\/\s*\d+$/, 'aspectRatio is "width / height"'),
});
export type VideoContent = z.infer<typeof VideoSchema>;

export const QuoteSchema = z.object({
  text: z
    .string()
    .min(1)
    .transform((value) => parseRichText(value)),
  /** Who said it, and where. Rendered in the `<figcaption>`. */
  source: z
    .string()
    .min(1)
    .transform((value) => parseRichText(value)),
});

export const VideoBlockContentSchema = z.object({
  /** Block-level instructions, read generically by `sectionContent`. */
  instructions: z.string().min(1).optional(),
  video: VideoSchema,
  /** Optional paragraphs of prose, each its own `<p>`. */
  text: z
    .array(z.string().min(1))
    .min(1)
    .transform((paragraphs) => paragraphs.map((paragraph) => parseRichText(paragraph)))
    .optional(),
  quote: QuoteSchema.optional(),
});
export type VideoBlockContent = z.infer<typeof VideoBlockContentSchema>;
