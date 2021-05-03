import { SubstrateEvent } from '../../substrate/types';
import { InsertActivityPromise } from '../queries/types';
import { encodeStructIds, encodeStructId } from '../../substrate/utils';
import { isEmptyArray } from '@darkpay/dark-utils';
import { emptyParamsLogError, updateCountLog } from '../postges-logger';
import { blockNumberToApproxDate } from '../../substrate/utils';
import { newPgError, runQuery, action } from '../utils';
import { IQueryParams, IQueryUpdateParams } from '../types/insertActivityForProductReaction.queries';

const query = `
  INSERT INTO df.activities(block_number, event_index, account, event, product_id, date, agg_count, aggregated)
    VALUES(:blockNumber, :eventIndex, :account, :event, :productId, :date, :aggCount, :aggregated)
  RETURNING *`

const queryUpdate = `
  UPDATE df.activities
  SET aggregated = false
  WHERE aggregated = true
    AND NOT (block_number = :blockNumber AND event_index = :eventIndex)
    AND event = :event
    AND product_id = :productId
  RETURNING *`;

export async function insertActivityForProductReaction(eventAction: SubstrateEvent, count: number, ids: string[], creator: string): InsertActivityPromise {
  const paramsIds = encodeStructIds(ids)

  if (isEmptyArray(paramsIds)) {
    emptyParamsLogError('product reaction')
    return undefined
  }

  const [productId] = paramsIds
  const { eventName, data, blockNumber, eventIndex } = eventAction;
  const accountId = data[0].toString();
  const aggregated = accountId !== creator;
  const encodedBlockNumber = encodeStructId(blockNumber.toString())

  const date = await blockNumberToApproxDate(blockNumber)
  const params = {
    blockNumber: encodedBlockNumber,
    eventIndex,
    account: accountId,
    event: eventName as action,
    productId,
    date,
    aggCount: count,
    aggregated
  };

  try {
    await runQuery<IQueryParams>(query, params)
    const productId = paramsIds.pop();

    const paramsUpdate  = { blockNumber: encodedBlockNumber, eventIndex, event: eventName as action, productId };
    const resUpdate = await runQuery<IQueryUpdateParams>(queryUpdate, paramsUpdate);
    updateCountLog(resUpdate.rowsCount)
  } catch (err) {
    throw newPgError(err, insertActivityForProductReaction)
  }

  return { blockNumber, eventIndex }
};