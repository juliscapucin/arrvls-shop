'use client';

import {useEffect, useRef, type ReactNode} from 'react';
import {useLocation} from 'react-router';
import GSAP from 'gsap';

type PageTransitionProps = {
  children?: ReactNode;
};

export default function PageTransition({children}: PageTransitionProps) {
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = GSAP.context(() => {
      const tl = GSAP.timeline();

      tl.fromTo(
        overlayRef.current,
        {
          y: 0,
          duration: 0.8,
          ease: 'power4.inOut',
        },
        {
          y: '-100%',
        },
      );
    });

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div className="relative overflow-hidden">
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-[oklch(60%_0.22_25)] translate-y-full z-50"
      />
      <div ref={containerRef}>{children}</div>
    </div>
  );
}
