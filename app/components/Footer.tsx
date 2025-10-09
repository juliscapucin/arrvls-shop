import {Suspense, useRef} from 'react';
import {Await, NavLink, useLocation} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

import GSAP from 'gsap';
import {useGSAP} from '@gsap/react';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {usePageTransition} from '~/components/addons/PageTransition';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) =>
          footer?.menu && header.shop.primaryDomain?.url ? (
            <FooterMenu
              menu={footer.menu}
              shop={header.shop}
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
            />
          ) : null
        }
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  shop,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  shop: FooterProps['header']['shop'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  const {handleSlug} = usePageTransition();

  const footerContainerRef = useRef<HTMLDivElement>(null);
  const footerContentRef = useRef<HTMLDivElement>(null);
  const footerMaskRef = useRef<HTMLDivElement>(null);

  const location = useLocation();

  // FOOTER REVEAL + PARALLAX ON SCROLL
  useGSAP(() => {
    if (
      !footerContainerRef.current ||
      !footerContentRef.current ||
      !footerMaskRef.current
    )
      return;

    GSAP.registerPlugin(ScrollTrigger);

    ScrollTrigger.clearScrollMemory();

    ScrollTrigger.getById('footer')?.refresh();

    setTimeout(() => {
      const tl = GSAP.timeline({
        scrollTrigger: {
          trigger: footerContainerRef.current,
          id: 'footer',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0,
          invalidateOnRefresh: true,
          // markers: true,
        },
      });

      tl.fromTo(
        footerMaskRef.current,
        {yPercent: 0},
        {
          yPercent: -100,
          ease: 'none',
        },
      ).fromTo(
        footerContentRef.current,
        {yPercent: -60},
        {yPercent: 0, ease: 'none'},
        0, // start at the same time as previous tween
      );
    }, 100); // needs to be declared after scrollSmoother on PageLayout
  }, [location.pathname]);

  return (
    <div className="relative overflow-clip">
      <div className="absolute inset-0 bg-secondary/5"></div>
      {/* MASK */}
      <div
        ref={footerMaskRef}
        className="absolute inset-0 z-20 bg-primary"
      ></div>
      {/* GRID */}
      <div className="absolute inset-0 -z-20 grid-texture"></div>
      <footer
        ref={footerContainerRef}
        className="relative text-secondary h-footer max-w-container mx-auto py-8 flex flex-wrap items-end justify-between px-4 md:px-8 2xl:px-0"
      >
        {/* NAVIGATION */}
        <nav
          ref={footerContentRef}
          className="flex flex-wrap items-end gap-4 sm:gap-8 md:gap-16 mb-8 md:mb-0"
          role="navigation"
        >
          {/* LOGO */}
          <NavLink
            className={({isActive}) =>
              (isActive
                ? 'text-secondary/80 pointer-events-none'
                : 'text-secondary') +
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

          {/* MENU ITEMS */}
          <div className="flex flex-col gap-4 justify-end h-fit">
            {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
              if (!item.url) return null;
              // if the url is internal, we strip the domain
              const url =
                item.url.includes('myshopify.com') ||
                item.url.includes(publicStoreDomain) ||
                item.url.includes(primaryDomainUrl)
                  ? new URL(item.url).pathname
                  : item.url;
              const isExternal = !url.startsWith('/');
              return isExternal ? (
                <a
                  href={url}
                  key={item.id}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {item.title}
                </a>
              ) : (
                <NavLink
                  className={({isActive}) =>
                    (isActive
                      ? 'active text-secondary/50 pointer-events-none'
                      : 'text-secondary') + ' underlined-link'
                  }
                  end
                  key={item.id}
                  prefetch="intent"
                  // style={activeLinkStyle}
                  to={url}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSlug?.(url);
                  }}
                >
                  {item.title}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* BOTTOM BAR */}
        <div className="relative z-50 text-secondary/60 flex flex-wrap justify-end gap-2 lg:gap-16">
          <span className="text-secondary/60">
            © {new Date().getFullYear()} {shop.name}
          </span>
          <span className="ml-auto">
            Website by{' '}
            <a
              href="https://www.juliscapucin.com"
              className="underlined-link text-secondary/60"
              target="_blank"
              rel="noopener noreferrer"
            >
              Juli Scapucin
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

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
