import { StorefrontId } from '@darkpay/dark-types/substrate/interfaces/darkdot';
import { findStorefront } from '../../substrate/api-wrappers';
import { EventHandlerFn } from '../../substrate/types';
import { fillNotificationsWithAccountFollowers } from '../fills/fillNotificationsWithAccountFollowers';
import { insertActivityForStorefront } from '../inserts/insertActivityForStorefront';
import { informTelegramClientAboutNotifOrFeed } from '../../express-api/events';

export const onStorefrontCreated: EventHandlerFn = async (eventAction) => {
  const { data } = eventAction;
  const account = data[0].toString();
  const insertResult = await insertActivityForStorefront(eventAction, 0);
  if(insertResult === undefined) return

  await fillNotificationsWithAccountFollowers({ account, ...insertResult });
  informTelegramClientAboutNotifOrFeed(eventAction.data[0].toString(), account, insertResult.blockNumber, insertResult.eventIndex, 'notification')

  const storefrontId = data[1] as StorefrontId;
  const storefront = await findStorefront(storefrontId);
  if (!storefront) return;
}
