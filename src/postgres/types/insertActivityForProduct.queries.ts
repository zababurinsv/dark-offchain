/** Types generated for queries found in "s../postgres/inserts/insertActivityForProduct.ts" */
import { action } from '../utils';
import { Dayjs } from 'dayjs'

/** 'Query' parameters type */
export interface IQueryParams {
  blockNumber: bigint | null | void;
  eventIndex: number | null | void;
  account: string | null | void;
  event: action | null | void;
  storefrontId: bigint | null | void;
  productId: bigint | null | void;
  date: Dayjs | null | void;
  aggCount: number | null | void;
}