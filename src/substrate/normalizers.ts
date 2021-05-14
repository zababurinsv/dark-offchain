import { Option } from '@polkadot/types/codec'
import { AccountId } from '@polkadot/types/interfaces/runtime'
import { bool } from '@polkadot/types/primitive'
import { AnyAccountId, ProductContent, ProfileContent, StorefrontContent, OrderingContent } from '@darkpay/dark-types'
import { Content, Storefront, Product, WhoAndWhen, SocialAccount, Ordering } from '@darkpay/dark-types/substrate/interfaces'
import { isEmptyArray } from '@darkpay/dark-utils'
import BN from 'bn.js'

export type Id = string

type Cid = string

export type HasId = {
  id: Id
}

type CanHaveContent = {
  contentId?: Cid
}

type HasOwner = {
  owner: string
}

type HasCreated = {
  createdByAccount: string
  createdAtBlock: number
  createdAtTime: number
}

type CanBeUpdated = {
  isUpdated: boolean
  updatedByAccount?: string
  updatedAtBlock?: number
  updatedAtTime?: number
}

type CanBeHidden = {
  isHidden: boolean
  // isPublic: boolean
}

export type NormalizedSuperCommon =
  HasCreated &
  CanBeUpdated &
  CanHaveContent

type NormalizedStorefrontOrProduct =
  NormalizedSuperCommon &
  HasId &
  HasOwner &
  CanBeHidden

  type NormalizedOrderingWithId =
  NormalizedSuperCommon &
  HasId


  export type NormalizedOrdering = NormalizedOrderingWithId & {
    seller: AccountId
    ordering_total: number
    ordering_state: string
    buyer_escrow: number
    seller_escrow: number
    storefront_id: Id
    product_id: Id
    // permissions?: OrderingPermissions
    // ordering_state ?
  }


export type NormalizedStorefront = NormalizedStorefrontOrProduct & {
  parentId?: Id
  handle?: string
  totalProductsCount: number
  hiddenProductsCount: number
  visibleProductsCount: number
  followersCount: number
  score: number
  // permissions?: StorefrontPermissions
}

export type NormalizedProduct = NormalizedStorefrontOrProduct & {
  storefrontId?: Id
  // extension: ProductExtension,
  totalRepliesCount: number
  hiddenRepliesCount: number
  visibleRepliesCount: number
  sharesCount: number
  upvotesCount: number
  downvotesCount: number
  score: number
  isRegularProduct: boolean
  isSharedProduct: boolean
  isComment: boolean
  price: number
}

type NormalizedSocialAccount = HasId & {
  followersCount: number
  followingAccountsCount: number
  followingStorefrontsCount: number
  reputation: number
  hasProfile: boolean
}

type CommentExtension = {
  parentId?: Id
  rootProductId: Id
}

type SharedProductExtension = {
  sharedProductId: Id
}

type NormalizedProductExtension = {} | CommentExtension | SharedProductExtension

type NormalizedSharedProduct = NormalizedProduct & SharedProductExtension

export type NormalizedComment = NormalizedProduct & CommentExtension

export type NormalizedProfile =
  NormalizedSocialAccount &
  Partial<NormalizedSuperCommon>

export type StorefrontWithContent = NormalizedStorefront & StorefrontContent
export type ProductWithContent = NormalizedProduct & ProductContent
export type ProfileWithContent = NormalizedProfile & ProfileContent
export type OrderingWithContent = NormalizedOrdering & OrderingContent

type SuperCommonStruct = {
  created: WhoAndWhen
  updated: Option<WhoAndWhen>
  content: Content
}

type StorefrontOrProductStruct = SuperCommonStruct & {
  id: BN
  owner: AccountId
  hidden: bool
}

// type OrderingStruct = SuperCommonStruct & {
//   id: BN
//   owner: AccountId
// }

export function getContentIds(entities: CanHaveContent[]): Cid[] {
  if (isEmptyArray(entities)) {
    return []
  }

  const cids: Cid[] = []
  entities.forEach(({ contentId }) => {
    if (contentId) {
      cids.push(contentId)
    }
  })
  return cids
}

function normalizeSuperCommonStruct(struct: SuperCommonStruct): NormalizedSuperCommon {
  const { created, updated } = struct

  const maybeUpdated = updated.unwrapOr(undefined)
  const maybeContentId = struct.content.isIpfs ? struct.content.asIpfs.toString() : undefined

  return {
    // created:
    createdByAccount: created.account.toString(),
    createdAtBlock: created.block.toNumber(),
    createdAtTime: created.time.toNumber(),

    // updated:
    isUpdated: updated.isSome,
    updatedByAccount: maybeUpdated?.account.toString(),
    updatedAtBlock: maybeUpdated?.block.toNumber(),
    updatedAtTime: maybeUpdated?.time.toNumber(),

    contentId: maybeContentId,
  }
}

