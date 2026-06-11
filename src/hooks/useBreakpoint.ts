import { useEffect, useState } from 'react';

// Aladiah responsive strategy (per directive — PHONE ONLY gets the new shell):
//   Phone   < 768   → mobile shell (no sidebar, bottom nav, single column)
//   Tablet  768-1023 → KEEP current tablet/desktop layout (unchanged)
//   Desktop >= 1024  → KEEP current desktop layout (unchanged)
// iPad landscape (>=768) intentionally stays on the existing layout.
export const BP = { phone: 768, desktop: 1024 } as const;

function read() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
  return {
    width: w,
    isPhone: w < BP.phone,                        // < 768  → mobile shell
    isTablet: w >= BP.phone && w < BP.desktop,    // 768-1023 → unchanged
    isDesktop: w >= BP.desktop,                   // >= 1024 → unchanged
  };
}

/**
 * Viewport-aware breakpoint hook. Only `isPhone` (< 768) switches a surface to
 * the mobile shell; tablet and desktop keep their existing layouts untouched.
 */
export function useBreakpoint() {
  const [state, setState] = useState(read);

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setState(read()));
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  return state;
}
