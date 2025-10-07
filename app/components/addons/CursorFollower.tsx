'use client';

import {useRef} from 'react';

import GSAP from 'gsap';
import {useGSAP} from '@gsap/react';
import {Observer} from 'gsap/Observer';
GSAP.registerPlugin(Observer);

import {IconChevron} from '~/components/icons';

type CursorFollowerProps = {
  variant: 'big' | 'small';
  isVisible: boolean;
  children?: React.ReactNode;
};

export default function CursorFollower({
  variant,
  isVisible,
  children,
}: CursorFollowerProps) {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  // Mouse follower movement
  useGSAP(() => {
    const cursorDiv = cursorRef.current;
    if (!cursorDiv || !cursorDiv.parentElement) return;

    GSAP.set(cursorDiv, {xPercent: -50, yPercent: -50});

    const moveCursor = (e: MouseEvent) => {
      GSAP.to(cursorDiv, {
        x: e.clientX,
        y: e.clientY,
        duration: 1,
      });
    };

    const parent = cursorDiv.parentElement;
    parent.addEventListener('mousemove', moveCursor);

    return () => {
      parent.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  useGSAP(() => {
    const cursorDiv = cursorRef.current;
    if (!cursorDiv) return;

    GSAP.to(cursorDiv, {opacity: isVisible ? 1 : 0, duration: 0.3});
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className={`pointer-events-none fixed top-0 left-0 z-15 flex items-center justify-center rounded-full border border-secondary/50 bg-secondary ${variant === 'big' ? 'h-40 w-40' : 'h-16 w-16'}`}
    >
      {children ? (
        children
      ) : (
        <div className="flex items-center gap-8">
          <div className="absolute left-0 w-full h-full flex justify-center gap-1 p-2 -rotate-45 text-primary">
            <IconChevron direction="back" />
            <IconChevron direction="forward" />
          </div>
        </div>
      )}
    </div>
  );
}
