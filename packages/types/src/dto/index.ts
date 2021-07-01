import { Storefront, Product, Ordering, SocialAccount, Profile } from '../substrate/interfaces';
import { CommonContent, StorefrontContent, ProductContent, OrderingContent, CommentContent, ProfileContent } from '../offchain'
import { CommonStruct } from '../substrate';
import { AccountId } from '@polkadot/types/interfaces';

export type CommonData<S extends CommonStruct, C extends CommonContent> = {
  struct: S
  content?: C
}

export type SocialAccountWithId = SocialAccount &  {
  id: AccountId
}

export type StorefrontData = CommonData<Storefront, StorefrontContent>
export type ProductData = CommonData<Product, ProductContent>
export type CommentData = CommonData<Product, CommentContent>
export type OrderingData = CommonData<Ordering, OrderingContent>
export type ProfileData = CommonData<SocialAccountWithId, ProfileContent> & {
  profile?: Profile
}

export type AnyDarkdotData = StorefrontData | ProductData | CommentData | ProfileData | OrderingData;

export type ProductWithSomeDetails = {
  product: ProductData
  ext?: Exclude<ProductWithSomeDetails, 'ext'>
  owner?: ProfileData
  storefront?: StorefrontData
 // price?: ProductData.
}

export type ProductWithOwner = Exclude<ProductWithSomeDetails, 'owner'> & {
  owner: ProfileData
}

export type ProductWithStorefront = Exclude<ProductWithSomeDetails, 'storefront'> & {
  storefront: StorefrontData
}

export type ProductWithAllDetails = ProductWithOwner & ProductWithStorefront
