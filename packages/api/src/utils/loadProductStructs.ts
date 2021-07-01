import { AnyAccountId, AnyProductId, AnyStorefrontId } from '@darkpay/dark-types/substrate/interfaces/utils';
import { ProductData, ProductWithSomeDetails, ProfileData, StorefrontData } from '@darkpay/dark-types'
import { ProductId, StorefrontId } from '@darkpay/dark-types/substrate/interfaces'
import { getProductIdFromExtension } from './common'
import { nonEmptyStr, notDefined, isDefined } from '@darkpay/dark-utils'
import { ProductDetailsOpts } from './types';
import { isVisible } from './visibility-filter';
import { AccountId } from '@polkadot/types/interfaces'

export type FindStructsFns = {
  findProducts: (ids: AnyProductId[]) => Promise<ProductData[]>,
  findStorefronts: (ids: AnyStorefrontId[]) => Promise<StorefrontData[]>
  findProfiles: (ids: AnyAccountId[]) => Promise<ProfileData[]>
}

async function loadRelatedStructs (products: ProductData[], finders: FindStructsFns, opts?: ProductDetailsOpts) {
  const { withStorefront, withOwner } = opts || {}
  const { findStorefronts, findProducts, findProfiles } = finders

  const ownerByIdMap = new Map<string, ProfileData>()
  const storefrontByIdMap = new Map<string, StorefrontData>()
  const productByIdMap = new Map<string, ProductData>()
  products.forEach(x => productByIdMap.set(x.struct.id.toString(), x))

  const productStructs: ProductWithSomeDetails[] = []
  const extProductStructs: ProductWithSomeDetails[] = []

  const rootProducts: ProductData[] = []
  const extProducts: ProductData[] = []

  const rootIds: ProductId[] = []
  const extIds: ProductId[] = []
  const ownerIds: AccountId[] = []
  const storefrontIds: StorefrontId[] = []

  // Key - serialized id of root product of comment.
  // Value - indices of the products that have this root product in `extProductStructs` array.
  const productIndicesByRootIdMap = new Map<string, number[]>()
  // Key - serialized id of a shared original product or root product of a comment.
  // Value - indices of the products that share this original product or comments that are replies to root product in productStructs array.
  const productIndicesByExtIdMap = new Map<string, number[]>()
  // Key - serialized id of a product owner.
  // Value - indices of the products that have the same owner (as key) in `products` array.
  const productIndicesByOwnerIdMap = new Map<string, number[]>()
  // Key - serialized id of a storefront.
  // Value - indices of the products that have the same storefront (as key) in `products` array.
  const productIndicesByStorefrontIdMap = new Map<string, number[]>()

  // Product id can be either extension or root product
  const rememberProductIdAndMapToProductIndices = (product: ProductData, productIndex: number, resultIndicesByProductIdMap: Map<string, number[]>, products: ProductData[], productIds: ProductId[]) => {
    const extId = getProductIdFromExtension(product)
    const extIdStr = extId?.toString()
    if (extId && nonEmptyStr(extIdStr)) {
      let productIdxs = resultIndicesByProductIdMap.get(extIdStr)
      if (notDefined(productIdxs)) {
        productIdxs = []
        resultIndicesByProductIdMap.set(extIdStr, productIdxs)
        const currentProduct = productByIdMap.get(extIdStr)
        if (currentProduct) {
          products.push(currentProduct)
        } else {
          productIds.push(extId)
        }
      }
      productIdxs.push(productIndex)
    }
  }

  // Related id can be either storefront id or owner id
  function rememberRelatedIdAndMapToProductIndices<T extends StorefrontId | AccountId> (relatedId: T, productIndex: number, productIndicesByRelatedIdMap: Map<string, number[]>, relatedIds: T[]) {
    if (isDefined(relatedId)) {
      const idStr = relatedId.toString()
      let productIdxs = productIndicesByRelatedIdMap.get(idStr)
      if (notDefined(productIdxs)) {
        productIdxs = []
        productIndicesByOwnerIdMap.set(idStr, productIdxs)
        relatedIds.push(relatedId)
      }
      productIdxs.push(productIndex)
    }
  }

  function setExtOnProduct (ext: ProductWithSomeDetails, resultIndicesByProductIdMap: Map<string, number[]>, productStructs: ProductWithSomeDetails[]) {
    const extId = ext.product.struct.id.toString()
    productByIdMap.set(extId, ext.product)
    const idxs = resultIndicesByProductIdMap.get(extId) || []
    idxs.forEach(idx => {
      productStructs[idx].ext = ext
    })
  }

  products.forEach((product, i) => {
    productStructs.push({ product })

    rememberProductIdAndMapToProductIndices(product, i, productIndicesByExtIdMap, extProducts, extIds)

    if (withOwner) {
      const ownerId = product.struct.created.account
      rememberRelatedIdAndMapToProductIndices(ownerId, i, productIndicesByOwnerIdMap, ownerIds)
    }

    if (withStorefront) {
      const storefrontId = product.struct.storefront_id.unwrapOr(undefined)
      storefrontId && rememberRelatedIdAndMapToProductIndices(storefrontId, i, productIndicesByStorefrontIdMap, storefrontIds)
    }
  })

  const loadedExtProducts = await findProducts(extIds)
  extProducts.push(...loadedExtProducts)

  extProducts.forEach((product, i) => {
    extProductStructs.push({ product })
    setExtOnProduct(extProductStructs[i], productIndicesByExtIdMap, productStructs)

    if (withOwner) {
      const ownerId = product.struct.created.account
      ownerIds.push(ownerId)
    }

    if (withStorefront) {
      const storefrontId = product.struct.storefront_id.unwrapOr(undefined)
      if (isDefined(storefrontId)) {
        storefrontIds.push(storefrontId)
      } else {
        rememberProductIdAndMapToProductIndices(product, i, productIndicesByRootIdMap, rootProducts, rootIds)
      }
    }
  })

  const loadedRootProducts = await findProducts(rootIds)
  rootProducts.push(...loadedRootProducts)

  rootProducts.forEach((product, i) => {
    setExtOnProduct({ product }, productIndicesByRootIdMap, extProductStructs)

    if (withStorefront) {
      const storefrontId = product.struct.storefront_id.unwrapOr(undefined)
      storefrontId && rememberRelatedIdAndMapToProductIndices(storefrontId, i, productIndicesByStorefrontIdMap, storefrontIds)
    }
  })

  // Load related owners
  if (withOwner) {
    const owners = await findProfiles(ownerIds)

    owners.forEach(owner => {
      const ownerId = owner.profile?.created.account.toString()
      ownerId && ownerByIdMap.set(ownerId, owner)
    })
  }

  // Load related storefronts
  if (withStorefront) {
    const storefronts = await findStorefronts(storefrontIds)

    storefronts.forEach(storefront => {
      const storefrontId = storefront.struct.id.toString()
      storefrontId && storefrontByIdMap.set(storefrontId, storefront)
    })
  }

  return {
    productStructs,
    storefrontByIdMap,
    ownerByIdMap
  }
}

