
import { AccountId } from '@polkadot/types/interfaces'
import { ProductContent, ProfileContent, StorefrontContent, OrderingContent } from '@darkpay/dark-types/offchain'
import { ElasticIndex, ElasticIndexName, ElasticProductDoc, ElasticProfileDoc, ElasticStorefrontDoc, ElasticOrderingDoc } from '@darkpay/dark-types/offchain/search'
import { Product, ProductId, Profile, Storefront, StorefrontId, Ordering, OrderingId } from '@darkpay/dark-types/substrate/interfaces'
import { isEmptyObj } from '@darkpay/dark-utils'
import { resolveDarkdotApi } from '../connections'
import { elasticIndexer } from '../connections/elastic'
import { getContentFromIpfs } from '../ipfs'
import { stringifyOption } from '../substrate/utils'

async function getProfileDoc(profile: Profile): Promise<ElasticProfileDoc | undefined> {
  const content = await getContentFromIpfs<ProfileContent>(profile)
  if (!content) return undefined

  const { name, about } = content
  return {
    name,
    about,
  }
}

async function getOrderingDoc(ordering: Ordering): Promise<ElasticOrderingDoc | undefined> {
  const content = await getContentFromIpfs<OrderingContent>(ordering)
  if (!content) return undefined

  const { orderingcontent_total, orderingcontent_state } = content
 // const handle = stringifyOption(ordering.handle)

  return {
    orderingcontent_total, 
    orderingcontent_state
  }
}

async function getStorefrontDoc(storefront: Storefront): Promise<ElasticStorefrontDoc | undefined> {
  const content = await getContentFromIpfs<StorefrontContent>(storefront)
  if (!content) return undefined

  const { name, about, tags } = content
  const handle = stringifyOption(storefront.handle)

  return {
    name,
    handle,
    about,
    tags,
  }
}

async function getProductDoc(product: Product): Promise<ElasticProductDoc | undefined> {
  const content = await getContentFromIpfs<ProductContent>(product)
  if (!content) return undefined

  const { substrate } = await resolveDarkdotApi()
  const { storefront_id, extension } = product
  const { title, body, tags } = content

  let storefrontId: string

  if (extension.isComment) {
    const rootProductId = extension.asComment.root_product_id
    const rootProduct = await substrate.findProduct({ id: rootProductId })
    storefrontId = stringifyOption(rootProduct.storefront_id)
  } else {
    storefrontId = stringifyOption(storefront_id)
  }

  return {
    storefrontId,
    title,
    body,
    tags,
  }
}

type AnyElasticDoc =
  ElasticProfileDoc |
  ElasticStorefrontDoc |
  ElasticProductDoc |
  ElasticOrderingDoc

type IndexContentProps = {
  index: ElasticIndexName
  id: AccountId | StorefrontId | ProductId | OrderingId
  doc: AnyElasticDoc
}

async function indexContent({ index, id, doc }: IndexContentProps) {
  if (isEmptyObj(doc)) return undefined

  return elasticIndexer.index({
    index,
    id: id?.toString(),
    body: doc
  })
}

export async function indexProfileContent(profile: Profile) {
  return indexContent({
    index: ElasticIndex.profiles,
    id: profile.created.account,
    doc: await getProfileDoc(profile)
  })
}

export async function indexStorefrontContent(storefront: Storefront) {
  return indexContent({
    index: ElasticIndex.storefronts,
    id: storefront.id,
    doc: await getStorefrontDoc(storefront)
  })
}

export async function indexProductContent(product: Product) {
  return indexContent({
    index: ElasticIndex.products,
    id: product.id,
    doc: await getProductDoc(product)
  })
}

export async function indexOrderingContent(ordering: Ordering) {
  return indexContent({
    index: ElasticIndex.orderings,
    id: ordering.id,
    doc: await getOrderingDoc(ordering)
  })
}