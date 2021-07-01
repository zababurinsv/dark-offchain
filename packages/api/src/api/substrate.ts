import { ApiPromise as SubstrateApi } from '@polkadot/api';
import { bool, GenericAccountId, Option, Tuple } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { AnyAccountId, AnyOrderingId, AnyStorefrontId, AnyProductId, AnyReactionId, SubstrateId, PalletName } from '@darkpay/dark-types';
import { Storefront, StorefrontId, Ordering, Product, ProductId, Reaction, ReactionId, Prices } from '@darkpay/dark-types/substrate/interfaces';
import registry from '@darkpay/dark-types/substrate/registry';
import { getFirstOrUndefined, isEmptyArray, isEmptyStr, newLogger, pluralize } from '@darkpay/dark-utils';
import { asAccountId, getUniqueIds, SupportedSubstrateId, SupportedSubstrateResult } from '../utils';
import { VisibilityFilter } from '../utils';
import { FindStorefrontQuery, FindStorefrontsQuery, FindOrderingsQuery, FindOrderingQuery, FindProductsQuery, FindProductQuery, DarkdotContext } from '../utils/types';
import { SocialAccountWithId } from '@darkpay/dark-types/dto';
import { OrderingId } from '@darkpay/dark-types/substrate/interfaces';

type StorageItem = {
  pallet: PalletName,
  storage: string
}

type SubstrateApiProps = DarkdotContext & {
  api: SubstrateApi
}

export class DarkdotSubstrateApi {

  private _api: SubstrateApi // Polkadot API (connected)
  // private context?: DarkdotContextProps TODO use when need

  constructor ({ api }: SubstrateApiProps) {
    this._api = api
    // this.context = context
    logger.info('Initialized')
  }

  getPalletQuery = async (pallet: PalletName) => {
    const api = await this.api
    return api.query[pallet]
  };

  public get api () {
    return this._api.isReady;
  }

  // ---------------------------------------------------------------------
  // Private utils

  private async queryPallet ({ storage, pallet }: StorageItem, value?: any): Promise<any> {
    const query = await this.getPalletQuery(pallet)
    return query[storage](value)
  }

  private async queryProducts (storage: string, value?: any): Promise<any> {
    return this.queryPallet({ pallet: 'products', storage }, value)
  }

  private async queryStorefronts (storage: string, value?: any): Promise<any> {
    return this.queryPallet({ pallet: 'storefronts', storage }, value)
  }

  private async queryProfiles (storage: string, value?: any): Promise<any> {
    return this.queryPallet({ pallet: 'profiles', storage }, value)
  }

  private async queryOrderings (storage: string, value?: any): Promise<any> {
    return this.queryPallet({ pallet: 'orderings', storage }, value)
  }

  private async queryPalletMulti ({ storage, pallet }: StorageItem, value: any[]): Promise<any[]> {
    const query = await this.getPalletQuery(pallet)
    return query[storage].multi(value)
  }


// OCW WORKER

private async queryOcwModule (storage: string, value?: any): Promise<any> {
  return this.queryPallet({ pallet: 'ocwModule', storage }, value)
}

async getPrices (): Promise<any[]> {
  return this.queryOcwModule('prices')
}



  // TODO maybe pallet: 'products' | 'storefronts
  private async isBooleanByAccount ({ storage, pallet }: StorageItem, accountId: AnyAccountId, subjectId: SubstrateId): Promise<boolean> {
    const queryParams = new Tuple(registry, [ GenericAccountId, 'u64' ], [ asAccountId(accountId), subjectId ]);
    const isBoolean = await this.queryPallet({ pallet, storage }, queryParams) as bool
    return isBoolean.valueOf()
  }

  private async getReactionIdByAccount (accountId: AnyAccountId, structId: AnyProductId): Promise<ReactionId> {
    const queryParams = new Tuple(registry, [ GenericAccountId, 'u64' ], [ asAccountId(accountId), structId ]);
    return this.queryPallet({ pallet: 'reactions', storage: 'productReactionIdByAccount' }, queryParams)
  }


