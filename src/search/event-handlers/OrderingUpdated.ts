import { OrderingId } from '@darkpay/dark-types/substrate/interfaces/darkdot';
import { resolveDarkdotApi } from '../../connections/darkdot';
import { EventHandlerFn } from '../../substrate/types';
import { indexOrderingContent } from '../indexer';

export const onOrderingUpdated: EventHandlerFn = async (eventAction) => {
  const { data } = eventAction;
  const orderingId = data[1] as OrderingId;

  const { substrate } = await resolveDarkdotApi()

  const ordering = await substrate.findOrdering({ id: orderingId });
  if (!ordering) return;

  await indexOrderingContent(ordering);
}
