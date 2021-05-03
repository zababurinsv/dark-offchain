import { ActivitiesParamsWithAccount } from '../queries/types';
import { fillTableWith } from './fillTableQueries';
import { encodeStructId } from '../../substrate/utils';
import { newPgError, runQuery } from '../utils';
import { updateCountOfUnreadNotifications } from '../updates/updateCountOfUnreadNotifications';
import { IQueryParams } from '../types/fillNewsFeedWithStorefrontFollowers.queries';

export async function fillNewsFeedWithStorefrontFollowers(storefrontId: string, { account, blockNumber, eventIndex }: ActivitiesParamsWithAccount) {
  const query = fillTableWith("news_feed", "storefront")
  const encodedStorefrontId = encodeStructId(storefrontId);
  const encodedBlockNumber = encodeStructId(blockNumber.toString())
  const params = { storefrontId: encodedStorefrontId, account, blockNumber: encodedBlockNumber, eventIndex };

  try {
    await runQuery<IQueryParams>(query, params)
    await updateCountOfUnreadNotifications(account)
  } catch (err) {
    throw newPgError(err, fillNewsFeedWithStorefrontFollowers)
  }
}