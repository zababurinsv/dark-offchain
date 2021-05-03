import { EventHandlerFn } from '../../substrate/types';
import { parseProductEvent } from '../../substrate/utils';
import { deleteNotificationsAboutProduct } from '../deletes/deleteNotificationsAboutProduct';
import { deleteProductFollower } from '../deletes/deleteProductFollower';

export const onRootProductDeleted: EventHandlerFn = async (eventAction) => {
  const { author, productId } = parseProductEvent(eventAction)

  await deleteNotificationsAboutProduct(author, productId);
  await deleteProductFollower(eventAction.data);
}
