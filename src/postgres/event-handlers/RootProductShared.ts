import { SubstrateEvent } from '../../substrate/types';
import { parseProductEvent } from '../../substrate/utils';
import { fillNewsFeedWithAccountFollowers } from '../fills/fillNewsFeedWithAccountFollowers';
import { fillNewsFeedWithStorefrontFollowers } from '../fills/fillNewsFeedWithStorefrontFollowers';
import { fillNotificationsWithAccountFollowers } from '../fills/fillNotificationsWithAccountFollowers';
import { insertActivityForProduct } from '../inserts/insertActivityForProduct';
import { insertNotificationForOwner } from '../inserts/insertNotificationForOwner';
import { NormalizedProduct } from '../../substrate/normalizers';
import { informTelegramClientAboutNotifOrFeed } from '../../express-api/events';

export const onRootProductShared = async (eventAction: SubstrateEvent, product: NormalizedProduct) => {
  const { author, productId } = parseProductEvent(eventAction)

  let storefrontId = product.storefrontId

  const ids = [ storefrontId, productId ];
  const insertResult = await insertActivityForProduct(eventAction, ids);
  if (insertResult === undefined) return;

  const account = product.createdByAccount;
  await insertNotificationForOwner({ account, ...insertResult });
  await fillNotificationsWithAccountFollowers({ account: author, ...insertResult });
  await fillNewsFeedWithStorefrontFollowers(storefrontId, { account: author, ...insertResult });
  await fillNewsFeedWithAccountFollowers({ account: author, ...insertResult })
  informTelegramClientAboutNotifOrFeed(eventAction.data[0].toString(), account, insertResult.blockNumber, insertResult.eventIndex, 'notification')
  informTelegramClientAboutNotifOrFeed(eventAction.data[0].toString(), account, insertResult.blockNumber, insertResult.eventIndex, 'feed')

}
