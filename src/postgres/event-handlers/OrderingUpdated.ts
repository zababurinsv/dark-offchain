import { OrderingId } from '@darkpay/dark-types/substrate/interfaces/darkdot';
import { findOrdering } from '../../substrate/api-wrappers';
import { EventHandlerFn } from '../../substrate/types';

export const onOrderingUpdated: EventHandlerFn = async (eventAction) => {
  const { data } = eventAction;
  const orderingId = data[1] as OrderingId;
  const ordering = await findOrdering(orderingId);
  if (!ordering) return;
}
