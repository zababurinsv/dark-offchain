import { encodeStructId } from '../../substrate/utils';
import { newPgError, runQuery } from '../utils';
import { IQueryParams } from '../types/deleteNotificationsAboutOrdering.queries';

const query = `
  DELETE FROM df.notifications
  WHERE account = :account AND (block_number, event_index) IN (
    SELECT block_number, event_index
    FROM df.activities
    LEFT JOIN df.ordering_followers
      ON df.activities.ordering_id = df.ordering_followers.following_ordering_id
    WHERE ordering_id = :orderingId
  )
  RETURNING *`

export async function deleteNotificationsAboutOrdering (userId: string, orderingId: string) {
  const encodedOrderingId = encodeStructId(orderingId);
  const params = { account: userId, orderingId: encodedOrderingId };

  try {
    await runQuery<IQueryParams>(query, params)
  } catch (err) {
    throw newPgError(err, deleteNotificationsAboutOrdering)
  }
}