import { StorefrontId } from '@darkpay/dark-types/substrate/interfaces/darkdot';
import { findStorefront } from '../../substrate/api-wrappers';
import { EventHandlerFn } from '../../substrate/types';
import { insertActivityForStorefront } from '../inserts/insertActivityForStorefront';
import { insertNotificationForOwner } from '../inserts/insertNotificationForOwner';
import { insertStorefrontFollower } from '../inserts/insertStorefrontFollower';
import { informTelegramClientAboutNotifOrFeed } from '../../express-api/events';

export const onStorefrontFollowed: EventHandlerFn = async (eventAction) => {
  const { data } = eventAction;
  await insertStorefrontFollower(data);
  const storefrontId = data[1] as StorefrontId;
  const storefront = await findStorefront(storefrontId);
  if (!storefront) return;

  const count = storefront.followersCount - 1;
  const account = storefront.owner;
  const insertResult = await insertActivityForStorefront(eventAction, count, account);
  if (insertResult === undefined) return;

  const follower = data[0].toString();
  if (follower === account) return;

  await insertNotificationForOwner({ account, ...insertResult });
  informTelegramClientAboutNotifOrFeed(eventAction.data[0].toString(), account, insertResult.blockNumber, insertResult.eventIndex, 'notification')
}
