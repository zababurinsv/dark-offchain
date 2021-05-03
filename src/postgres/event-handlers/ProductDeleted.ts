import { EventHandlerFn } from '../../substrate/types';
import { onCommentDeleted } from './CommentDeleted';
import { onRootProductDeleted } from './RootProductDeleted';
import { findProductAndProccess } from './utils';

export const onProductDeleted: EventHandlerFn = async (eventAction) => {
  await findProductAndProccess({
    onRootProduct: onRootProductDeleted,
    onComment: onCommentDeleted,
    eventAction
  })
}
