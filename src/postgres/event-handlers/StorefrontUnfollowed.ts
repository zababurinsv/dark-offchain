import { EventHandlerFn } from '../../substrate/types';
import { deleteNotificationsAboutStorefront } from '../deletes/deleteNotificationsAboutStorefront';
import { deleteStorefrontFollower } from '../deletes/deleteStorefrontFollower';

export const onStorefrontUnfollowed: EventHandlerFn = async (eventAction) => {
  const { data } = eventAction;
  const follower = data[0].toString();
  const following = data[1].toString();
  await deleteNotificationsAboutStorefront(follower, following)
  await deleteStorefrontFollower(data);
}
