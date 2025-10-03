import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  type LoaderFunctionArgs,
} from 'react-router';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: LoaderFunctionArgs) {
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Account`
    : 'Account Details';

  return (
    <div className="flex flex-col gap-4 min-h-full-mobile md:min-h-full-desktop">
      <AccountMenu />

      <h1 className="heading-display">{heading}</h1>

      {/* CONTENT */}
      <Outlet context={{customer}} />
    </div>
  );
}

function AccountMenu() {
  function isActiveStyle({
    isActive,
    isPending,
  }: {
    isActive: boolean;
    isPending: boolean;
  }) {
    return `${isActive ? 'font-bold' : ''} ${isPending ? 'opacity-50 pointer-events-none' : ''}`;
  }

  return (
    <nav className="flex justify-between" role="navigation">
      <div className="flex gap-4">
        <NavLink
          to="/account/orders"
          className={`underlined-link ${isActiveStyle}`}
        >
          Orders
        </NavLink>

        <NavLink
          to="/account/profile"
          className={`underlined-link ${isActiveStyle}`}
        >
          Profile
        </NavLink>

        <NavLink
          to="/account/addresses"
          className={`underlined-link ${isActiveStyle}`}
        >
          Addresses
        </NavLink>
      </div>

      <Logout />
    </nav>
  );
}

function Logout() {
  return (
    <Form className="inline-block" method="POST" action="/account/logout">
      <button type="submit">Sign out →</button>
    </Form>
  );
}
