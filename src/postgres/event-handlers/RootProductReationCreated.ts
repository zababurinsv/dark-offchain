import { NormalizedProduct } from '../../substrate/normalizers';
import { SubstrateEvent } from '../../substrate/types';
import { parseProductEvent } from '../../substrate/utils';
import { insertActivityForProductReaction } from '../inserts/insertActivityForProductReaction';
import { insertNotificationForOwner } from '../inserts/insertNotificationForOwner';
import { informTelegramClientAboutNotifOrFeed } from '../../express-api/events';

export const onRootProductReactionCreated = async (eventAction: SubstrateEvent, product: NormalizedProduct) => {
  const { author: voter, productId } = parseProductEvent(eventAction)

  const ids = [ productId ];
  const reactionCount = product.upvotesCount + product.downvotesCount - 1;
  const productAuthor = product.createdByAccount;
  const insertResult = await insertActivityForProductReaction(eventAction, reactionCount, ids, productAuthor);
  if (insertResult === undefined) return

  if (voter === productAuthor) return;

  await insertNotificationForOwner({ ...insertResult, account: productAuthor });
  informTelegramClientAboutNotifOrFeed(eventAction.data[0].toString(), productAuthor, insertResult.blockNumber, insertResult.eventIndex, 'notification')
}