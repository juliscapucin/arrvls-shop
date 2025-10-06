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
  {colStart: 1, colEnd: 5, rowStart: 2, rowEnd: 4},
  {colStart: 6, colEnd: 9, rowStart: 1, rowEnd: 2},
  {colStart: 8, colEnd: 11, rowStart: 2, rowEnd: 3},
  {colStart: 1, colEnd: 9, rowStart: 1, rowEnd: 4},
  {colStart: 9, colEnd: 13, rowStart: 2, rowEnd: 4},
  {colStart: 1, colEnd: 4, rowStart: 1, rowEnd: 2},
  {colStart: 5, colEnd: 8, rowStart: 2, rowEnd: 4},
  {colStart: 5, colEnd: 9, rowStart: 2, rowEnd: 3},
  {colStart: 1, colEnd: 4, rowStart: 1, rowEnd: 3},
  {colStart: 9, colEnd: 12, rowStart: 1, rowEnd: 2},
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
    <section className="relative h-[var(--showreel-height)] overflow-clip -mx-8 2xl:mx-0 -mt-8">
      {/* TEXT */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-3 gap-4 overflow-clip z-10 mix-blend-difference">
        <div className="col-start-3 col-end-8 row-start-2 [&>*]:text-headline-medium">
          <p className="mt-4 text-pretty">
            Craft smooth, responsive, and production-ready UI without
            reinventing the wheel
          </p>
        </div>
      </div>
      {/* IMAGES */}
      <div
        ref={showreelRef}
        className="relative w-full h-full grid grid-cols-12 grid-rows-3 gap-4 overflow-clip"
      >
        {showreelImages.map((image, index) => {
          return (
            <div
              style={{
                gridColumnStart: gridLayoutRef[index].colStart,
                gridColumnEnd: gridLayoutRef[index].colEnd,
                gridRowStart: gridLayoutRef[index].rowStart,
                gridRowEnd: gridLayoutRef[index].rowEnd,
              }}
              key={`${image.id}-${index}`}
            >
              <Image
                className={`object-cover md:object-contain transition-opacity duration-300 ${
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
    </section>
  );
}
