import { NormalizedProduct } from '../../substrate/normalizers';
import { SubstrateEvent } from '../../substrate/types';
import { parseProductEvent } from '../../substrate/utils';
import { fillNewsFeedWithAccountFollowers } from '../fills/fillNewsFeedWithAccountFollowers';
import { fillNewsFeedWithStorefrontFollowers } from '../fills/fillNewsFeedWithStorefrontFollowers';
import { insertActivityForProduct } from '../inserts/insertActivityForProduct';
import { insertProductFollower } from '../inserts/insertProductFollower';
import { informTelegramClientAboutNotifOrFeed } from '../../express-api/events';

export const onRootCreated = async (eventAction: SubstrateEvent, product: NormalizedProduct) => {
  const { author, productId } = parseProductEvent(eventAction)

  await insertProductFollower(eventAction.data);

  const storefrontId = product.storefrontId
  const ids = [storefrontId, productId ];
  const insertResult = await insertActivityForProduct(eventAction, ids, 0);
  if (insertResult === undefined) return;

  await fillNewsFeedWithStorefrontFollowers(storefrontId, { account: author, ...insertResult });
  await fillNewsFeedWithAccountFollowers({ account: author, ...insertResult });
  informTelegramClientAboutNotifOrFeed(eventAction.data[0].toString(), author, insertResult.blockNumber, insertResult.eventIndex, 'feed')
}
