'use client';

import {useEffect, useRef, useState} from 'react';
import {Image} from '@shopify/hydrogen';

const delay = 1000;

type ShowreelProps = {
  showreelImages: {
    id: string;
    url: string;
    altText: string | null;
    width: number | null;
    height: number | null;
  }[];
};

export default function Showreel({showreelImages}: ShowreelProps) {
  const [slideIndex, setSlideIndex] = useState(1);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const logoHeaderRef = useRef<HTMLDivElement | null>(null);
  const logoShowreelRef = useRef<HTMLDivElement | null>(null);
  const showreelRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // SLIDE ANIMATION
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setSlideIndex((prevIndex) =>
          prevIndex === showreelImages.length - 1 ? 0 : prevIndex + 1,
        ),
      delay,
    );

    return () => {
      resetTimeout();
    };
  }, [slideIndex, showreelImages]);

  return (
    <section className="h-[500px] w-full mb-32">
      <div
        ref={showreelRef}
        className="relative w-full lg:w-1/2 h-full mx-auto overflow-clip"
      >
        {showreelImages.map((image, index) => {
          return (
            <div className={`absolute w-full h-full`} key={image.url}>
              <Image
                className={`object-cover md:object-contain transition-opacity duration-300 ${
                  slideIndex === index ? 'opacity-100 z-5' : 'opacity-0 z-0'
                }`}
                src={image.url}
                alt="Showreel image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
