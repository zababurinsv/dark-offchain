import { newPgError, runQuery } from '../utils';
import { encodeStructId } from '../../substrate/utils';
import { IQueryParams } from '../types/deleteNotificationsAboutProduct.queries';

const query = `
  DELETE FROM df.notifications
  WHERE account = :account AND (block_number, event_index) IN (
    SELECT block_number, event_index
    FROM df.activities
    LEFT JOIN df.product_followers
      ON df.activities.product_id = df.product_followers.following_product_id
    WHERE product_id = :productId
  )
  RETURNING *`

export async function deleteNotificationsAboutProduct (userId: string, productId: string) {
  const encodedProductId = encodeStructId(productId);
  const params = { account: userId, productId: encodedProductId };

  try {
    await runQuery<IQueryParams>(query, params)
  } catch (err) {
    throw newPgError(err, deleteNotificationsAboutProduct)
  }
}