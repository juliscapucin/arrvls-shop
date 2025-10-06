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
    if (marqueeRef.current) {
      const element = marqueeRef.current;
      const parentElement = element.parentElement;
      if (!parentElement) return;

      GSAP.fromTo(
        element,
        {x: 0},
        {
          x: () => -(element.offsetWidth - parentElement.offsetWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'bottom bottom',
            end: 'top top+=200',
            scrub: true,
          },
          duration: 20,
        },
      );
    }
  }, []);

  return (
    <div ref={marqueeRef} className="w-fit">
      {children}
    </div>
  );
}
