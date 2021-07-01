/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { u64, Null, Enum, Option, Struct } from '@polkadot/types';
import { ProductId, ProductExtension as IProductExtension, Comment as IComment } from '../interfaces';
import registry from '../registry';

export class RegularProduct extends Null {}
export class SharedProduct extends u64 {}

type CommentType = {
  parent_id: Option<ProductId>,
  root_product_id: ProductId
}

export class Comment extends Struct implements IComment {
  constructor (value?: CommentType) {
    super(
      registry,
      {
        parent_id: 'Option<u64>',
        root_product_id: 'u64'
      },
      value
    );
  }

  get parent_id (): Option<ProductId> {
    return this.get('parent_id') as Option<ProductId>;
  }

  get root_product_id (): ProductId {
    return this.get('root_product_id') as ProductId;
  }
}

export type ProductExtensionEnum =
  RegularProduct |
  IComment |
  SharedProduct;

type ProductExtensionEnumValue =
  { RegularProduct: RegularProduct } |
  { SharedProduct: SharedProduct } |
  { Comment: IComment };

export class ProductExtension extends Enum implements IProductExtension {
  constructor (value?: ProductExtensionEnumValue) {
    super(
      registry,
      {
        RegularProduct,
        Comment: Comment as any,
        SharedProduct
      }, value);
  }

  get isComment (): boolean {
    return this.type === 'Comment'
  }

  get asComment (): Comment {
    return this.value as Comment;
  }

  get isRegularProduct (): boolean {
    return this.type === 'RegularProduct'
  }

  get isSharedProduct (): boolean {
    return this.type === 'SharedProduct'
  }

  get isSharedComment (): boolean {
    return this.type === 'SharedComment'
  }

  get asSharedProduct (): ProductId {
    return this.value as ProductId;
  }
}
