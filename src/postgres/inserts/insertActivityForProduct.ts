import { SubstrateEvent } from '../../substrate/types';
import { InsertActivityPromise } from '../queries/types';
import { encodeStructIds, encodeStructId } from '../../substrate/utils';
import { isEmptyArray } from '@darkpay/dark-utils';
import { emptyParamsLogError } from '../postges-logger';
import { blockNumberToApproxDate } from '../../substrate/utils';
import { newPgError, runQuery, action } from '../utils';
import { getAggregationCount } from '../selects/getAggregationCount';
import { IQueryParams } from '../types/insertActivityForProduct.queries';

const query = `
  INSERT INTO df.activities(block_number, event_index, account, event, storefront_id, product_id, date, agg_count)
    VALUES(:blockNumber, :eventIndex, :account, :event, :storefrontId, :productId, :date, :aggCount)
  RETURNING *`

export async function insertActivityForProduct(eventAction: SubstrateEvent, ids: string[], count?: number): InsertActivityPromise {

  const paramsIds = encodeStructIds(ids)

  if (isEmptyArray(paramsIds)) {
    emptyParamsLogError('product')
    return undefined
  }

  const [storefrontId, productId] = paramsIds;
  const { eventName, data, blockNumber, eventIndex } = eventAction;
  const accountId = data[0].toString();
  const encodedBlockNumber = encodeStructId(blockNumber.toString())

  const date = await blockNumberToApproxDate(blockNumber)
  const newCount = eventName === 'ProductShared'
    ? await getAggregationCount({ eventName: eventName, account: accountId, product_id: productId })
    : count;

  const params = {
    blockNumber: encodedBlockNumber,
    eventIndex,
    account: accountId,
    event: eventName as action,
    storefrontId,
    productId,
    date,
    aggCount: newCount
  };

  try {
    await runQuery<IQueryParams>(query, params)
  } catch (err) {
    throw newPgError(err, insertActivityForProduct)
  }

  return { blockNumber, eventIndex }
};