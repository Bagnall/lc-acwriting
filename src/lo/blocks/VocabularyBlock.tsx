/**
 * VocabularyBlock — `type: "vocabulary"`. A term/gloss list, rendered as a `<dl>`:
 * the description-list element IS the semantic for "term and its definition", so no
 * `<ul>` of `<span>` pairs.
 *
 * `lang` (spec §3, WCAG 3.1.2) is per-part, not per-block: the TERM is target
 * language, its GLOSS is the UI language, so only the `<dt>` carries TARGET_LANG.
 *
 * A term may carry a CLIP of itself being said. It renders as the same speaker button
 * `RichText` uses for an inline audio node, so audio looks and behaves the same
 * wherever a learner meets it.
 *
 * The button sits inside the `<dt>` and BEFORE the word. Inside, because a control in
 * a column of its own is separated from the thing it plays for anyone navigating by
 * element. Before, because it gives every row one shared left edge to scan down and
 * click, and because a vocabulary list is heard before it is read — the clip is the
 * way in to the word, not an afterthought hung off its end.
 */
import { AudioClip } from '@/components/audio/AudioClip';
import { TARGET_LANG } from '@/lib/lang';
import { parseBlockContent } from './parse-block-content';
import { VocabularyBlockContentSchema } from './vocabulary-block-schema';

export function VocabularyBlock({ content }: { content: unknown }) {
  const { items } = parseBlockContent('vocabulary', VocabularyBlockContentSchema, content);

  return (
    <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[max-content_1fr]">
      {items.map((item) => (
        <div key={item.term} className="grid gap-x-6 sm:col-span-2 sm:grid-cols-subgrid">
          <dt lang={TARGET_LANG} className="flex items-center gap-2 font-medium text-foreground">
            {item.audio === undefined ? null : (
              // The same speaker `RichText` renders for an inline audio node, so a
              // clip looks and behaves identically wherever it appears. `title` is
              // its accessible name: the button has no text of its own, and "play"
              // alone would be identical on every row of the list.
              <AudioClip
                className="super-compact-speaker"
                inline
                soundFile={item.audio}
                title={`Listen: ${item.term}`}
              />
            )}
            {item.term}
          </dt>
          <dd className="text-muted-foreground">{item.gloss}</dd>
        </div>
      ))}
    </dl>
  );
}
