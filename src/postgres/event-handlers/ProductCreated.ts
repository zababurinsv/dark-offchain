import { EventHandlerFn } from '../../substrate/types';
import { onCommentCreated } from './CommentCreated';
import { onRootCreated } from './RootProductCreated';
import { findProductAndProccess } from './utils';

export const onProductCreated: EventHandlerFn = async (eventAction) => {
  await findProductAndProccess({
    onRootProduct: onRootCreated,
    onComment: onCommentCreated,
    eventAction
  })
}
