import {
  Await,
  useLoaderData,
  Link,
  type MetaFunction,
  type LoaderFunctionArgs,
} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  ProductFragment,
  CollectionQuery,
  FeaturedCollectionQuery,
  FeaturedProductsCollectionQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {Showreel, ScrollMarquee} from '~/components/addons';

const gridLayout = [
  'col-start-1 col-end-7',
  'col-start-5 col-end-9',
  'col-start-1 col-end-7',
  'col-start-9 col-end-13',
  'col-start-7 col-end-13',
];

import APP_NAME from '~/data/appName';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `${APP_NAME} | Home`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [featured, showreel] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(HOME_SHOWREEL_QUERY),
  ]);

  return {
    featuredCollection: featured.collection,
    homeShowreel: showreel.collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const featuredProducts = context.storefront
    .query(FEATURED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    featuredProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  const showreelImages =
    data.homeShowreel?.products.nodes.flatMap((product: any) =>
      product.firstImage?.nodes?.[0] ? [product.firstImage.nodes[0]] : [],
    ) ?? [];

  return (
    <>
      <Showreel showreelImages={showreelImages || []} />

      {/* MARQUEE */}
      <ScrollMarquee>
        <h1 className="heading-headline text-nowrap text-secondary px-8 py-16 uppercase">
          A modern React & JavaScript component library powered by GSAP &
          Tailwind
        </h1>
      </ScrollMarquee>

      <FeaturedCollection collection={data.featuredCollection} />
      <FeaturedProducts products={data.featuredProducts} />
    </>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment | null | undefined;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="block relative h-[var(--showreel-height)] w-full max-w-container mx-auto"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="relative w-full h-full overflow-clip">
          <Image
            className="w-full h-full object-cover"
            data={image}
            sizes="100vw"
          />
        </div>
      )}
      <h1 className="heading-display absolute bottom-0 left-4 mix-blend-difference">
        {collection.title}
      </h1>
    </Link>
  );
}

function FeaturedProducts({
  products,
}: {
  products: Promise<FeaturedProductsCollectionQuery | null>;
}) {
  return (
    <div className="mt-24">
      {/* <h2 className="heading-display mb-4">Featured</h2> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="grid gap-x-6 gap-y-40 md:grid-cols-2 lg:grid-cols-3 w-full max-w-container mx-auto">
              {response
                ? response.collection?.products.nodes.map((product, index) => (
                    <ProductItem
                      key={product.id}
                      product={product}
                      className={gridLayout[index % gridLayout.length]}
                    />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: "featured") {
      ...FeaturedCollection
    }
  }
` as const;

const HOME_SHOWREEL_QUERY = `#graphql
  fragment ShowreelProduct on Product {
    firstImage: images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }

  query HomeShowreel($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: "home-showreel") {
      id
      title
      products(first: 7) {
        nodes {
          ...ShowreelProduct
        }
      }
    }
  }
` as const;

const FEATURED_PRODUCTS_QUERY = `#graphql
  fragment FeaturedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }

  query FeaturedProductsCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: "featured") {
      id
      title
      products(first: 6) {
        nodes {
          ...FeaturedProduct
        }
      }
    }
  }
` as const;
