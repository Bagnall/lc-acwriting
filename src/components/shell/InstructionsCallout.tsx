/**
 * InstructionsCallout — the ONE instructional-callout primitive (Phase C · Part A,
 * step 4; spec §3). It borrows the shadcn Alert's *visual* treatment but is a plain
 * <div class="instructions"> — deliberately NOT role="alert". role="alert" is an
 * assertive live region (it interrupts the screen reader the moment it appears);
 * static lesson instructions are not an announcement, so using it would be wrong
 * semantics. The `instructions` class is the stable hook the section- and
 * accordion-level instruction slots both reuse (§3: one field, one name).
 *
 * `mt-2` is on the PRIMITIVE, not on each caller, because every instructions box
 * wants the same breathing room above it — inside an accordion the body has no top
 * padding, so without this the callout butts straight against the summary and the
 * summary's hover highlight runs right into it. A caller that needs different spacing
 * passes its own `mt-*`: `cn()` is tailwind-merge, so the caller's class wins rather
 * than both landing in the list.
 */
import type { ReactNode } from 'react';
import { InfoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstructionsCalloutProps {
  children: ReactNode;
  className?: string;
}

export default function InstructionsCallout({ children, className }: InstructionsCalloutProps) {
  return (
    <div
      className={cn(
        'instructions mt-2 flex items-start gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground',
        className,
      )}
    >
      <InfoIcon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}
