import { Comment } from '@darkpay/dark-types/substrate/classes';
import { IpfsCid, SubstrateId, AnyAccountId, AnyOrderingId, CommonStruct, CID } from '@darkpay/dark-types';
import { newLogger, isEmptyArray, nonEmptyStr, isDef } from '@darkpay/dark-utils';
import { ProductId, ReactionId, SocialAccount, Reaction, Product, OrderingId, Ordering, Content } from '@darkpay/dark-types/substrate/interfaces';
import registry from '@darkpay/dark-types/substrate/registry';
import { GenericAccountId } from '@polkadot/types'

const log = newLogger('Darkdot Api Utils');

export type SupportedSubstrateId = SubstrateId | AnyAccountId | ReactionId | AnyOrderingId

export type SupportedSubstrateResult = CommonStruct | SocialAccount | Reaction | Ordering

type AnyId = SupportedSubstrateId | IpfsCid

export const getUniqueIds = <ID extends AnyId> (ids: (ID | undefined)[]): ID[] => {
  if (isEmptyArray(ids)) return []

  const knownIds = new Set<string>()
  const uniqueIds: ID[] = []

  ids.forEach(id => {
    if (typeof id?.toString === 'function') {
      const idStr = id.toString()
      if (!knownIds.has(idStr)) {
        knownIds.add(idStr)
        uniqueIds.push(id)
      }
    }
  })

  return uniqueIds
}

export function asAccountId (id: AnyAccountId): GenericAccountId | undefined {
  try {
    if (id instanceof GenericAccountId) {
      return id
    } else if (nonEmptyStr(id)) {
      return new GenericAccountId(registry, id)
    }
    return undefined
  } catch {
    return undefined
  }
}

export const getSharedProductId = (productData: any): ProductId | undefined => {
  if (!productData) return undefined;

  const ext = productData?.struct?.extension
  const sharedProductId = ext?.isSharedProduct ? ext.asSharedProduct : undefined
  sharedProductId && log.debug('Shared product id:', sharedProductId.toString())

  return sharedProductId
}

type HasProductStruct = {
  struct: Product
}

/** Return original product id from shared product or root product id if this product is a comment. */
export const getProductIdFromExtension = (productData?: HasProductStruct): ProductId | undefined => {
  if (!productData) return undefined;

  const ext = productData.struct.extension

  if (ext) {
    const { isSharedProduct, isComment } = ext

    if (isComment || ext.value instanceof Comment) {
      return ext.asComment.root_product_id
    } else if (isSharedProduct) {
      return ext.asSharedProduct
    }
  }

  return undefined
}

export const isIpfs = (content?: Content) => content && (content.isIpfs || (content as any).IPFS)

export const asIpfsCid = (cid: IpfsCid): CID => {
  if (cid instanceof CID) {
    return cid
  } else if (typeof cid === 'string') {
    return new CID(cid)
  } else if (typeof cid.toU8a === 'function') {
    return new CID(cid.toString())
  } else {
    throw new Error('Wrong type of IPFS CID. Valid types are: string | CID | IpfsCid')
  }
}

export const isValidIpfsCid = (cid: IpfsCid) => {
  try {
    return !!asIpfsCid(cid)
  } catch {
    return false
  }
}

export const resolveCidOfContent = (content?: Content) =>
  (isDef(content) && content.isIpfs)
    ? content.asIpfs.toString()
    : undefined
