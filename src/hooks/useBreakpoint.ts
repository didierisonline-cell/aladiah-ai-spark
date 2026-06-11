import { useEffect, useState } from 'react';

// Aladiah responsive breakpoints (see Mobile UX Audit §1).
//   xs  < 480   phone
//   sm  480-767 large phone
//   md  768-1023 tablet  → gets the mobile shell (bottom nav)
//   lg  >= 1024 desktop  → keeps the existing desktop layout (untouched)
export const BP = { sm: 480, md: 768, lg: 1024 } as const;

function read() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
  return {
    width: w,
    isPhone: w < BP.md,        // < 768
    isTablet: w >= BP.md && w < BP.lg,
    isDesktop: w >= BP.lg,     // >= 1024
    isCompact: w < BP.lg,      // phone or tablet → mobile shell
  };
}

/**
 * Viewport-aware breakpoint hook. Drives the mobile shell decision so the
 * desktop layout (>= lg) is never altered.
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
