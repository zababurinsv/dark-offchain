import { EventHandlerFn } from '../../substrate/types';
import { onCommentReactionCreated } from '.';
import { onRootProductReactionCreated } from './RootProductReationCreated';
import { findProductAndProccess } from './utils';

export const onProductReactionCreated: EventHandlerFn = async (eventAction) => {
  await findProductAndProccess({
    onRootProduct: onRootProductReactionCreated,
    onComment: onCommentReactionCreated,
    eventAction
  })
}