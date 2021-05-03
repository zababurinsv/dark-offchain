import { findProduct } from '../../substrate/api-wrappers';
import { asNormalizedComment, NormalizedComment } from '../../substrate/normalizers';
import { SubstrateEvent } from '../../substrate/types';
import { VirtualEvents } from '../../substrate/utils';
import { parseCommentEvent } from '../../substrate/utils';
import { fillNewsFeedWithAccountFollowers } from '../fills/fillNewsFeedWithAccountFollowers';
import { fillNewsFeedWithStorefrontFollowers } from '../fills/fillNewsFeedWithStorefrontFollowers';
import { fillNotificationsWithAccountFollowers } from '../fills/fillNotificationsWithAccountFollowers';
import { fillNotificationsWithCommentFollowers } from '../fills/fillNotificationsWithCommentFollowers';
import { insertActivityForComment } from '../inserts/insertActivityForComment';
import { informTelegramClientAboutNotifOrFeed } from '../../express-api/events';

export const onCommentShared = async (eventAction: SubstrateEvent, comment: NormalizedComment) => {
  const { author, commentId } = parseCommentEvent(eventAction)

  const { rootProductId } = asNormalizedComment(comment)
  const rootProduct = await findProduct(rootProductId);
  if (!rootProduct) return;

  eventAction.eventName = VirtualEvents.CommentShared
  const storefrontId = rootProduct.storefrontId;
  const ids = [ storefrontId, rootProductId, commentId ];
  const account = comment.createdByAccount;

  const insertResult = await insertActivityForComment(eventAction, ids, account);
  if (insertResult === undefined) return;

  await fillNotificationsWithCommentFollowers(commentId, { account, ...insertResult });
  await fillNotificationsWithAccountFollowers({ account, ...insertResult });
  await fillNewsFeedWithStorefrontFollowers(storefrontId, { account: author, ...insertResult });
  await fillNewsFeedWithAccountFollowers({ account: author, ...insertResult })
  informTelegramClientAboutNotifOrFeed(eventAction.data[0].toString(), account, insertResult.blockNumber, insertResult.eventIndex, 'notification')
  informTelegramClientAboutNotifOrFeed(eventAction.data[0].toString(), account, insertResult.blockNumber, insertResult.eventIndex, 'feed')

}
