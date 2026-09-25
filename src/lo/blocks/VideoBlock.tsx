/**
 * VideoBlock — `type: "video"`. A short silent looping animation beside optional
 * prose and an optional attributed quote.
 *
 * MOTION IS OPT-OUT, AND ALWAYS PAUSABLE. The markup never carries `autoplay`: the
 * prerendered page and the first client render must match, and whether motion is
 * wanted is only knowable in the browser. An effect starts playback unless the viewer
 * prefers reduced motion, read through `prefersReducedMotion()` per AGENTS.md. The
 * native controls stay on, because a loop that runs forever needs a pause (WCAG 2.2.2).
 *
 * THE BOX IS RESERVED BY ASPECT RATIO — the same reasoning as `OutcomesBlock`'s image,
 * so CLS stays at zero while the file loads.
 *
 * NO STYLESHEET. Like `OutcomesBlock` and `VocabularyBlock`, this lays itself out with
 * utilities, so it authors no CSS rule for guards f and g to check.
 */
import { useEffect, useRef } from 'react';
import { resolveAsset } from '@/lib/assets';
import { prefersReducedMotion } from '@/lib/prefersReducedMotion';
import { RichText } from '../rich-text/RichText';
import { parseBlockContent } from './parse-block-content';
import { VideoBlockContentSchema } from './video-block-schema';

export function VideoBlock({ content }: { content: unknown }) {
  const { video, text, quote } = parseBlockContent('video', VideoBlockContentSchema, content);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (element === null || prefersReducedMotion()) return;
    // play() rejects when the browser blocks autoplay; the controls remain, so the
    // viewer can still start it by hand. Nothing to report.
    element.play().catch(() => undefined);
  }, []);

  const decorative = video.label === '';

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center">
      <video
        ref={videoRef}
        src={resolveAsset(video.src)}
        style={{ aspectRatio: video.aspectRatio }}
        className="w-full rounded-md bg-muted object-contain"
        muted
        loop
        playsInline
        controls
        preload="metadata"
        aria-label={decorative ? undefined : video.label}
        aria-hidden={decorative ? true : undefined}
        tabIndex={decorative ? -1 : undefined}
      />

      <div className="min-w-0 space-y-4">
        {text?.map((paragraph, index) => (
          // Paragraph text is the only identity a paragraph has; index is stable
          // because the list is static config, never reordered at runtime.
          <p key={index} className="text-foreground">
            <RichText nodes={paragraph} />
          </p>
        ))}

        {quote === undefined ? null : (
          <figure className="border-s-4 border-accent ps-5">
            <blockquote className="text-foreground italic">
              <p>
                <RichText nodes={quote.text} />
              </p>
            </blockquote>
            <figcaption className="mt-2 text-sm text-muted-foreground">
              — <RichText nodes={quote.source} />
            </figcaption>
          </figure>
        )}
      </div>
    </div>
  );
}
