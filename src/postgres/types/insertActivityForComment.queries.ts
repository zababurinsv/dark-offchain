/** Types generated for queries found in "s../postgres/inserts/insertActivityForComment.ts" */
import { action } from '../utils';
import { Dayjs } from 'dayjs'

/** 'Query' parameters type */
export interface IQueryParams {
  blockNumber: bigint | null | void;
  eventIndex: number | null | void;
  account: string | null | void;
  event: action | null | void;
  productId: bigint | null | void;
  commentId: bigint | null | void;
  parentCommentId: bigint | null | void;
  date: Dayjs | null | void;
  aggCount: number | null | void;
  aggregated: boolean | null | void;
}

/** 'QueryUpdateIfParentId' parameters type */
export interface IQueryUpdateParams {
  blockNumber: bigint | null | void;
  eventIndex: number | null | void;
  event: action | null | void;
  productId: bigint | null | void;
  parentCommentId: bigint | null | void;
}