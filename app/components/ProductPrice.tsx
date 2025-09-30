import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

/**
 * Product price on cart + pdp
 */

export function ProductPrice({
  price,
  compareAtPrice,
  classes,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  classes?: string;
}) {
  return (
    <div className={classes}>
      {compareAtPrice ? (
        <div className="flex gap-1">
          {price ? <Money data={price} /> : null}
          <s>
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
