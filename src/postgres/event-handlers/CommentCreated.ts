import { CommentId } from '@subsocial/types/substrate/interfaces/subsocial';
import { substrate } from '../../substrate/subscribe';
import { insertCommentFollower } from '../insert-follower';
import { insertActivityComments, insertActivityForComment } from '../insert-activity';
import { fillNotificationsWithAccountFollowers, fillNotificationsWithPostFollowers } from '../fill-activity';
import { substrateLog as log } from '../../connections/loggers';
import { SubstrateEvent, EventHandlerFn } from '../../substrate/types';

export const onCommentCreated: EventHandlerFn = async (eventAction: SubstrateEvent) => {
  const { data } = eventAction;
  await insertCommentFollower(data);
  const commentId = data[1] as CommentId;

  const comment = await substrate.findComment(commentId);
  if (!comment) return;

  const postId = comment.post_id;
  const post = await substrate.findPost(postId);
  if (!post) return;

  const postCreator = post.created.account.toString();
  const commentCreator = comment.created.account.toString();
  const ids = [ postId, commentId ];
  if (comment.parent_id.isSome) {
    log.debug('Comment has a parent id');
    await insertActivityComments(eventAction, ids, comment);
  } else {
    const activityId = await insertActivityForComment(eventAction, ids, postCreator);
    if (activityId === -1) return;

    log.debug('Comment does not have a parent id');
    await fillNotificationsWithPostFollowers(postId, commentCreator, activityId);
    await fillNotificationsWithAccountFollowers(commentCreator, activityId);
  }
}