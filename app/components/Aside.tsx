import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading?: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();

  useEffect(() => {
    const abortController = new AbortController();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close();
      }
    }

    function handleClickOutside(event: MouseEvent) {
      const asideElement = document.querySelector('aside');
      if (
        type === activeType &&
        asideElement &&
        !asideElement.contains(event.target as Node)
      ) {
        close();
      }
    }

    if (type === activeType) {
      document.addEventListener('keydown', handleKeyDown, {
        signal: abortController.signal,
      });
      // TODO: Fix this – doesn't work on search
      // document.addEventListener('mousedown', handleClickOutside, {
      //   signal: abortController.signal,
      // });
    }

    return () => abortController.abort();
  }, [close, type, activeType]);

  return (
    // OVERLAY
    <div
      aria-modal
      className={`fixed inset-0 transition-opacity duration-400 z-50 bg-primary/50 ${type === activeType ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} ${type === 'mobile' ? 'lg:hidden' : ''}`}
      role="dialog"
    >
      {/* ASIDE */}
      <aside
        className={`bg-primary w-screen md:w-aside fixed md:border-l border-l-secondary top-0 right-0 h-screen transition-transform duration-200 ease-in-out shadow-2xl p-4 ${type === activeType ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* ASIDE HEADER */}
        <header className="flex items-center justify-between h-16 lg:border-b border-secondary">
          {heading && <h3 className="heading-headline">{heading}</h3>}
          <button
            className="mx-auto md:mx-0 transition-opacity hover:opacity-50"
            onClick={close}
            aria-label="Close"
          >
            <IconClose />
          </button>
        </header>
        <main className="mt-8">{children}</main>
      </aside>
    </div>
  );
}

// ASIDE CONTEXT
const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

export default function IconClose() {
  return (
    <div className="h-12 w-12 flex flex-col justify-center relative">
      <div className="absolute h-px w-full bg-secondary rotate-45"></div>
      <div className="absolute h-px w-full bg-secondary -rotate-45"></div>
    </div>
  );
}
