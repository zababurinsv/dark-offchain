import { EventData } from '@polkadot/types/generic/Event';
import { pool } from '../../../adaptors/connectPostgre';
import { encodeStructId, InsertData } from '../utils';
import BN from 'bn.js';
import * as events from 'events'
import { Comment } from '@subsocial/types/substrate/interfaces/subsocial';
import { substrate } from '../../server';
import { getAggregationCount, insertNotificationForOwner } from './notifications';
export const eventEmitter = new events.EventEmitter();
export const EVENT_UPDATE_NOTIFICATIONS_COUNTER = 'eventUpdateNotificationsCounter'

type EventAction = {
  eventName: string,
  data: EventData,
  blockHeight: BN
}

export const insertActivityComments = async (eventAction: EventAction, ids: InsertData[], commentLast: Comment) => {
  let comment = commentLast;
  const lastCommentAccount = commentLast.created.account.toString();
  while (comment.parent_id.isSome) {
    const id = comment.parent_id.unwrap();
    const param = [ ...ids, id ];
    const parentComment = await substrate.findComment(id);

    if (parentComment) {
      comment = parentComment;
    }

    const account = comment.created.account.toString();
    const activityId = await insertActivityForComment(eventAction, param, account);

    if (account === lastCommentAccount) return;
    console.log('Parent id')
    await insertNotificationForOwner(activityId, account);
  }
};

export const insertActivityForComment = async (eventAction: EventAction, ids: InsertData[], creator: string): Promise<number> => {
  const paramsIds: string[] = new Array(3).fill(null);

  ids.forEach((id, index) => {
    paramsIds[index] = encodeStructId(id)
  });

  const [ postId ] = paramsIds;
  const { eventName, data, blockHeight } = eventAction;
  const accountId = data[0].toString();
  const aggregated = accountId !== creator;
  const query = `
      INSERT INTO df.activities(account, event, post_id, comment_id, parent_comment_id, block_height, agg_count,aggregated)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`
  const count = await getAggregationCount({ eventName: eventName, account: accountId, post_id: postId });
  const params = [ accountId, eventName, ...paramsIds, blockHeight, count, aggregated ];
  try {
    const res = await pool.query(query, params)
    const activityId = res.rows[0].id;
    console.log(res.rows[0]);
    const [ postId, , parentId ] = paramsIds;
    let parentEq = '';
    const paramsIdsUpd = [ postId ];
    if (!parentId) {
      parentEq += 'AND parent_comment_id IS NULL'
    } else {
      parentEq = 'AND parent_comment_id = $4';
      paramsIdsUpd.push(parentId);
    }
    const queryUpdate = `
        UPDATE df.activities
          SET aggregated = false
          WHERE id <> $1
            AND event = $2
            AND post_id = $3
            ${parentEq}
            AND aggregated = true
        RETURNING *`;
    console.log([ ...paramsIdsUpd ]);
    console.log([ paramsIds ]);
    console.log(parentId);
    console.log(parentEq);
    const paramsUpdate = [ activityId, eventName, ...paramsIdsUpd ];
    const resUpdate = await pool.query(queryUpdate, paramsUpdate);
    console.log(resUpdate.rowCount);

    return activityId;
  } catch (err) {
    console.log(err.stack);
    return -1;
  }
};

export const insertActivityForAccount = async (eventAction: EventAction, count: number): Promise<number> => {

  const { eventName, data, blockHeight } = eventAction;
  const accountId = data[0].toString();
  const objectId = data[1].toString();

  const query = `
      INSERT INTO df.activities(account, event, following_id, block_height, agg_count)
        VALUES($1, $2, $3, $4, $5)
      RETURNING *`
  const params = [ accountId, eventName, objectId, blockHeight, count ];
  try {
    const res = await pool.query(query, params)
    const activityId = res.rows[0].id;
    const queryUpdate = `
          UPDATE df.activities
            SET aggregated = false
            WHERE id <> $1
              AND event = $2
              AND aggregated = true
              AND following_id = $3
          RETURNING *`;

    const paramsUpdate = [ activityId, eventName, accountId ];
    const resUpdate = await pool.query(queryUpdate, paramsUpdate);
    console.log(resUpdate.rowCount);
    console.log(res.rows[0])
    return activityId;
  } catch (err) {
    console.log(err.stack);
    return -1;
  }
};

