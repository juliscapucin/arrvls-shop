import {Suspense, useRef} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';

import GSAP from 'gsap';
import {useGSAP} from '@gsap/react';
import {Observer} from 'gsap/Observer';
GSAP.registerPlugin(Observer);

import {usePageTransition} from '~/components/addons/PageTransition';
import {useAside} from '~/components/Aside';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const headerRef = useRef<HTMLElement | null>(null);
  const {handleSlug} = usePageTransition();

  // RETRACTABLE HEADER ON SCROLL
  useGSAP(() => {
    if (!headerRef.current) return;

    const header = headerRef.current;

    const observer = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      onUp: (self) => {
        // Hide when scrolling up
        if (self.deltaY < -200)
          GSAP.to(header, {
            yPercent: -100,
            duration: 0.5,
            ease: 'power3.out',
            delay: 0.2,
          });
      },
      onDown: () => {
        // Show when scrolling down
        GSAP.to(header, {
          yPercent: 0,
          duration: 0.5,
          ease: 'power3.out',
          delay: 0.2,
        });
      },
    });
    return () => {
      observer.kill();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-40 bg-secondary/5 backdrop-blur-2xl"
    >
      {/* CONTAINER */}
      <div className="text-secondary flex items-end justify-between gap-32 px-4 lg:px-8 2xl:px-0 h-header max-w-container mx-auto mb-4">
        {/* MOBILE CTAS */}
        <div className="md:hidden absolute top-4 right-4">
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>

        {/* LOGO */}
        <NavLink
          className={({isActive}) =>
            (isActive ? 'text-secondary/80' : 'text-secondary') +
            ' text-headline-large leading-none px-1 font-thin'
          }
          prefetch="intent"
          to="/"
          end
          onClick={(e) => {
            e.preventDefault();
            handleSlug?.('/');
          }}
        >
          {shop.name}
        </NavLink>

        {/* NAV MENU */}
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />

        {/* DESKTOP CTAS */}
        <div className="hidden md:block">
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>
        <HeaderMenuMobileToggle />
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();
  const {handleSlug} = usePageTransition();
  const headerStyles = `${viewport === 'mobile' ? 'flex flex-col items-center' : 'hidden lg:flex flex-1 justify-center'} gap-6`;

  return (
    <nav className={headerStyles} role="navigation">
      {/* MOBILE (render home link) */}
      {viewport === 'mobile' && (
        <NavLink
          className={({isActive}) =>
            (isActive ? 'active text-secondary/50' : 'text-secondary') +
            ' underlined-link text-headline-large font-thin leading-16'
          }
          end
          prefetch="intent"
          // style={activeLinkStyle}
          to="/"
          onClick={(e) => {
            e.preventDefault();
            close();
            handleSlug?.('/');
          }}
        >
          Home
        </NavLink>
      )}

      {/* MOBILE & DESKTOP */}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className={({isActive}) =>
              (isActive ? 'active text-secondary/50' : 'text-secondary') +
              ' underlined-link' +
              (viewport === 'mobile'
                ? ' text-headline-large font-thin leading-16'
                : '')
            }
            end
            key={item.id}
            prefetch="intent"
            // style={activeLinkStyle}
            to={url}
            onClick={(e) => {
              e.preventDefault();
              close();
              handleSlug?.(url);
            }}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-end gap-4 z-50" role="navigation">
      {/* ACCOUNT */}
      <NavLink
        prefetch="intent"
        to="/account"
        className={({isActive}) =>
          (isActive ? 'active text-secondary/50' : 'text-secondary') +
          ' underlined-link'
        }
        // style={activeLinkStyle}
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>

      {/* SEARCH */}
      <SearchToggle />

      {/* CART */}
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="lg:hidden"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <IconBurger />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="underlined-link" onClick={() => open('search')}>
      Search
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      className="relative flex items-start gap-1"
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        // for analytics
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <span className="underlined-link">Cart</span>
      {count !== null && count > 0 && (
        <span className="rounded-full bg-secondary text-primary w-4 aspect-square text-label-small flex items-center justify-center">
          {count === null ? <span>&nbsp;</span> : count}
        </span>
      )}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

export default function IconBurger() {
  return (
    <div className="h-8 w-12 flex flex-col justify-center gap-3 relative">
      <div className="h-px w-full bg-secondary"></div>
      <div className="h-px w-full bg-secondary"></div>
    </div>
  );
}

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'var(--color-accent-1)' : 'var(--color-accent-2)',
  };
}