  // ---------------------------------------------------------------------
  // Multiple

  async findStructs<T extends SupportedSubstrateResult>
  (storageItem: StorageItem, ids: SupportedSubstrateId[]): Promise<T[]> {
    const storage = storageItem.storage

    try {
      ids = getUniqueIds(ids)

      if (isEmptyArray(ids)) {
        logger.debug(`Nothing to load from ${storage}: no ids provided`)
        return []
      }

      const structs = await this.queryPalletMulti(storageItem, ids)

      const res: T[] = [];

      structs.forEach((x, i) => {
        if (x.isSome) {
          const id = ids[i]
          const item = x.unwrap()

          res.push(storageItem.pallet === 'profiles'
            ? {
                id,
                ...item
              }
            : item
          )
        }
      })

      logger.debug(`Loaded ${pluralize(res.length, 'struct')} from ${storage}`)
      return res
    } catch (err) {
      logger.error(`Failed to load struct(s) from ${storage} by ${ids.length} id(s):`, err)
      return []
    }
  }

  async findStorefronts ({ ids, visibility }: FindStorefrontsQuery): Promise<Storefront[]> {
    const storefronts: Storefront[] = await this.findStructs({ pallet: 'storefronts', storage: 'storefrontById' }, ids);
    return VisibilityFilter<Storefront>(storefronts, visibility)
  }

  async findProducts ({ ids, visibility }: FindProductsQuery): Promise<Product[]> {
    const products: Product[] = await this.findStructs({ pallet: 'products', storage: 'productById' }, ids);
    return VisibilityFilter<Product>(products, visibility)
  }

  async findSocialAccounts (ids: AnyAccountId[]): Promise<SocialAccountWithId[]> {
    const accountIds = ids.map(id => asAccountId(id)).filter(x => typeof x !== 'undefined') as AccountId[]
    return this.findStructs({ pallet: 'profiles', storage: 'socialAccountById' }, accountIds);
  }

  async findReactions (ids: AnyReactionId[]): Promise<Reaction[]> {
    return this.findStructs({ pallet: 'reactions', storage: 'reactionById' }, ids);
  }

  // async findOrderings (ids: AnyOrderingId[]): Promise<Ordering[]> {
  //   return this.findStructs({ pallet: 'orderings', storage: 'OrderingById' }, ids);
  // }
  async findOrderings ({ ids }: FindOrderingsQuery): Promise<Ordering[]> {
    const orderings: Ordering[] = await this.findStructs({ pallet: 'orderings', storage: 'orderingById' }, ids);
    return orderings
  }


  // ---------------------------------------------------------------------
  // Single

  async findStorefront ({ id, visibility }: FindStorefrontQuery): Promise<Storefront | undefined> {
    return getFirstOrUndefined(await this.findStorefronts({ ids: [ id ], visibility }))
  }

  async findProduct ({ id, visibility }: FindProductQuery): Promise<Product | undefined> {
    return getFirstOrUndefined(await this.findProducts({ ids: [ id ], visibility }))
  }

  async findSocialAccount (id: AnyAccountId): Promise<SocialAccountWithId | undefined> {
    return getFirstOrUndefined(await this.findSocialAccounts([ id ]))
  }

  async findReaction (id: AnyReactionId): Promise<Reaction | undefined> {
    return getFirstOrUndefined(await this.findReactions([ id ]))
  }

  // async findOrdering(id: AnyOrderingId): Promise<Ordering | undefined> {
  //   return getFirstOrUndefined(await this.findOrderings([ id ]))
  // }

  async findOrdering ({ id }: FindOrderingQuery): Promise<Ordering | undefined> {
    return getFirstOrUndefined(await this.findOrderings({ ids: [ id ]}))
  }


  // ---------------------------------------------------------------------
  // Get id

