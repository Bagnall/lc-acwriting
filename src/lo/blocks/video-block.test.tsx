/**
 * video-block.test.tsx — the `video` block's content contract and its markup.
 *
 * The weight is on three things: a video cannot ship without the author deciding its
 * label (empty = decorative), the prerendered markup never autoplays (motion is
 * started client-side, and only without reduced motion), and a quote is a real
 * <figure>/<blockquote>/<figcaption>.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { test, expect } from 'vitest';
import { getBlockRenderer } from './block-renderers';
import { VideoBlockContentSchema } from './video-block-schema';

const valid = {
  video: { src: 'video/lo-01-example/clip.mp4', label: '', aspectRatio: '16 / 9' },
};

function renderVideo(content: unknown): string {
  const Renderer = getBlockRenderer('video');
  if (!Renderer) throw new Error('no renderer for "video"');
  return renderToStaticMarkup(<Renderer content={content} />);
}

test('a video on its own parses — text and quote are optional', () => {
  expect(VideoBlockContentSchema.safeParse(valid).success).toBe(true);
});

test('a video without a label is rejected, naming the field', () => {
  const result = VideoBlockContentSchema.safeParse({
    video: { src: 'video/x.mp4', aspectRatio: '1 / 1' },
  });

  expect(result.success).toBe(false);
  if (result.success) throw new Error('expected a validation failure');
  expect(result.error.issues[0]?.path).toEqual(['video', 'label']);
});

test('a malformed aspect ratio is rejected', () => {
  expect(
    VideoBlockContentSchema.safeParse({ video: { ...valid.video, aspectRatio: 'wide' } }).success,
  ).toBe(false);
});

test('the prerendered video is muted, looping, pausable and never autoplays', () => {
  const html = renderVideo(valid);

  expect(html).toContain('<video');
  expect(html).toContain('muted');
  expect(html).toContain('loop');
  expect(html).toContain('controls');
  expect(html).not.toContain('autoplay');
});

test('a decorative video is out of the accessibility tree; a described one is named', () => {
  expect(renderVideo(valid)).toContain('aria-hidden="true"');

  const described = renderVideo({ video: { ...valid.video, label: 'A chain forming' } });
  expect(described).toContain('aria-label="A chain forming"');
  expect(described).not.toContain('aria-hidden');
});

test('a quote renders as figure > blockquote + figcaption, with rich text', () => {
  const html = renderVideo({
    ...valid,
    quote: { text: 'Research is an argument.', source: 'W. Booth, <em>The Craft of Research</em>' },
  });

  expect(html).toMatch(
    /<figure[^>]*><blockquote[^>]*><p>Research is an argument\.<\/p><\/blockquote>/,
  );
  expect(html).toContain('<figcaption');
  expect(html).toContain('<em>The Craft of Research</em>');
});
