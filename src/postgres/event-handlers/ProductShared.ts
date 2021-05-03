import { EventHandlerFn } from '../../substrate/types';
import { onCommentShared } from './CommentShared';
import { onRootProductShared } from './RootProductShared';
import { findProductAndProccess } from './utils';

export const onProductShared: EventHandlerFn = async (eventAction) => {
  await findProductAndProccess({
    onRootProduct: onRootProductShared,
    onComment: onCommentShared,
    eventAction
  })
}
