import { GenericEventData } from '@polkadot/types';
import { encodeStructId } from '../../substrate/utils';
import { newPgError, runQuery } from '../utils';
import { IQueryParams } from '../types/deleteStorefrontFollower.queries';

const query = `
  DELETE from df.storefront_followers
  WHERE follower_account = :followerAccount
    AND following_storefront_id = :followingStorefrontId
  RETURNING *`

export async function deleteStorefrontFollower (data: GenericEventData) {
  const storefrontId = encodeStructId(data[1].toString());
  const params = { followerAccount: data[0].toString(), followingStorefrontId: storefrontId };

  try {
    await runQuery<IQueryParams>(query, params)
  } catch (err) {
    throw newPgError(err, deleteStorefrontFollower)
  }
};