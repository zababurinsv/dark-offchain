import { DarkdotSubstrateApi } from '@darkpay/dark-api/api/substrate'
import { resolveDarkdotApi } from '../connections/darkdot'
import { indexProductContent, indexProfileContent, indexStorefrontContent, indexOrderingContent } from './indexer'
import { elasticLog as log } from '../connections/loggers'
import BN from 'bn.js';
import { argv, exit } from 'process'
import { GenericAccountId } from '@polkadot/types'
import { isEmptyArray } from '@darkpay/dark-utils';
import { getUniqueIds } from '@darkpay/dark-api'

const one = new BN(1)

type ReindexerFn = (substrate: DarkdotSubstrateApi) => Promise<void>

const reindexProfiles: ReindexerFn = async (substrate) => {
  const api = await substrate.api
  const storageKeys = await api.query.profiles.socialAccountById.keys()

  const profileIndexators = storageKeys.map(async (key) => {
    const addressEncoded = '0x' + key.toHex().substr(-64)
    const account = new GenericAccountId(key.registry, addressEncoded)

    const res = await substrate.findSocialAccount(account)
    const { profile } = res
    if (profile.isSome) {
      log.info(`Index profile of account ${account.toString()}`)
      await indexProfileContent(profile.unwrap())
    }
  })

  await Promise.all(profileIndexators)
}

const reindexStorefronts: ReindexerFn = async (substrate) => {
  const lastStorefrontId = (await substrate.nextStorefrontId()).sub(one)
  const lastStorefrontIdStr = lastStorefrontId.toString()

  // Create an array with storefront ids from 1 to lastStorefrontId
  const storefrontIds = Array.from({ length: lastStorefrontId.toNumber() }, (_, i) => i + 1)

  const storefrontIndexators = storefrontIds.map(async (storefrontId) => {
    const id = new BN(storefrontId)
    const storefront = await substrate.findStorefront({ id })
    log.info(`Index storefront # ${storefrontId} out of ${lastStorefrontIdStr}`)
    await indexStorefrontContent(storefront)
  })

  await Promise.all(storefrontIndexators)
}


const reindexOrderings: ReindexerFn = async (substrate) => {
  const lastOrderingId = (await substrate.nextOrderingId()).sub(one)
  const lastOrderingIdStr = lastOrderingId.toString()

  // Create an array with storefront ids from 1 to lastOrderingId
  const orderingIds = Array.from({ length: lastOrderingId.toNumber() }, (_, i) => i + 1)

  const orderingIndexators = orderingIds.map(async (orderingId) => {
    const id = new BN(orderingId)
    const ordering = await substrate.findOrdering({ id })
    log.info(`Index ordering # ${orderingId} out of ${lastOrderingIdStr}`)
    await indexOrderingContent(ordering)
  })

  await Promise.all(orderingIndexators)
}



const reindexProducts: ReindexerFn = async (substrate) => {
  const lastProductId = (await substrate.nextProductId()).sub(one)
  const lastProductIdStr = lastProductId.toString()

  // Create an array with storefront ids from 1 to lastStorefrontId
  const productIds = Array.from({ length: lastProductId.toNumber() }, (_, i) => i + 1)

  const productIndexators = productIds.map(async (productId) => {
    const id = new BN(productId)
    const product = await substrate.findProduct({ id })
    log.info(`Index product # ${productId} out of ${lastProductIdStr}`)
    await indexProductContent(product)
  })

  await Promise.all(productIndexators)
}

type IReindexerFunction = Record<string, ReindexerFn>
const ReindexerFunction: IReindexerFunction = {
  profiles: reindexProfiles,
  storefronts: reindexStorefronts,
  products: reindexProducts,
  orderings: reindexOrderings,
}
const AllReindexerFunctions = Object.values(ReindexerFunction)

async function reindexContentFromIpfs(substrate: DarkdotSubstrateApi) {
  const uniqueArguments = getUniqueIds(argv)
  let reindexPromises = uniqueArguments.filter(arg => ReindexerFunction[arg])
    .map(async argument => {
      const func = ReindexerFunction[argument]
      await func(substrate)
    })

  if (isEmptyArray(reindexPromises) || argv.includes('all'))
    reindexPromises = AllReindexerFunctions.map(fn => fn(substrate))

  await Promise.all(reindexPromises)

  exit(0)
}

resolveDarkdotApi()
  .then(({ substrate }) => reindexContentFromIpfs(substrate))
  .catch((error) => {
    log.error('Failed to reindex storefronts and products in Elasticsearch:', error)
    exit(-1)
  })