/** Load product structs and related structs like owner profile, storefront, root product if required. */
export async function loadAndSetProductRelatedStructs (products: ProductData[], finders: FindStructsFns, opts?: ProductDetailsOpts): Promise<ProductWithSomeDetails[]> {
  const { withStorefront, withOwner, visibility } = opts || {}
  const {
    storefrontByIdMap,
    ownerByIdMap,
    productStructs
  } = await loadRelatedStructs(products, finders, opts)

  const setOwnerOnProduct = (productStruct: ProductWithSomeDetails) => {
    if (!withOwner) return

    const { product, ext } = productStruct
    const ownerId = product.struct.created.account.toString()
    const owner = ownerByIdMap.get(ownerId)
    productStruct.owner = owner

    if (!ext) return

    const extOwnerId = ext.product.struct.created.account.toString()
    ext.owner = extOwnerId === ownerId
      ? owner
      : ownerByIdMap.get(extOwnerId)
  }

  const setStorefrontOnProduct = (product: ProductWithSomeDetails, storefrontId?: StorefrontId, ext?: ProductWithSomeDetails) => {
    if (!withStorefront || !storefrontId) return

    const storefront = storefrontByIdMap.get(storefrontId.toString())
    if (!product.storefront) {
      product.storefront = storefront
    }

    if (ext) {
      ext.storefront = storefront
    }
  }

  productStructs.forEach(product => {
    const { product: { struct: { storefront_id } }, ext } = product
    setOwnerOnProduct(product)

    // Set a storefront if the product has storefront id:
    setStorefrontOnProduct(product, storefront_id.unwrapOr(undefined))

    // Set a storefront (from extension) on product and its extension if extension has storefront id:
    const storefrontId = ext?.product.struct.storefront_id.unwrapOr(undefined)
    setStorefrontOnProduct(product, storefrontId, ext)

    if (!storefrontId) {
      // Set a storefront (from root product) on product and its extension if extension does NOT have storefront id:
      const storefrontId = ext?.ext?.product.struct.storefront_id.unwrapOr(undefined)
      setStorefrontOnProduct(product, storefrontId, ext)
    }
  })

  return withStorefront && visibility === 'onlyVisible' ? productStructs.filter(({ storefront }) => isVisible(storefront?.struct)) : productStructs
}
