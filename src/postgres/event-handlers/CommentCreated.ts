import { substrateLog as log } from '../../connections/loggers';
import { SubstrateEvent } from '../../substrate/types';
import { VirtualEvents } from '../../substrate/utils';
import { parseCommentEvent } from '../../substrate/utils';
import { insertCommentFollower } from '../inserts/insertCommentFollower';
import { insertActivityForComment } from '../inserts/insertActivityForComment';
import { fillNotificationsWithProductFollowers } from '../fills/fillNotificationsWithProductFollowers';
import { fillNotificationsWithAccountFollowers } from '../fills/fillNotificationsWithAccountFollowers';
import { insertNotificationForOwner } from '../inserts/insertNotificationForOwner';
import { asNormalizedComment, NormalizedComment } from '../../substrate/normalizers';
import { findProduct } from '../../substrate/api-wrappers';
import { informTelegramClientAboutNotifOrFeed } from '../../express-api/events';

export const onCommentCreated = async (eventAction: SubstrateEvent, product: NormalizedComment) => {
  const { author, commentId } = parseCommentEvent(eventAction)

  const { parentId, rootProductId } = asNormalizedComment(product)

  const rootProduct = await findProduct(rootProductId);

  if (!rootProduct) return;

  await insertCommentFollower(eventAction.data);

  const productCreator = rootProduct.createdByAccount;
  const ids = [rootProductId, commentId];

  if (parentId) {
    eventAction.eventName = VirtualEvents.CommentReplyCreated
    log.debug('Comment has a parent id');
    // const parentId = parentId.unwrap();
    const param = [...ids, parentId];
    const parentComment = await findProduct(parentId);

    const parentOwner = parentComment.owner.toString();
    const insertResult = await insertActivityForComment(eventAction, param, author);

    if (author === parentOwner || insertResult === undefined) return;
    await insertNotificationForOwner({ ...insertResult, account: parentOwner });
  } else {
    eventAction.eventName = VirtualEvents.CommentCreated
    const insertResult = await insertActivityForComment(eventAction, ids, productCreator);
    if (insertResult === undefined) return;

    log.debug('Comment does not have a parent id');
    await fillNotificationsWithProductFollowers(rootProductId, { account: author, ...insertResult }, productCreator);
    await fillNotificationsWithAccountFollowers({ account: author, ...insertResult });
    informTelegramClientAboutNotifOrFeed(eventAction.data[0].toString(), productCreator, insertResult.blockNumber, insertResult.eventIndex, 'notification')
  }
}
