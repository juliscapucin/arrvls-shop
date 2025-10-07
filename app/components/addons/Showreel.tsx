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
const gridLayoutRef = [
  {colStart: 1, colEnd: 5, rowStart: 3, rowEnd: 6},
  {colStart: 6, colEnd: 11, rowStart: 1, rowEnd: 4},
  {colStart: 10, colEnd: 13, rowStart: 2, rowEnd: 4},
  {colStart: 5, colEnd: 13, rowStart: 2, rowEnd: 6},
  {colStart: 9, colEnd: 13, rowStart: 2, rowEnd: 5},
  {colStart: 1, colEnd: 4, rowStart: 1, rowEnd: 3},
  {colStart: 7, colEnd: 13, rowStart: 2, rowEnd: 6},
];

export default function Showreel({showreelImages}: ShowreelProps) {
  const [slideIndex, setSlideIndex] = useState(1);
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
    <section className="relative h-[var(--showreel-height)] -mt-[1px] -mx-8 2xl:mx-0">
      {/* TEXT */}
      <div className="absolute inset-8 lg:inset-0 lg:grid lg:grid-cols-12 lg:grid-rows-5 overflow-clip z-10 mix-blend-difference">
        <div className="col-start-3 col-end-7 row-start-2 p-4">
          <p className="heading-headline text-pretty">
            Craft smooth, responsive, and production-ready UI
          </p>
        </div>
        <div className="col-start-3 col-end-7 row-start-4 p-4">
          <p className="heading-headline text-pretty">
            Without reinventing the wheel
          </p>
        </div>
      </div>
      {/* IMAGES */}
      <div
        ref={showreelRef}
        className="relative w-full h-full lg:grid lg:grid-cols-12 lg:grid-rows-5 overflow-clip border-b border-b-secondary/10 border-r border-r-secondary/10"
      >
        {showreelImages.map((image, index) => {
          return (
            <div
              className="absolute inset-0 lg:relative w-full h-full transition-opacity duration-300 overflow-clip"
              style={{
                gridColumnStart: gridLayoutRef[index].colStart,
                gridColumnEnd: gridLayoutRef[index].colEnd,
                gridRowStart: gridLayoutRef[index].rowStart,
                gridRowEnd: gridLayoutRef[index].rowEnd,
              }}
              key={`${image.id}-${index}`}
            >
              {/* <div className="absolute">{index + 1}</div> */}
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
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--color-secondary)_10%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--color-secondary)_10%,transparent)_1px,transparent_1px)] bg-[size:calc(100%/24)_calc(100%/10)]"></div>
    </section>
  );
}
