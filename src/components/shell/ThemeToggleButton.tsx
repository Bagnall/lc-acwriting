/**
 * ThemeToggleButton — the compact dark-mode control for the landing page's rail
 * (§D · D7). A 48px rail cannot hold `ThemeToggle`'s sun + switch + moon lockup, which
 * is ~70px wide, so this is the same behaviour in one icon-sized target.
 *
 * A SEPARATE COMPONENT, NOT A `variant` PROP ON ThemeToggle. The two share no markup —
 * one is a labelled switch flanked by two decorative icons, the other is a single
 * toggle button — so a prop would mean two disjoint render branches behind one name.
 * What they genuinely share is the state, and that already lives in `useTheme`.
 *
 * THE ACCESSIBLE NAME DOES NOT FLIP, which is the rule spec §1 actually sets. It bans a
 * control whose VISIBLE LABEL changes ("Dark mode" → "Light mode"), because a user who
 * reads the name cannot tell whether it describes the current state or the action. Here
 * the name is the fixed string "Dark mode" and the STATE is carried by `aria-pressed`,
 * which is the toggle-button equivalent of the switch's `aria-checked`. Only the icon
 * changes, and it is `aria-hidden`.
 *
 * HYDRATION: `useTheme` is backed by `useSyncExternalStore` with a separate server
 * snapshot pinned to 'light', so the first CLIENT render matches prerendered markup and
 * React adopts the real theme on its own. `aria-pressed="false"` and the sun icon are
 * therefore what ships in `dist/index.html`, whatever the reader's stored choice — the
 * same accepted one-frame cost `ThemeToggle` documents. The PAGE itself is already dark
 * before first paint, because index.html's pre-hydration script stamps the class.
 */
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggleButton() {
  const { isDark, toggle } = useTheme();
  const Icon = isDark ? MoonIcon : SunIcon;

  return (
    <button
      type="button"
      aria-pressed={isDark}
      aria-label="Dark mode"
      onClick={toggle}
      className="lesson-rail-toggle"
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}
