import { StorefrontId } from '@darkpay/dark-types/substrate/interfaces/darkdot';
import { resolveDarkdotApi } from '../../connections/darkdot';
import { EventHandlerFn } from '../../substrate/types';
import { indexStorefrontContent } from '../indexer';

export const onStorefrontUpdated: EventHandlerFn = async (eventAction) => {
  const { data } = eventAction;
  const storefrontId = data[1] as StorefrontId;

  const { substrate } = await resolveDarkdotApi()

  const storefront = await substrate.findStorefront({ id: storefrontId });
  if (!storefront) return;

  await indexStorefrontContent(storefront);
}
