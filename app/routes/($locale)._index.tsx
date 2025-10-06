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
  RecommendedProductsQuery,
  ProductFragment,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {Showreel, ScrollMarquee} from '~/components/addons';

export const meta: MetaFunction = () => {
  return [{title: 'ARRVLS | Home'}];
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
  const recommendedProducts = context.storefront
    .query(FEATURED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  const showreelImages = data.homeShowreel?.products.nodes.flatMap(
    (product: any) => product.images.nodes,
  );

  return (
    <div className="home">
      <Showreel showreelImages={showreelImages || []} />
      {/* MARQUEE */}
      <div className="relative w-full overflow-clip z-10 bg-secondary">
        <ScrollMarquee>
          <h1 className="text-headline-large text-nowrap text-primary px-8">
            A modern React & JavaScript component library powered by GSAP &
            Tailwind
          </h1>
        </ScrollMarquee>
      </div>
      <FeaturedCollection collection={data.featuredCollection} />
      <FeaturedProducts products={data.recommendedProducts} />
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="block relative h-[700px] md:h-[800px] overflow-clip"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="relative w-full h-full">
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
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="mt-24">
      <h2 className="text-title-small md:text-title-medium lg:text-title-large mb-4">
        Featured
      </h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
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
    collection(handle: "all-products") {
      ...FeaturedCollection
    }
  }
` as const;

const HOME_SHOWREEL_QUERY = `#graphql
  fragment ShowreelProduct on Product {
    images(first: 10) {
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
      products(first: 20) {
        nodes {
          ...ShowreelProduct
        }
      }
    }
  }
` as const;

const FEATURED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
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
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
