import { StorefrontId, ProductId, OrderingId } from '@darkpay/dark-types/substrate/interfaces';
import { readFileSync } from 'fs';
import { resolveDarkdotApi } from '../connections/darkdot';

import { Id, NormalizedOrdering, normalizeOrderingStruct, NormalizedProduct, NormalizedProfile, NormalizedStorefront, normalizeStorefrontStruct, normalizeProductStruct, normalizeProfileStruct } from './normalizers';
import { AccountId } from '@polkadot/types/interfaces'
import { TEST_MODE } from '../env';
import BN from 'bn.js';

type StorageName = 'products' | 'storefronts' | 'profiles' | 'orderings'

type Storage = {
  storefronts: Record<Id , NormalizedStorefront>,
  products: Record<Id, NormalizedProduct>,
  profiles: Record<Id, NormalizedProfile>,
  orderings: Record<Id, NormalizedOrdering>,
}

let storage: Storage

function initStorage() {
  if (TEST_MODE && !storage) {
    storage = {
      storefronts: readStorageFromFile('storefronts'),
      products: readStorageFromFile('products'),
      profiles: readStorageFromFile('profiles'),
      orderings: readStorageFromFile('orderings'),
    }
  }
}

initStorage()

function readStorageFromFile <T>(storageName: StorageName): Record<Id, T> {
  return JSON.parse(readFileSync(`./test/input_data/${storageName}.json`, 'utf-8'))
}

export async function findStorefront(id: StorefrontId | string): Promise<NormalizedStorefront | undefined> {
  if (TEST_MODE) {
    return storage.storefronts[id.toString()]
  }
  else {
    const { substrate } = await resolveDarkdotApi()
    const storefront = await substrate.findStorefront({ id: new BN(id) })
    return normalizeStorefrontStruct(storefront)
  }
}

export async function findProduct(id: ProductId | string): Promise<NormalizedProduct | undefined> {
  if (TEST_MODE) {
    return storage.products[id.toString()]
  }
  else {
    const { substrate } = await resolveDarkdotApi()
    const product = await substrate.findProduct({ id: new BN(id) })
    return normalizeProductStruct(product)
  }
}

export async function findSocialAccount(id: AccountId | string): Promise<NormalizedProfile | undefined> {
  if (TEST_MODE) {
    return storage.profiles[id.toString()]
  }
  else {
    const { substrate } = await resolveDarkdotApi()
    const profile = await substrate.findSocialAccount(id)
    return normalizeProfileStruct(id, profile)
  }
}

export async function findOrdering(id: OrderingId | string): Promise<NormalizedOrdering | undefined> {
  if (TEST_MODE) {
    return storage.orderings[id.toString()]
  }
  else {
    const { substrate } = await resolveDarkdotApi()
    const ordering = await substrate.findOrdering({ id: new BN(id) })
    return normalizeOrderingStruct(ordering)
  }
}