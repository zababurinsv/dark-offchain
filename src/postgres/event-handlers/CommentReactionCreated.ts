import { NormalizedProduct, asNormalizedComment } from '../../substrate/normalizers';
import { SubstrateEvent } from '../../substrate/types';
import { parseCommentEvent } from '../../substrate/utils';
import { VirtualEvents } from '../../substrate/utils';
import { insertActivityForCommentReaction } from '../inserts/insertActivityForCommentReaction';
import { insertNotificationForOwner } from '../inserts/insertNotificationForOwner';
import { informTelegramClientAboutNotifOrFeed } from '../../express-api/events';

export const onCommentReactionCreated = async (eventAction: SubstrateEvent, product: NormalizedProduct) => {
  const { author: voter, commentId } = parseCommentEvent(eventAction)

  const {
    parentId,
    rootProductId,
    createdByAccount,
    upvotesCount,
    downvotesCount
  } = asNormalizedComment(product)

  eventAction.eventName = VirtualEvents.CommentReactionCreated
  const parent = parentId ? parentId : rootProductId
  const ids = [ parent, commentId ];
  const reactionCount = upvotesCount + downvotesCount - 1;

  const insertResult = await insertActivityForCommentReaction(eventAction, reactionCount, ids, createdByAccount);
  if (insertResult === undefined) return;

  if (voter === createdByAccount) return;
  // insertAggStream(eventAction, commentId);

  await insertNotificationForOwner({ ...insertResult, account: createdByAccount });
  informTelegramClientAboutNotifOrFeed(eventAction.data[0].toString(), createdByAccount, insertResult.blockNumber, insertResult.eventIndex, 'notification')
}
