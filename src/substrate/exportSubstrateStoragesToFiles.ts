import { GenericAccountId } from '@polkadot/types';
import { writeFileSync } from 'fs';
import { resolveDarkdotApi } from '../connections/darkdot';
import { normalizeStorefrontStruct, normalizeProductStruct, normalizeProfileStruct, normalizeOrderingStruct } from './normalizers';
import { Storefront, Product, SocialAccount, Ordering } from '@darkpay/dark-types/substrate/interfaces';
import { Option } from '@polkadot/types/codec';
import { join } from 'path';

function writeStorageInFile(storageName, storage) {
  writeFileSync(join(__dirname ,`../../../test/input_data/${storageName}.json`), JSON.stringify(storage, null, 2))
}

const getData = async () => {
  const { substrate } = await resolveDarkdotApi()

  const storefrontEntries = await (await substrate.api).query.storefronts.storefrontById.entries() as unknown as [string, Option<Storefront>][]

  const orderingEntries = await (await substrate.api).query.orderings.orderingById.entries() as unknown as [string, Option<Ordering>][]

  const storefrontsStore = {}
  const productStore = {}
  const profileStore = {}
  const orderingsStore = {}

  storefrontEntries
    .forEach(([_id, storefrontOpt]) => {
      if(storefrontOpt.isSome) {
        const storefront = normalizeStorefrontStruct(storefrontOpt.unwrap())
        if(storefront.contentId || storefront.handle) {
          storefrontsStore[storefront.id] = storefront
        }
      }
    })

  writeStorageInFile("storefronts", storefrontsStore)



  orderingEntries
    .forEach(([_id, orderingOpt]) => {
      if(orderingOpt.isSome) {
        const ordering = normalizeOrderingStruct(orderingOpt.unwrap())
        if(ordering.contentId || ordering.ordering_state) {
          orderingsStore[ordering.id] = ordering
        }
      }
    })

  writeStorageInFile("orderings", orderingsStore)



  const productEntries = await (await substrate.api).query.products.productById.entries() as unknown as [string, Option<Product>][]

  productEntries
    .forEach(([_id, productObj]) => {
      if(productObj.isSome) {
        const product = normalizeProductStruct(productObj.unwrap())
        if(product.contentId){
          productStore[product.id] = product
        }
      }
    })
  writeStorageInFile("products", productStore)

  const profileEntries = await (await substrate.api).query.profiles.socialAccountById.entries() as unknown as [any, Option<SocialAccount>][]

  profileEntries.forEach(([ key, socialAccount ]) => {
    const addressEncoded = '0x' + key.toHex().substr(-64)
    const account = new GenericAccountId(key.registry, addressEncoded)
    const profile = normalizeProfileStruct(account, socialAccount.unwrap())
    profileStore[profile.id] = profile
  })
  writeStorageInFile("profiles", profileStore)

  process.exit(0)
}

getData()