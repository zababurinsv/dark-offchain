export type ElasticIndexTypes =
  'all' |
  'profiles' |
  'storefronts' |
  'products' |
  'orderings'

export type ElasticIndexName =
  'darkdot_profiles' |
  'darkdot_storefronts' |
  'darkdot_products' |
  'darkdot_orderings'

export type IElasticIndex = Record<string, ElasticIndexName>

export const ElasticIndex: IElasticIndex = {
  profiles: 'darkdot_profiles',
  storefronts: 'darkdot_storefronts',
  products: 'darkdot_products',
  orderings: 'darkdot_orderings',
}

export const AllElasticIndexes: ElasticIndexName[] = [
  ElasticIndex.profiles,
  ElasticIndex.storefronts,
  ElasticIndex.products,
  ElasticIndex.orderings
]

export const ElasticFields = {
  storefront: {
    name: 'name',
    handle: 'handle',
    about: 'about',
    tags: 'tags',
  },
  product: {
    title: 'title',
    body: 'body',
    tags: 'tags',
  },
  comment: {
    body: 'body',
  },
  profile: {
    name: 'name',
    about: 'about',
  },
  ordering: {
    orderingcontent_total: 'orderingcontent_total',
    orderingcontent_state: 'orderingcontent_state',
  },
}

export type ElasticQueryParams = {
  indexes?: ElasticIndexTypes[]
  q?: string
  tags?: string[]
  limit?: number
  offset?: number
}

export type ElasticStorefrontDoc = {
  name?: string;
  handle?: string;
  about?: string;
  tags?: string[];
}

export type ElasticProductDoc = {
  storefrontId?: string;
  title?: string;
  body?: string;
  tags?: string[];
}

export type ElasticProfileDoc = {
  name?: string;
  about?: string;
}

export type ElasticOrderingDoc = {
  orderingcontent_total?: string;
  orderingcontent_state?: string;
}