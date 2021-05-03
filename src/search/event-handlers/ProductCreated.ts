import { EventHandlerFn } from '../../substrate/types';
import { parseProductEvent } from '../../substrate/utils';
import { indexProductContent } from '../indexer';
import BN from 'bn.js';
import { resolveDarkdotApi } from '../../connections';

export const onProductCreated: EventHandlerFn = async (eventAction) => {
  const { productId } = parseProductEvent(eventAction)

  const { substrate } = await resolveDarkdotApi()

  const product = await substrate.findProduct({ id: new BN(productId) });
  if (!product) return;

  await indexProductContent(product);
}
