import { SubstrateEvent } from '../../substrate/types';
import { emptyParamsLogError, updateCountLog } from '../postges-logger';
import { encodeStructIds, encodeStructId } from '../../substrate/utils';
import { isEmptyArray } from '@darkpay/dark-utils';
import { InsertActivityPromise } from '../queries/types';
import { blockNumberToApproxDate } from '../../substrate/utils';
import { newPgError, runQuery, action } from '../utils';
import { getAggregationCount } from '../selects/getAggregationCount';
import { IQueryParams, IQueryUpdateParams } from '../types/insertActivityForComment.queries';

const query = `
  INSERT INTO df.activities(block_number, event_index, account, event, product_id, comment_id, parent_comment_id, date, agg_count, aggregated)
    VALUES(:blockNumber, :eventIndex, :account, :event, :productId, :commentId, :parentCommentId, :date, :aggCount, :aggregated)
  RETURNING *`

  const buildQueryUpdate = (parentEq?: string) => `
  UPDATE df.activities
  SET aggregated = false
  WHERE aggregated = true
    AND NOT (block_number = :blockNumber AND event_index = :eventIndex)
    AND event = :event
    AND product_id = :productId
    ${parentEq}
  RETURNING *`;

export async function insertActivityForComment(eventAction: SubstrateEvent, ids: string[], creator: string): InsertActivityPromise {

  const paramsIds = encodeStructIds(ids)

  if (isEmptyArray(paramsIds)) {
    emptyParamsLogError('comment')
    return undefined
  }

  if (paramsIds.length !== 3) {
    paramsIds.push(null);
  }

  const [productId, commentId, parentCommentId] = paramsIds;
  const { eventName, data, blockNumber, eventIndex } = eventAction;
  const accountId = data[0].toString();
  const aggregated = accountId !== creator;

  const date = await blockNumberToApproxDate(blockNumber)
  const count = await getAggregationCount({ eventName: eventName, account: accountId, product_id: productId });
  const encodedBlockNumber = encodeStructId(blockNumber.toString())
  const params: IQueryParams = {
    blockNumber: encodedBlockNumber,
    eventIndex,
    account: accountId,
    event: eventName as action,
    productId,
    commentId,
    parentCommentId,
    date,
    aggCount: count,
    aggregated
  };

  try {
    await runQuery<IQueryParams>(query, params)

    const [productId, , parentId] = paramsIds;
    let parentEq = '';
    const paramsIdsUpd = [productId];
    if (!parentId) {
      parentEq += 'AND parent_comment_id IS NULL'
    } else {
      parentEq = 'AND parent_comment_id = :parentCommentId';
      paramsIdsUpd.push(parentId);
    }
    const [productIdUpd, parentIdUpd] = paramsIdsUpd

    const paramsUpdate = {
      blockNumber: encodedBlockNumber,
      eventIndex,
      event: eventName as action,
      productId: productIdUpd,
      parentCommentId: parentIdUpd
    }

    const resUpdate = await runQuery<IQueryUpdateParams>(buildQueryUpdate(parentEq), paramsUpdate);
    updateCountLog(resUpdate.rowsCount)
  } catch (err) {
    throw newPgError(err, insertActivityForComment)
  }

  return { blockNumber, eventIndex }
};