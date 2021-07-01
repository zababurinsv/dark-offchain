import { ApiPromise as SubstrateApi } from '@polkadot/api';
import { StorefrontData, CommonData, ProductData, ProfileData, OrderingData } from '@darkpay/dark-types';
import { SocialAccountWithId } from '@darkpay/dark-types/';
import { StorefrontContent, OrderingContent, CommonContent, IpfsCid, ProductContent, ProfileContent } from '@darkpay/dark-types/';
import { AnyAccountId, AnyOrderingId, AnyStorefrontId, AnyProductId, CommonStruct } from '@darkpay/dark-types';
import { Storefront, Product, Ordering } from '@darkpay/dark-types/substrate/interfaces';
import { getFirstOrUndefined } from '@darkpay/dark-utils';
import { getCidsOfStructs, getIpfsCidOfStruct, DarkdotIpfsApi } from './ipfs';
import { DarkdotSubstrateApi } from './substrate';
import { getUniqueIds, SupportedSubstrateId } from '../utils/common';
import { FindProductQuery, FindStorefrontsQuery, FindProductsQuery, FindOrderingsQuery, FindOrderingQuery, FindStorefrontQuery, DarkdotContext, ContentResult } from '../utils/types';
import { contentFilter } from '../utils/content-filter';

export type DarkdotApiProps = DarkdotContext & {
  substrateApi: SubstrateApi,
  ipfsNodeUrl: string,
  offchainUrl: string
}

export class BasicDarkdotApi {

  private _substrate: DarkdotSubstrateApi

  private _ipfs: DarkdotIpfsApi

  constructor (props: DarkdotApiProps) {
    const { substrateApi, ipfsNodeUrl, offchainUrl, ...context } = props
    this._substrate = new DarkdotSubstrateApi({ api: substrateApi, ...context })
    this._ipfs = new DarkdotIpfsApi({ ipfsNodeUrl, offchainUrl, ...context })
  }

  public get substrate (): DarkdotSubstrateApi {
    return this._substrate
  }

  public get ipfs (): DarkdotIpfsApi {
    return this._ipfs
  }

  private async findDataArray<
    Id extends SupportedSubstrateId,
    Struct extends CommonStruct,
    Content extends CommonContent
  > (
    ids: Id[],
    findStructs: (ids: Id[]) => Promise<Struct[]>,
    findContents: (cids: IpfsCid[]) => Promise<ContentResult<Content>>
  ): Promise<CommonData<Struct, Content>[]> {

    const structs = await findStructs(ids)
    const cids = getUniqueIds(getCidsOfStructs(structs))
    const contents = await findContents(cids)

    return structs.map(struct => {
      const hash = getIpfsCidOfStruct(struct)
      const content = hash ? contents[hash] : undefined
      return { struct, content }
    })
  }

  // ---------------------------------------------------------------------
  // Multiple

  async findStorefronts (filter: FindStorefrontsQuery): Promise<StorefrontData[]> {
    const findStructs = this.substrate.findStorefronts.bind(this.substrate, filter);
    const findContents = this.ipfs.findStorefronts.bind(this.ipfs);
    const storefronts = await this.findDataArray<AnyStorefrontId, Storefront, StorefrontContent>(
      filter.ids, findStructs, findContents
    )
    return contentFilter({
      structs: storefronts,
      withContentOnly: filter.withContentOnly
    })
  }

  async findProducts (filter: FindProductsQuery): Promise<ProductData[]> {
    const findStructs = this.substrate.findProducts.bind(this.substrate, filter)
    const findContents = this.ipfs.findProducts.bind(this.ipfs)
    const products = await this.findDataArray<AnyProductId, Product, ProductContent>(
      filter.ids, findStructs, findContents
    )

    return contentFilter({
      structs: products,
      withContentOnly: filter.withContentOnly
    })
  }

  async findProfiles (ids: AnyAccountId[]): Promise<ProfileData[]> {
    const findStructs = this.substrate.findSocialAccounts.bind(this.substrate)
    const findContents = this.ipfs.findProfiles.bind(this.ipfs)

    const profiles = await this.findDataArray<AnyAccountId, SocialAccountWithId, ProfileContent>(
      ids, findStructs, findContents
    ) as ProfileData[]

    return profiles.map(x => {
      const profile = x.struct.profile.unwrapOr(undefined)
      return { ...x, profile }
    })
  }


  // async findOrderings (ids: AnyOrderingId[]): Promise<OrderingData[]> {
  //   const findOrders = this.substrate.findOrderings.bind(this.substrate);
  //   const findContents = this.ipfs.findOrderings.bind(this.ipfs);
  //   const orderings = await this.findDataArray<AnyOrderingId, Ordering, OrderingContent>(
  //     ids, findOrders, findContents
  //   ) as OrderingData[]

  //   return orderings
  // }

  async findOrderings(filter: FindOrderingsQuery): Promise<OrderingData[]> {
    const findStructs = this.substrate.findOrderings.bind(this.substrate, filter);
    const findContents = this.ipfs.findOrderings.bind(this.ipfs);
    const orderings = await this.findDataArray<AnyOrderingId, Ordering, OrderingContent>(
      filter.ids, findStructs, findContents
    )
    return contentFilter({
      structs: orderings,
    })
  }
  // ---------------------------------------------------------------------
  // Single

  async findStorefront ({ id, visibility }: FindStorefrontQuery): Promise<StorefrontData | undefined> {
    return getFirstOrUndefined(await this.findStorefronts({ ids: [ id ], visibility }))
  }

  async findProduct ({ id, visibility }: FindProductQuery): Promise<ProductData | undefined> {
    return getFirstOrUndefined(await this.findProducts({ ids: [ id ], visibility }))
  }

  async findProfile (id: AnyAccountId): Promise<ProfileData | undefined> {
    return getFirstOrUndefined(await this.findProfiles([ id ]))
  }
}
