import {useRef, useEffect, useState} from 'react';

import GSAP from 'gsap';
import {useGSAP} from '@gsap/react';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

GSAP.registerPlugin(ScrollTrigger);

type ScrollMarqueeProps = {
  children?: React.ReactNode;
  ariaLabel?: string;
};

export default function ScrollMarquee({
  children,
  ariaLabel = 'Scrolling marquee text',
}: ScrollMarqueeProps) {
  const marqueeRef = useRef<HTMLHeadingElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useGSAP(() => {
    if (!marqueeRef.current || prefersReducedMotion) return;

    const element = marqueeRef.current;
    const parentElement = element?.parentElement;
    if (!element || !parentElement) return;

    const tween = GSAP.fromTo(
      element,
      {
        xPercent: -20,
      },
      {
        xPercent: () => -(element.offsetWidth / 2 / element.offsetWidth) * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
          invalidateOnRefresh: true,
        },
      },
    );

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      tween.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <div className="relative w-full overflow-clip z-10 -mx-4 md:-mx-8 2xl:mx-0 my-32 border-y border-secondary/20">
      <div className="w-full max-w-container mx-auto">
        <div
          ref={marqueeRef}
          className="w-fit"
          // Accessibility attributes
          role="marquee"
          aria-label={ariaLabel}
          aria-live="off" // Don't announce changes since it's decorative
          tabIndex={-1} // Remove from tab order since it's decorative
          aria-hidden={prefersReducedMotion ? 'false' : 'true'} // Hide from screen readers when animated
        >
          {/* Screen reader only content */}
          <span className="sr-only">{children}</span>

          {/* Visual marquee content */}
          <span className="flex flex-nowrap items-center" aria-hidden="true">
            {children} | {children} | {children}
          </span>
        </div>
      </div>
    </div>
  );
}
