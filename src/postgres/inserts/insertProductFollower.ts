import { GenericEventData } from '@polkadot/types';
import { encodeStructId } from '../../substrate/utils';
import { newPgError, runQuery } from '../utils';
import { IQueryParams } from '../types/insertProductFollower.queries';

const query = `
  INSERT INTO df.product_followers(follower_account, following_product_id)
    VALUES(:followerAccount, :followingProductId)
  RETURNING *`

export async function insertProductFollower(data: GenericEventData) {
  const productId = encodeStructId(data[1].toString());
  const params = { followerAccount: data[0].toString(), followingProductId: productId };

  try {
    await runQuery<IQueryParams>(query, params)
  } catch (err) {
    throw newPgError(err, insertProductFollower)
  }
};