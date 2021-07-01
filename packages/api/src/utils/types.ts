import { AnyProductId, AnyStorefrontId, AnyOrderingId } from '@darkpay/dark-types'

export type HttpRequestMethod = 'post' | 'get'

export type UseServerProps = {
  httpRequestMethod: HttpRequestMethod
}

export type DarkdotContext = {
  useServer?: UseServerProps
}

export type Visibility = 'onlyVisible' | 'onlyHidden' | 'onlyPublic' | 'onlyUnlisted'

export type VisibilityFilter = {
  visibility?: Visibility
}

export type OrderingsVisibility = 'onlyNew' | 'onlyAccepted' | 'onlyShipped' | 'onlyComplete'

export type OrderingsVisibilityFilter = {
  Orderingsvisibility?: OrderingsVisibility
}

export type ContentFilter = {
  withContentOnly?: boolean
}

export type Filters = VisibilityFilter & ContentFilter

export type ProductDetailsOpts = VisibilityFilter & {
  withStorefront?: boolean
  withOwner?: boolean
}

export type OrderingDetailsOpts = VisibilityFilter & {
  withStorefront?: boolean
  withOwner?: boolean
}

type IdsFilter<Id> = {
  ids: Id[]
}

type IdFilter<Id> = {
  id: Id
}

export type FindStructs<Id> = IdsFilter<Id> & Filters
export type FindStruct<Id> = IdFilter<Id> & Filters

export type FindOrders<Id> = IdsFilter<Id> 
export type FindOrder<Id> = IdFilter<Id>

export type FindProductsQuery = FindStructs<AnyProductId>
export type FindStorefrontsQuery = FindStructs<AnyStorefrontId>
export type FindProductQuery = FindStruct<AnyProductId>
export type FindStorefrontQuery = FindStruct<AnyStorefrontId>

export type FindOrderingQuery = FindOrder<AnyOrderingId>
export type FindOrderingsQuery = FindOrders<AnyOrderingId>

export type FindProductsWithDetailsQuery = FindProductsQuery & ProductDetailsOpts
export type FindProductWithDetailsQuery = FindProductQuery & ProductDetailsOpts

export type FindOrderingsWithDetailsQuery = FindOrderingsQuery & OrderingDetailsOpts
export type FindOrderingWithDetailsQuery = FindOrderingQuery & OrderingDetailsOpts

type CidAsStr = string

export type ContentResult<T> = Record<CidAsStr, T>
