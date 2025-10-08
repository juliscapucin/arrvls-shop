'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {Image} from '@shopify/hydrogen';

const delay = 1500;

type ShowreelProps = {
  showreelImages: {
    id: string;
    url: string;
    altText: string | null;
    width: number | null;
    height: number | null;
  }[];
};

// Layout for the grid (12 columns, 3 rows, max 10 images)
const gridLayoutDesktop = [
  {colStart: 1, rowStart: 3},
  {colStart: 5, rowStart: 1},
  {colStart: 8, rowStart: 2},
  {colStart: 7, rowStart: 1},
  {colStart: 8, rowStart: 3},
  {colStart: 1, rowStart: 1},
  {colStart: 7, rowStart: 2},
];

const gridLayoutMobile = [
  {colStart: 1, rowStart: 1},
  {colStart: 6, rowStart: 2},
  {colStart: 3, rowStart: 3},
  {colStart: 7, rowStart: 1},
  {colStart: 5, rowStart: 2},
  {colStart: 1, rowStart: 1},
  {colStart: 7, rowStart: 2},
];

export default function Showreel({showreelImages}: ShowreelProps) {
  const [slideIndex, setSlideIndex] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const showreelRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // CHECK IF MOBILE
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <section className="relative h-[var(--showreel-height)] -mt-8 2xl:mx-0 grid-texture border-b-secondary/5 border-b">
      <div className="max-w-container mx-auto w-full h-full overflow-clip">
        {/* TEXT */}
        <div className="absolute inset-8 md:inset-0 grid grid-cols-12 grid-rows-5 overflow-clip z-10 mix-blend-difference">
          <div className="col-start-2 col-end-10 lg:col-start-3 lg:col-end-7 row-start-2 p-4">
            <p className="heading-headline text-pretty">
              Craft smooth, responsive, and production-ready UI
            </p>
          </div>
          <div className="col-start-2 col-end-10 lg:col-start-3 lg:col-end-7 row-start-4 p-4">
            <p className="heading-headline text-pretty">
              Without reinventing the wheel
            </p>
          </div>
        </div>
        {/* IMAGES */}
        <div
          ref={showreelRef}
          className="relative w-full h-full grid grid-cols-12 grid-rows-5 overflow-clip md:hidden lg:grid"
        >
          {showreelImages.map((image, index) => {
            return (
              <div
                className={`relative w-full h-full transition-opacity duration-300 overflow-clip flex items-center justify-center ${
                  slideIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  gridColumnStart: isMobile
                    ? gridLayoutMobile[index]?.colStart
                    : gridLayoutDesktop[index]?.colStart,
                  gridColumnEnd: isMobile
                    ? gridLayoutMobile[index]?.colStart + 6
                    : gridLayoutDesktop[index]?.colStart + 5,
                  gridRowStart: isMobile
                    ? gridLayoutMobile[index]?.rowStart
                    : gridLayoutDesktop[index]?.rowStart,
                  gridRowEnd: isMobile
                    ? gridLayoutMobile[index]?.rowStart + 3
                    : gridLayoutDesktop[index]?.rowStart + 3,
                }}
                key={`${image.id}-${index}`}
              >
                <div className="w-[90%] h-[70%] relative overflow-clip rounded-2xl bg-black p-2">
                  <div className="w-full h-full relative overflow-clip rounded-xl">
                    <Image
                      className={`w-full h-full object-cover`}
                      src={image.url}
                      alt="Showreel image"
                      sizes="(max-width: 1200px) 100vw, 80vw"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
