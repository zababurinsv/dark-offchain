/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Option, Enum, Struct, bool } from '@polkadot/types';
import { StorefrontId } from '../interfaces';
import registry from '../registry';
import { OptionContent } from './content';
// TODO add permissions
export type OrderingUpdateType = {
  ordering_state: OrderingState;
  content: OptionContent;
};

export class OrderingUpdate extends Struct {
  constructor (value?: OrderingUpdateType) {
    super(
      registry,
      {
        ordering_state: 'OrderingState',
        content: 'Option<Content>',
      },
      value
    );
  }

  get content (): OptionContent {
    return this.get('content') as OptionContent;
  }

  set content (value: OptionContent) {
    this.set('content', value);
  }
}


export declare const OrderingStates: {
  [key: string]: string;
};
export declare class OrderingState extends Enum {
 // constructor(value?: any);
}