'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
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

// Layout for the grid (12 columns, 2 rows, max 10 images)
const gridLayoutRef = [
  {colStart: 1, colEnd: 5, rowStart: 1, rowEnd: 3},
  {colStart: 6, colEnd: 9, rowStart: 1, rowEnd: 1},
  {colStart: 5, colEnd: 7, rowStart: 2, rowEnd: 3},
  {colStart: 9, colEnd: 13, rowStart: 1, rowEnd: 2},
  {colStart: 2, colEnd: 4, rowStart: 2, rowEnd: 1},
  {colStart: 1, colEnd: 4, rowStart: 1, rowEnd: 1},
  {colStart: 5, colEnd: 8, rowStart: 1, rowEnd: 1},
  {colStart: 5, colEnd: 9, rowStart: 2, rowEnd: 1},
  {colStart: 1, colEnd: 4, rowStart: 1, rowEnd: 2},
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
    <section className="h-[700px] w-full mb-32">
      <div
        ref={showreelRef}
        className="relative w-full h-full grid grid-cols-12 grid-rows-2 gap-4 overflow-clip"
      >
        {showreelImages.map((image, index) => {
          return (
            <div
              style={{
                //  backgroundColor: '#f0f0f0',
                gridColumnStart: gridLayoutRef[index].colStart,
                gridColumnEnd: gridLayoutRef[index].colEnd,
                gridRowStart: gridLayoutRef[index].rowStart,
                gridRowEnd: gridLayoutRef[index].rowEnd,
              }}
              key={image.url}
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
