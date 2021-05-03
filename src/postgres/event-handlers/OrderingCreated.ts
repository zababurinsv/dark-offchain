import { OrderingId } from '@darkpay/dark-types/substrate/interfaces/darkdot';
import { findOrdering } from '../../substrate/api-wrappers';
import { EventHandlerFn } from '../../substrate/types';
import { fillNotificationsWithAccountFollowers } from '../fills/fillNotificationsWithAccountFollowers';
import { insertActivityForOrdering } from '../inserts/insertActivityForOrdering';
import { informTelegramClientAboutNotifOrFeed } from '../../express-api/events';

export const onOrderingCreated: EventHandlerFn = async (eventAction) => {
  const { data } = eventAction;
  const account = data[0].toString();
  const insertResult = await insertActivityForOrdering(eventAction, 0);
  if(insertResult === undefined) return

  await fillNotificationsWithAccountFollowers({ account, ...insertResult });
  informTelegramClientAboutNotifOrFeed(eventAction.data[0].toString(), account, insertResult.blockNumber, insertResult.eventIndex, 'notification')

  const orderingId = data[1] as OrderingId;
  const ordering = await findOrdering(orderingId);
  if (!ordering) return;
}
