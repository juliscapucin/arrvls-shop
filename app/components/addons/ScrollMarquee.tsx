import {useRef} from 'react';

import GSAP from 'gsap';
import {useGSAP} from '@gsap/react';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

GSAP.registerPlugin(ScrollTrigger);

type ScrollMarqueeProps = {
  children?: React.ReactNode;
};

export default function ScrollMarquee({children}: ScrollMarqueeProps) {
  const marqueeRef = useRef<HTMLHeadingElement>(null);
  useGSAP(() => {
    if (!marqueeRef.current) return;

    const element = marqueeRef.current;
    const parentElement = element?.parentElement;
    if (!element || !parentElement) return;

    const tween = GSAP.fromTo(
      element,
      {x: 0},
      {
        x: () => -(element.offsetWidth - parentElement.offsetWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom-=300',
          end: 'bottom top+=300',
          scrub: 2,
          invalidateOnRefresh: true, // Recalculate on ScrollTrigger refresh
          // markers: true,
        },
      },
    );

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      tween.kill();
    };
  }, []);

  return (
    <div className="relative w-screen max-w-container overflow-clip z-10 -mx-4 md:-mx-8 2xl:mx-0 my-32 border-y border-secondary/20">
      <div ref={marqueeRef} className="w-fit">
        {children}
      </div>
    </div>
  );
}
