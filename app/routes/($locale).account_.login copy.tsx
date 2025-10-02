import type {LoaderFunctionArgs} from 'react-router';
import {Link, useSearchParams} from 'react-router';

export default function Login() {
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('return_to') || '/account';

  const handleLogin = () => {
    // Redirect to the authorize route with return_to parameter
    const authorizeUrl = `/account/authorize?return_to=${encodeURIComponent(returnTo)}`;
    window.location.href = authorizeUrl;
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      {/* Custom login container */}
      <div className="max-w-md w-full space-y-8">
        {/* Custom header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary font-primary">
            Welcome to ARRVLS
          </h1>
          <p className="mt-2 text-sm text-secondary/70">
            Sign in to your account
          </p>
        </div>

        {/* Login message */}
        <div className="bg-primary-light/50 rounded-lg p-6 border border-primary-accent/20">
          <div className="text-center space-y-4">
            <p className="text-secondary">
              Sign in securely with your Shopify customer account to access your
              orders, wishlist, and account settings.
            </p>

            {/* Login button */}
            <div>
              <button
                onClick={handleLogin}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-primary bg-accent-1 hover:bg-accent-1/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-1 transition-colors"
              >
                Sign in to your account
              </button>
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="bg-primary-light/30 rounded-lg p-4 border border-primary-accent/10">
          <div className="text-center">
            <p className="text-xs text-secondary/60">
              New to ARRVLS? You&apos;ll be able to create an account during the
              sign-in process.
            </p>
          </div>
        </div>

        {/* Back to store link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-secondary/60 hover:text-secondary transition-colors"
          >
            ← Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function loader({request, context}: LoaderFunctionArgs) {
  // Check if user is already logged in
  const customer = await context.customerAccount.isLoggedIn();
  if (customer) {
    const url = new URL(request.url);
    const returnTo = url.searchParams.get('return_to') || '/account';
    throw new Response(null, {
      status: 302,
      headers: {
        Location: returnTo,
      },
    });
  }

  // If not logged in, render the login page
  return null;
}
