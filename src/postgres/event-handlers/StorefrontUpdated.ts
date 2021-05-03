import { StorefrontId } from '@darkpay/dark-types/substrate/interfaces/darkdot';
import { findStorefront } from '../../substrate/api-wrappers';
import { EventHandlerFn } from '../../substrate/types';

export const onStorefrontUpdated: EventHandlerFn = async (eventAction) => {
  const { data } = eventAction;
  const storefrontId = data[1] as StorefrontId;
  const storefront = await findStorefront(storefrontId);
  if (!storefront) return;
}
