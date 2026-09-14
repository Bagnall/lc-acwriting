/**
 * ThemeToggleButton — the dark-mode control in the landing page's rail (§D · D7).
 *
 * A VERTICAL TRACK WITH A SLIDING THUMB, because the rail is 48px wide and the
 * reference design for this is a horizontal pill about 64px across. Rotating it is what
 * makes it fit without widening the rail and taking 16px of content column at every
 * breakpoint. Sun sits at the top of the track, moon at the bottom, and the thumb
 * travels between them.
 *
 * HAND-ROLLED RATHER THAN THE VENDORED `Switch`, and not for bundle reasons — that
 * primitive is already in `main` via `ThemeToggle` on the LO pages, so reusing it would
 * have been free. Two better reasons: it hardcodes its own dimensions
 * (`h-[18.4px] w-[32px]`) and moves its thumb on `translate-x`, so a vertical variant
 * means fighting every one of those classes; and `src/components/ui/` is owned by the
 * shadcn CLI, so a future `shadcn add switch` would silently revert the overrides. This
 * file costs no new dependency either way — it is two spans and a button.
 *
 * `role="switch"` + `aria-checked`, which is what spec §1 asks for and what the LO
 * page's `ThemeToggle` already uses. The earlier version of this file was a button with
 * `aria-pressed`; now that the control actually LOOKS like a switch, the matching role
 * is both more accurate and more consistent with its sibling. What §1 bans either way
 * is a control whose visible LABEL flips between "Dark mode" and "Light mode" — the
 * name here is the fixed string and the state lives in `aria-checked`.
 *
 * NO COLOUR IS TRANSITIONED — only the thumb's `transform`. Both icon colours are
 * declared in a base state from tokens, and §D8 records what happens to those when they
 * are also named in a `transition`: they strand on the previous theme's value.
 *
 * HYDRATION: `useTheme` is backed by `useSyncExternalStore` with a server snapshot
 * pinned to 'light', so the first CLIENT render matches prerendered markup and React
 * adopts the real theme itself. `aria-checked="false"` with the thumb at the top is
 * therefore what ships in `dist/index.html` whatever the reader's stored choice — the
 * same accepted one-frame cost `ThemeToggle` documents. The PAGE is already dark before
 * first paint, because index.html's pre-hydration script stamps the class.
 */
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggleButton() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      onClick={toggle}
      className="lesson-rail-theme"
    >
      {/* Painted UNDER the icons, so whichever icon the thumb is behind reads as the
          selected one. Decorative: the button's own role and name carry the meaning. */}
      <span className="lesson-rail-theme-thumb" aria-hidden="true" />
      <SunIcon className="lesson-rail-theme-icon" data-slot="light" aria-hidden="true" />
      <MoonIcon className="lesson-rail-theme-icon" data-slot="dark" aria-hidden="true" />
    </button>
  );
}
