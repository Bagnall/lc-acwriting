/**
 * sprite — the single way to reference a `<symbol>` in `public/icons.svg`.
 *
 * WHY IT IS A FUNCTION AND NOT A TEMPLATE LITERAL AT EACH CALL SITE. A hand-written
 * `<use href="/icons.svg#brand-x">` is root-absolute and 404s under a non-root base
 * (anti-pattern #28); a hand-written `icons.svg#brand-x` is relative to the CURRENT
 * page, which is right for `/` and wrong for every LO page. `resolveAsset()` is the
 * only construction that survives `BASE_URL=/course/ bun run build`, and this is the
 * choke point that makes sure it is the one used.
 *
 * WHY IT MOVED HERE. It was written twice, verbatim — `FooterSocial.tsx` and
 * `sandbox/IconsSection.tsx`, each with its own copy of the paragraph above — and the
 * landing page's lesson rail would have been the third. `FooterLink.tsx` sets the
 * house threshold at two consumers; three copies of a URL rule is how one of them
 * quietly stops going through `resolveAsset()`.
 */
import { resolveAsset } from '@/lib/assets';

/** A sprite symbol id (`brand-facebook`) → the base-aware `<use href>` for it. */
export const spriteHref = (id: string): string => `${resolveAsset('icons.svg')}#${id}`;
