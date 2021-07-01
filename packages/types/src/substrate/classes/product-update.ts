/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Option, Struct, bool, u32 } from '@polkadot/types';
import { StorefrontId } from '../interfaces';
import registry from '../registry';
import { OptionContent } from './content';
// TODO add permissions
export type ProductUpdateType = {
  storefront_id: Option<StorefrontId>;
  price: Option<u32>
  content: OptionContent;
  hidden: Option<bool>
};

export class ProductUpdate extends Struct {
  constructor (value?: ProductUpdateType) {
    super(
      registry,
      {
        storefront_id: 'Option<u64>',
        price: 'Option<u32>',
        content: 'Option<Content>',
        hidden: 'Option<bool>'
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
