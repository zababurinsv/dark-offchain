import { ActivitiesParamsWithAccount } from '../queries/types';
import { fillTableWith } from './fillTableQueries';
import { encodeStructId } from '../../substrate/utils';
import { newPgError, runQuery } from '../utils';
import { updateCountOfUnreadNotifications } from '../updates/updateCountOfUnreadNotifications';
import { IQueryParams } from '../types/fillNotificationsWithProductFollowers.queries';

export async function fillNotificationsWithProductFollowers(productId: string, { account, blockNumber, eventIndex }: ActivitiesParamsWithAccount, productCreator: string) {
  const query = fillTableWith("notifications", "product")
  const encodedProductId = encodeStructId(productId);
  const encodedBlockNumber = encodeStructId(blockNumber.toString())
  const params = { productId: encodedProductId, account, blockNumber: encodedBlockNumber, eventIndex };

  try {
    await runQuery<IQueryParams>(query, params)
    await updateCountOfUnreadNotifications(productCreator ? productCreator : account)
  } catch (err) {
    throw newPgError(err, fillNotificationsWithProductFollowers)
  }
}