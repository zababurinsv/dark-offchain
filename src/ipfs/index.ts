import { resolveCidOfContent } from '@darkpay/dark-api'
import { CommonContent } from '@darkpay/dark-types/offchain'
import { Ordering, Product, Profile, Storefront } from '@darkpay/dark-types/substrate/interfaces'
import { resolveDarkdotApi } from '../connections'
import { ipfsLog as log } from '../connections/loggers'

type Struct = Product | Storefront | Profile | Ordering

export async function getContentFromIpfs<T extends CommonContent>(struct: Struct): Promise<T | undefined> {
  const { ipfs } = await resolveDarkdotApi()
  const cid = resolveCidOfContent(struct.content)

  return ipfs.getContent<T>(cid)
    .catch(err => {
      log.warn(`Failed to get content from IPFS by CID:`, cid?.toString(), err)
      return undefined
    })
}
