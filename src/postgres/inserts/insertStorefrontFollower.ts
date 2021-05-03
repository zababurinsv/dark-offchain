import { GenericEventData } from '@polkadot/types';
import { encodeStructId } from '../../substrate/utils';
import { newPgError, runQuery } from '../utils';
import { IQueryParams } from '../types/insertStorefrontFollower.queries';

const query = `
  INSERT INTO df.storefront_followers(follower_account, following_storefront_id)
    VALUES(:followerAccount, :followingStorefrontId)
  RETURNING *`

export async function insertStorefrontFollower(data: GenericEventData) {
  const storefrontId = encodeStructId(data[1].toString());
  const params = { followerAccount: data[0].toString(), followingStorefrontId: storefrontId };

  try {
    await runQuery<IQueryParams>(query, params)
  } catch (err) {
    throw newPgError(err, insertStorefrontFollower)
  }
};