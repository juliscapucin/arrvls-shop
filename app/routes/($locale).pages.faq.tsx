import {
  useLoaderData,
  type MetaFunction,
  type LoaderFunctionArgs,
} from 'react-router';
import {Accordion} from '~/components/addons';
import APP_NAME from '~/data/appName';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `${APP_NAME} | ${data?.page.title ?? ''}`}];
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
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: 'faq',
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  return {
    page,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

function parseAccordionData(html: string) {
  const items = [];
  const sectionRegex = /<h2>(.*?)<\/h2>\s*([\s\S]*?)(?=<h2>|$)/g;
  let match;

  while ((match = sectionRegex.exec(html)) !== null) {
    const title = match[1].trim();
    const sectionContent = match[2].trim();

    // Find all <p>...</p> inside this section
    const paragraphMatches = [
      ...sectionContent.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g),
    ];

    // Clean up text: remove inner tags, decode HTML entities if needed
    const paragraphs = paragraphMatches
      .map((p) =>
        p[1]
          .replace(/<[^>]+>/g, '') // remove nested HTML tags
          .replace(/\s+/g, ' ') // normalize whitespace
          .trim(),
      )
      .filter(Boolean); // remove empty ones

    items.push({title, content: paragraphs});
  }

  return items;
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  const accordionData = parseAccordionData(page.body);

  return (
    <div className="w-full max-w-container mx-auto">
      <header>
        <h1 className="heading-display mt-8">{page.title}</h1>
      </header>

      <main className="max-w-prose mt-16 [&>div>h3]:heading-headline [&>div>h3]:mt-8">
        <Accordion items={accordionData} />
      </main>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