  async nextStorefrontId (): Promise<StorefrontId> {
    return this.queryStorefronts('nextStorefrontId')
  }

  async nextProductId (): Promise<ProductId> {
    return this.queryProducts('nextProductId')
  }

  async nextOrderingId (): Promise<ProductId> {
    return this.queryProducts('nextOrderingId')
  }

  async getStorefrontIdByHandle (handle: string): Promise<StorefrontId | undefined> {
    if (isEmptyStr(handle)) {
      return undefined
    }
    const idOpt = await this.queryStorefronts('storefrontIdByHandle', handle) as Option<StorefrontId>
    return idOpt.unwrapOr(undefined)
  }

  async getAccountIdByHandle (handle: string): Promise<AccountId | undefined> {
    if (isEmptyStr(handle)) {
      return undefined
    }
    const idOpt = await this.queryProfiles('accountByProfileUsername', handle) as Option<AccountId>
    return idOpt.unwrapOr(undefined)
  }

  async getReplyIdsByProductId (id: AnyProductId): Promise<ProductId[]> {
    return this.queryProducts('replyIdsByProductId', id);
  }

  async storefrontIdsByOwner (id: AnyAccountId): Promise<StorefrontId[]> {
    return this.queryStorefronts('storefrontIdsByOwner', asAccountId(id))
  }

  async storefrontIdsFollowedByAccount (id: AnyAccountId): Promise<StorefrontId[]> {
    return this.queryPallet({ pallet: 'storefrontFollows', storage: 'storefrontsFollowedByAccount' }, asAccountId(id))
  }

  async productIdsByStorefrontId (id: AnyStorefrontId): Promise<ProductId[]> {
    return this.queryProducts('productIdsByStorefrontId', id)
  }


  async getOrderingsById (id: AnyOrderingId): Promise<Ordering[]> {
    return this.queryPallet({ pallet: 'orderings', storage: 'orderingById' }, id)
  }

  async getOrderingIdsByProductId (id: AnyProductId): Promise<OrderingId[]> {
    return this.queryPallet({ pallet: 'orderings', storage: 'orderingIdsByProductId' }, id)
  }

  async getOrderingIdsByStorefrontId (id: AnyStorefrontId): Promise<OrderingId[]> {
    return this.queryPallet({ pallet: 'orderings', storage: 'orderingIdsByStorefrontId' }, id)
  }

  async getOrderingIdsByAccount (id: AnyAccountId): Promise<OrderingId[]> {
    return this.queryPallet({ pallet: 'orderings', storage: 'orderingIdsByAccount' }, id)
  }


  // ---------------------------------------------------------------------
  // Is boolean

  async isAccountFollower (myAddress: AnyAccountId, followedAddress: AnyAccountId): Promise<boolean> {
    const followedAccountId = asAccountId(followedAddress)
    const myAccountId = asAccountId(myAddress)
    const queryParams = new Tuple(registry, [ GenericAccountId, GenericAccountId ], [ myAccountId, followedAccountId ]);
    const isFollow = await this.queryPallet({ pallet: 'profileFollows', storage: 'accountFollowedByAccount' }, queryParams) as bool
    return isFollow.valueOf()
  }

  async isStorefrontFollower (myAddress: AnyAccountId, storefrontId: AnyStorefrontId): Promise<boolean> {
    return this.isBooleanByAccount({ pallet: 'storefrontFollows', storage: 'storefrontFollowedByAccount' }, myAddress, storefrontId)
  }

  async isProductSharedByAccount (accountId: AnyAccountId, productId: AnyProductId): Promise<boolean> {
    return this.isBooleanByAccount({ pallet: 'products', storage: 'productSharedByAccount' }, accountId, productId)
  }

  async getProductReactionIdByAccount (accountId: AnyAccountId, productId: AnyProductId): Promise<ReactionId> {
    return this.getReactionIdByAccount(accountId, productId)
  }

}

const logger = newLogger(DarkdotSubstrateApi.name);
