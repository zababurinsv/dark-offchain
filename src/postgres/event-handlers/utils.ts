import { SubstrateEvent } from '../../substrate/types';
import { parseProductEvent } from '../../substrate/utils';
import { findProduct } from '../../substrate/api-wrappers';
import { NormalizedProduct } from '../../substrate/normalizers';

type ProductHandler = (eventAction: SubstrateEvent, product?: NormalizedProduct) => Promise<void>

type ProductHandlers = {
  eventAction: SubstrateEvent
  onRootProduct: ProductHandler
  onComment: ProductHandler
}

export const findProductAndProccess = async ({ eventAction, onRootProduct, onComment }: ProductHandlers) => {
  const { productId } = parseProductEvent(eventAction)
  const product = await findProduct(productId)
  if (!product) return;

  if (product.isComment) {
    await onComment(eventAction, product)
  } else {
    await onRootProduct(eventAction, product)
  }
}