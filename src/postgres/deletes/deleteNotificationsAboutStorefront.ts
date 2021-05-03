import { encodeStructId } from '../../substrate/utils';
import { newPgError, runQuery } from '../utils';
import { IQueryParams } from '../types/deleteNotificationsAboutStorefront.queries';

const query = `
  DELETE FROM df.notifications
  WHERE account = :account AND (block_number, event_index) IN (
    SELECT block_number, event_index
    FROM df.activities
    LEFT JOIN df.storefront_followers
      ON df.activities.storefront_id = df.storefront_followers.following_storefront_id
    WHERE storefront_id = :storefrontId
  )
  RETURNING *`

export async function deleteNotificationsAboutStorefront (userId: string, storefrontId: string) {
  const encodedStorefrontId = encodeStructId(storefrontId);
  const params = { account: userId, storefrontId: encodedStorefrontId };

  try {
    await runQuery<IQueryParams>(query, params)
  } catch (err) {
    throw newPgError(err, deleteNotificationsAboutStorefront)
  }
}