export const insertActivityForBlog = async (eventAction: EventAction, count: number, creator?: string): Promise<number> => {

  const { eventName, data, blockHeight } = eventAction;
  const accountId = data[0].toString();
  const blogId = data[1].toString();
  const aggregated = accountId !== creator;
  const query = `
      INSERT INTO df.activities(account, event, blog_id, block_height, agg_count, aggregated)
        VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *`
  const params = [ accountId, eventName, blogId, blockHeight, count, aggregated ];
  try {
    const res = await pool.query(query, params)
    const activityId = res.rows[0].id;
    const paramsUpdate = [ activityId, eventName, blogId ];
    const queryUpdate = `
          UPDATE df.activities
            SET aggregated = false
            WHERE id <> $1
              AND event = $2
              AND aggregated = true
              AND blog_id = $3
          RETURNING *`;

    const resUpdate = await pool.query(queryUpdate, paramsUpdate);
    console.log(resUpdate.rowCount);
    console.log(res.rows[0])
    return activityId;
  } catch (err) {
    console.log(err.stack);
    return -1;
  }
};

export const insertActivityForPost = async (eventAction: EventAction, ids: InsertData[], count?: number): Promise<number> => {
  const paramsIds: string[] = new Array(2);

  ids.forEach((id, index) => {
    paramsIds[index] = encodeStructId(id)
  });

  const [ , postId ] = paramsIds;
  const { eventName, data, blockHeight } = eventAction;
  const accountId = data[0].toString();
  const query = `
      INSERT INTO df.activities(account, event, blog_id, post_id, block_height, agg_count)
        VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *`
  const newCount = eventName === 'PostShared'
    ? await getAggregationCount({ eventName: eventName, account: accountId, post_id: postId })
    : count;

  const params = [ accountId, eventName, ...paramsIds, blockHeight, newCount ];
  try {
    const res = await pool.query(query, params)
    return res.rows[0].id;
  } catch (err) {
    console.log(err.stack);
    return -1;
  }
};

export const insertActivityForPostReaction = async (eventAction: EventAction, count: number, ids: InsertData[], creator: string): Promise<number> => {
  const paramsIds: string[] = new Array(1);

  ids.forEach((id, index) => {
    paramsIds[index] = encodeStructId(id)
  });

  const { eventName, data, blockHeight } = eventAction;
  const accountId = data[0].toString();
  const aggregated = accountId !== creator;
  const query = `
      INSERT INTO df.activities(account, event, post_id, block_height, agg_count,aggregated)
        VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *`
  const params = [ accountId, eventName, ...paramsIds, blockHeight, count, aggregated ];
  try {
    const res = await pool.query(query, params)
    const activityId = res.rows[0].id;
    console.log(res.rows[0]);
    const postId = paramsIds.pop();
    const queryUpdate = `
          UPDATE df.activities
            SET aggregated = false
            WHERE id <> $1
              AND event = $2
              AND aggregated = true
              AND post_id = $3
          RETURNING *`;

    const paramsUpdate = [ activityId, eventName, postId ];
    const resUpdate = await pool.query(queryUpdate, paramsUpdate);
    console.log(resUpdate.rowCount);

    return activityId;
  } catch (err) {
    console.log(err.stack);
    return -1;
  }
};

export const insertActivityForCommentReaction = async (eventAction: EventAction, count: number, ids: InsertData[], creator: string): Promise<number> => {
  const paramsIds: string[] = new Array(2);

  ids.forEach((id, index) => {
    paramsIds[index] = encodeStructId(id)
  });

  const { eventName, data, blockHeight } = eventAction;
  const accountId = data[0].toString();
  const aggregated = accountId !== creator;
  const query = `
      INSERT INTO df.activities(account, event, post_id, comment_id, block_height, agg_count,aggregated)
        VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`
  const params = [ accountId, eventName, ...paramsIds, blockHeight, count, aggregated ];
  try {
    const res = await pool.query(query, params)
    const activityId = res.rows[0].id;
    console.log(res.rows[0]);
    const queryUpdate = `
          UPDATE df.activities
            SET aggregated = false
            WHERE id <> $1
              AND event = $2
              AND aggregated = true
              AND post_id = $3
              AND comment_id = $4
          RETURNING *`;

    const paramsUpdate = [ activityId, eventName, ...paramsIds ];
    const resUpdate = await pool.query(queryUpdate, paramsUpdate);
    console.log(resUpdate.rowCount);

    return activityId;
  } catch (err) {
    console.log(err.stack);
    return -1;
  }
};