function normalizeStorefrontOrProductStruct(struct: StorefrontOrProductStruct): NormalizedStorefrontOrProduct {
  return {
    ...normalizeSuperCommonStruct(struct),
    id: struct.id.toString(),
    owner: struct.owner.toString(),
    isHidden: struct.hidden.isTrue,
  }
}

export function normalizeStorefrontStruct(struct: Storefront): NormalizedStorefront {
  const totalProductsCount = struct.products_count.toNumber()
  const hiddenProductsCount = struct.hidden_products_count.toNumber()
  const visibleProductsCount = totalProductsCount - hiddenProductsCount

  return {
    ...normalizeStorefrontOrProductStruct(struct),
    parentId: struct.parent_id.unwrapOr(undefined)?.toString(),
    handle: struct.handle.unwrapOr(undefined)?.toString(),
    totalProductsCount,
    hiddenProductsCount,
    visibleProductsCount,
    followersCount: struct.followers_count.toNumber(),
    score: struct.score.toNumber(),
  }
}

export function normalizeStorefrontStructs(structs: Storefront[]): NormalizedStorefront[] {
  return structs.map(normalizeStorefrontStruct)
}

export function normalizeProductStruct(struct: Product): NormalizedProduct {
  const totalRepliesCount = parseInt(struct.replies_count.toString())
  const hiddenRepliesCount = parseInt(struct.hidden_replies_count.toString())
  const visibleRepliesCount = totalRepliesCount - hiddenRepliesCount
  const { isRegularProduct, isSharedProduct, isComment } = struct.extension

  let normExt: NormalizedProductExtension = {}
  if (isSharedProduct) {
    normExt = { sharedProductId: struct.extension.asSharedProduct.toString() }
  }
  else if (isComment) {
    const { parent_id, root_product_id } = struct.extension.asComment
    normExt = {
      parentId: parent_id.unwrapOr(undefined)?.toString(),
      rootProductId: root_product_id.toString()
    } as CommentExtension
  }

  return {
    ...normalizeStorefrontOrProductStruct(struct),
    storefrontId: struct.storefront_id.unwrapOr(undefined)?.toString(),

    totalRepliesCount,
    hiddenRepliesCount,
    visibleRepliesCount,

    sharesCount: parseInt(struct.shares_count.toString()),
    upvotesCount: parseInt(struct.upvotes_count.toString()),
    downvotesCount: parseInt(struct.downvotes_count.toString()),
    score: parseInt(struct.score.toString()),
    price: parseInt(struct.price.toString()),
    isRegularProduct,
    isSharedProduct,
    isComment,

    ...normExt
  }
}

export function normalizeProductStructs(structs: Product[]): NormalizedProduct[] {
  return structs.map(normalizeProductStruct)
}

export function asNormalizedSharedProduct(product: NormalizedProduct): NormalizedSharedProduct {
  if (!product.isSharedProduct) throw new Error('Not a shared product')

  return product as NormalizedSharedProduct
}

export function asNormalizedComment(product: NormalizedProduct): NormalizedComment {
  if (!product.isComment) throw new Error('Not a comment')

  return product as NormalizedComment
}

export function normalizeProfileStruct(account: AnyAccountId, struct: SocialAccount): NormalizedProfile {
  const profile = struct.profile.unwrapOr(undefined)
  const hasProfile = struct.profile.isSome
  const maybeProfile: Partial<NormalizedSuperCommon> = profile
    ? normalizeSuperCommonStruct(profile)
    : {}

  return {
    id: account.toString(),
    followersCount: struct.followers_count.toNumber(),
    followingAccountsCount: struct.following_accounts_count.toNumber(),
    followingStorefrontsCount: struct.following_storefronts_count.toNumber(),
    reputation: struct.reputation.toNumber(),
    hasProfile,
    ...maybeProfile
  }
}


export function normalizeOrderingStruct(struct: Ordering): NormalizedOrdering {
  // const totalProductsCount = struct.products_count.toNumber()
  // const hiddenProductsCount = struct.hidden_products_count.toNumber()
  // const visibleProductsCount = totalProductsCount - hiddenProductsCount
  const seller = struct.seller
  const ordering_total = struct.ordering_total.toNumber()
  const ordering_state = struct.seller.toString()
  const buyer_escrow = struct.buyer_escrow.toNumber()
  const seller_escrow = struct.seller_escrow.toNumber()
  const storefront_id = struct.storefront_id.toString()
  const product_id = struct.product_id.toString()

  return {
    ...normalizeOrderingStruct(struct),
    seller,
    ordering_total,
    ordering_state,
    buyer_escrow,
    seller_escrow,
    storefront_id,
    product_id
  }
}

export function normalizeOrderingStructs(structs: Ordering[]): NormalizedOrdering[] {
  return structs.map(normalizeOrderingStruct)
}



// export function normalizeProfileStructs (structs: Profile[]): NormalizedProfile[] {
//   return structs.map(normalizeProfileStruct)
// }

// const productsAdapter = createEntityAdapter<NormalizedProduct>()

// const profilesAdapter = createEntityAdapter<NormalizedProfile>()
