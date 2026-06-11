import { useEffect, useState } from 'react';

// Aladiah responsive breakpoints (see Mobile UX Audit §1).
//   xs  < 480    phone
//   sm  480-767  large phone
//   md  768-1279 tablet / iPad (portrait AND landscape) → mobile shell
//   xl  >= 1280  laptop / desktop → keeps the existing desktop layout (untouched)
//
// NOTE: desktop threshold is 1280 (not 1024) on purpose — iPad landscape is
// 1024-1194px and MUST get the mobile-first shell, per the directive to treat
// iPhone, Android, iPad and tablets as mobile.
export const BP = { sm: 480, md: 768, lg: 1024, desktop: 1280 } as const;

function read() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
  return {
    width: w,
    isPhone: w < BP.md,                          // < 768
    isTablet: w >= BP.md && w < BP.desktop,      // 768-1279 (incl. iPad landscape)
    isDesktop: w >= BP.desktop,                  // >= 1280
    isCompact: w < BP.desktop,                   // phone or tablet → mobile shell
  };
}

/**
 * Viewport-aware breakpoint hook. Drives the mobile shell decision so the
 * desktop layout (>= 1280) is never altered.
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
