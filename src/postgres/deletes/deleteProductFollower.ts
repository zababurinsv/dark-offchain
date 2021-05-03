import { newPgError, runQuery } from '../utils';
import { encodeStructId } from '../../substrate/utils';
import { GenericEventData } from '@polkadot/types';
import { IQueryParams } from '../types/deleteProductFollower.queries';

const query = `
  DELETE from df.product_followers
  WHERE follower_account = :followerAccount
    AND following_product_id = :followingProductId
  RETURNING *`

export async function deleteProductFollower (data: GenericEventData) {
  const productId = encodeStructId(data[1].toString());
  const params = { followerAccount: data[0].toString(), followingProductId: productId };

  try {
    await runQuery<IQueryParams>(query, params)
  } catch (err) {
    throw newPgError(err, deleteProductFollower)
  }
};