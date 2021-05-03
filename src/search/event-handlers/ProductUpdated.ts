import { resolveDarkdotApi } from '../../connections/darkdot';
import { EventHandlerFn } from '../../substrate/types';
import { parseProductEvent } from '../../substrate/utils';
import { indexProductContent } from '../indexer';
import BN from 'bn.js';

export const onProductUpdated: EventHandlerFn = async (eventAction) => {
  const { substrate } = await resolveDarkdotApi()

  const { productId } = parseProductEvent(eventAction)
  
  const product = await substrate.findProduct({ id: new BN(productId)});
  if (!product) return;

  await indexProductContent(product);
}
