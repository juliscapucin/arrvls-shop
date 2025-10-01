import {createHydrogenContext} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';
import {getLocaleFromRequest} from '~/lib/i18n';

const additionalContext = {
  // Additional context for custom properties, CMS clients, 3P SDKs, etc.
} as const;

type AdditionalContextType = typeof additionalContext;

declare global {
  interface HydrogenAdditionalContext extends AdditionalContextType {}
}

export async function createHydrogenRouterContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      i18n: getLocaleFromRequest(request),
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
      },
    },
    additionalContext,
  );

  return hydrogenContext;
}

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 * */
export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: getLocaleFromRequest(request),
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  });

  return {
    ...hydrogenContext,
    // declare additional Remix loader context
  };
}
