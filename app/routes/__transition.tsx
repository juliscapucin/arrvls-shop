import {PageTransition} from '~/components/addons';
import {Outlet} from 'react-router';

export default function TransitionLayout() {
  return (
    <PageTransition>
      <Outlet />
    </PageTransition>
  );
}
