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
  {colStart: 1, colEnd: 5, rowStart: 3, rowEnd: 6},
  {colStart: 6, colEnd: 11, rowStart: 1, rowEnd: 4},
  {colStart: 10, colEnd: 13, rowStart: 2, rowEnd: 4},
  {colStart: 8, colEnd: 13, rowStart: 1, rowEnd: 5},
  {colStart: 9, colEnd: 13, rowStart: 2, rowEnd: 5},
  {colStart: 1, colEnd: 4, rowStart: 1, rowEnd: 3},
  {colStart: 7, colEnd: 13, rowStart: 2, rowEnd: 6},
];

const gridLayoutMobile = [
  {colStart: 2, colEnd: 9, rowStart: 1, rowEnd: 3},
  {colStart: 6, colEnd: 13, rowStart: 2, rowEnd: 4},
  {colStart: 3, colEnd: 10, rowStart: 3, rowEnd: 5},
  {colStart: 4, colEnd: 11, rowStart: 1, rowEnd: 3},
  {colStart: 5, colEnd: 12, rowStart: 3, rowEnd: 5},
  {colStart: 1, colEnd: 8, rowStart: 4, rowEnd: 6},
  {colStart: 4, colEnd: 11, rowStart: 2, rowEnd: 4},
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
    <section className="relative h-[var(--showreel-height)] -mt-[1px] -mx-8 2xl:mx-0">
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
        className="relative w-full h-full grid grid-cols-12 grid-rows-5 overflow-clip border-b border-b-secondary/10 border-r border-r-secondary/10 md:hidden lg:grid"
      >
        {showreelImages.map((image, index) => {
          return (
            <div
              className="w-full h-full transition-opacity duration-300 overflow-clip"
              style={{
                gridColumnStart: isMobile
                  ? gridLayoutMobile[index].colStart
                  : gridLayoutDesktop[index].colStart,
                gridColumnEnd: isMobile
                  ? gridLayoutMobile[index].colEnd
                  : gridLayoutDesktop[index].colEnd,
                gridRowStart: isMobile
                  ? gridLayoutMobile[index].rowStart
                  : gridLayoutDesktop[index].rowStart,
                gridRowEnd: isMobile
                  ? gridLayoutMobile[index].rowEnd
                  : gridLayoutDesktop[index].rowEnd,
              }}
              key={`${image.id}-${index}`}
            >
              {/* <div className="absolute z-50">{index + 1}</div> */}
              <Image
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  slideIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
                src={image.url}
                alt="Showreel image"
                sizes="(max-width: 1200px) 100vw, 80vw"
              />
            </div>
          );
        })}
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 -z-10 grid-texture"></div>
    </section>
  );
}
