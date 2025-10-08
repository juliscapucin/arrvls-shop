'use client';

import {
  useContext,
  useRef,
  useState,
  createContext,
  type ReactNode,
} from 'react';
import {useLocation, useNavigate} from 'react-router';
import GSAP from 'gsap';
import {useGSAP} from '@gsap/react';

type PageTransitionProps = {
  children?: ReactNode;
};

export default function PageTransition({children}: PageTransitionProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const {slug, handleSlug} = usePageTransition();

  useGSAP(() => {
    if (!slug) return;

    const tl = GSAP.timeline();

    tl.fromTo(
      overlayRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.3,
        onComplete: () => {
          navigate(slug);
          handleSlug?.(null);
        },
      },
    );

    return () => {
      tl.kill();
    };
  }, [slug]);

  useGSAP(() => {
    const tl = GSAP.timeline();

    tl.to(overlayRef.current, {opacity: 0, duration: 0.5});

    return () => {
      tl.kill();
    };
  }, [location.pathname]);

  return (
    <div className="relative overflow-hidden pointer-events-none">
      <div
        ref={overlayRef}
        className={`fixed inset-0 bg-primary z-50 pointer-events-none ${slug ? 'opacity-0' : 'opacity-100'}`}
      />
      <div ref={containerRef}>{children}</div>
    </div>
  );
}

type TransitionContextValue = {
  handleSlug?: (to: string | null) => void;
  slug: string | null;
};

// PAGE TRANSITION CONTEXT
const PageTransitionContext = createContext<TransitionContextValue | null>(
  null,
);

PageTransition.Provider = function PageTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [slug, setSlug] = useState<string | null>(null);

  return (
    <PageTransitionContext.Provider
      value={{
        handleSlug: (to: string | null) => setSlug(to),
        slug,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
};

export function usePageTransition() {
  const pageTransition = useContext(PageTransitionContext);
  if (!pageTransition) {
    throw new Error(
      'usePageTransition must be used within a PageTransitionProvider',
    );
  }
  return pageTransition;
}
