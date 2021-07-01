import { BasicDarkdotApi } from './basic-darkdot';
import { FindStructsFns, loadAndSetProductRelatedStructs } from '../utils/loadProductStructs';
import { ProductWithSomeDetails, ProductWithAllDetails, AnyStorefrontId, AnyProductId, AnyOrderingId } from '@darkpay/dark-types';
import { getFirstOrUndefined } from '@darkpay/dark-utils';
import { FindProductsQuery, FindProductsWithDetailsQuery, FindProductWithDetailsQuery, FindOrderingQuery, FindOrderingsWithDetailsQuery } from '../utils/types';

export class DarkdotApi extends BasicDarkdotApi {

  private structFinders: FindStructsFns = {
    findStorefronts: this.findPublicStorefronts.bind(this),
    findProducts: this.findPublicProducts.bind(this),
    findProfiles: this.findProfiles.bind(this)
  }

  async findAllStorefronts (ids: AnyStorefrontId[]) {
    return this.findStorefronts({ ids })
  }

  /** Find and load public storefronts that have `hidden == false` field in Substrate struct and their IPFS content is not empty. */
  async findPublicStorefronts (ids: AnyStorefrontId[]) {
    return this.findStorefronts({ ids, visibility: 'onlyPublic', withContentOnly: true })
  }

  /** Find and load unlisted storefronts that have either `hidden == true` field in Substrate struct or their IPFS content is empty. */
  async findUnlistedStorefronts (ids: AnyStorefrontId[]) {
    return this.findStorefronts({ ids, visibility: 'onlyUnlisted' })
  }

  async findAllProducts (ids: AnyStorefrontId[]) {
    return this.findProducts({ ids })
  }

  async findAllOrderings (ids: AnyOrderingId[]) {
    return this.findOrderings({ ids })
  }

  /** Find and load public products that have `hidden == false` field in Substrate struct and their IPFS content is not empty. */
  async findPublicProducts (ids: AnyStorefrontId[]) {
    return this.findProducts({ ids, visibility: 'onlyPublic', withContentOnly: true })
  }

  /** Find and load unlisted products that have either `hidden == true` field in Substrate struct or their IPFS content is empty. */
  async findUnlistedProducts (ids: AnyStorefrontId[]) {
    return this.findProducts({ ids, visibility: 'onlyUnlisted' })
  }

  /** Find and load products with their extension and owner's profile (if defined). */
  async findProductsWithSomeDetails (filter: FindProductsWithDetailsQuery): Promise<ProductWithSomeDetails[]> {
    const products = await this.findProducts(filter)
    return loadAndSetProductRelatedStructs(products, this.structFinders, filter)
  }

  // not in @darkpay/dark-types yet
  // async findOrderingsWithSomeDetails (filter: FindOrderingsWithDetailsQuery): Promise<OrderingWithDetails[]> {
  //   const products = await this.findProducts(filter)
  //   return loadAndSetProductRelatedStructs(products, this.structFinders, filter)
  // }



  async findPublicProductsWithSomeDetails (filter: FindProductsWithDetailsQuery): Promise<ProductWithSomeDetails[]> {
    return this.findProductsWithSomeDetails({ ...filter, visibility: 'onlyPublic' })
  }
  

  async findUnlistedProductsWithSomeDetails (filter: FindProductsWithDetailsQuery): Promise<ProductWithSomeDetails[]> {
    return this.findProductsWithSomeDetails({ ...filter, visibility: 'onlyUnlisted' })
  }

  async findProductsWithAllDetails ({ ids, visibility }: FindProductsQuery): Promise<ProductWithAllDetails[]> {
    return this.findProductsWithSomeDetails({ ids, withStorefront: true, withOwner: true, visibility }) as Promise<ProductWithAllDetails[]>
  }

  async findPublicProductsWithAllDetails (ids: AnyProductId[]): Promise<ProductWithAllDetails[]> {
    return this.findProductsWithAllDetails({ ids, visibility: 'onlyPublic' })
  }

  async findUnlistedProductsWithAllDetails (ids: AnyProductId[]): Promise<ProductWithAllDetails[]> {
    return this.findProductsWithAllDetails({ ids, visibility: 'onlyUnlisted' })
  }

  // Functions that return a single element

  async findOrdering (id: AnyStorefrontId) {
    return getFirstOrUndefined(await this.findOrderings({ ids: [ id ]}))
  }


  /** Find and load a public storefront that has `hidden == false` field in Substrate struct and its IPFS content is not empty. */
  async findPublicStorefront (id: AnyStorefrontId) {
    return getFirstOrUndefined(await this.findPublicStorefronts([ id ]))
  }

  /** Find and load an unlisted storefront that has either `hidden == true` field in Substrate struct or its IPFS content is empty. */
  async findUnlistedStorefront (id: AnyStorefrontId) {
    return getFirstOrUndefined(await this.findUnlistedStorefronts([ id ]))
  }

  /** Find and load a public product that has `hidden == false` field in Substrate struct and its IPFS content is not empty. */
  async findPublicProduct (id: AnyStorefrontId) {
    return getFirstOrUndefined(await this.findPublicProducts([ id ]))
  }

  /** Find and load an unlisted storefront that has either `hidden == true` field in Substrate struct or its IPFS content is empty. */
  async findUnlistedProduct (id: AnyStorefrontId) {
    return getFirstOrUndefined(await this.findUnlistedProducts([ id ]))
  }

  async findProductWithSomeDetails ({ id, ...opts }: FindProductWithDetailsQuery) {
    return getFirstOrUndefined(await this.findProductsWithSomeDetails({ ids: [ id ], ...opts }))
  }

  async findPublicProductWithSomeDetails ({ id, ...opts }: FindProductWithDetailsQuery) {
    return getFirstOrUndefined(await this.findPublicProductsWithSomeDetails({ ids: [ id ], ...opts }))
  }

  async findUnlistedProductWithSomeDetails ({ id, ...opts }: FindProductWithDetailsQuery) {
    return getFirstOrUndefined(await this.findUnlistedProductsWithSomeDetails({ ids: [ id ], ...opts }))
  }

  async findProductWithAllDetails (id: AnyProductId) {
    return getFirstOrUndefined(await this.findProductsWithAllDetails({ ids: [ id ] }))
  }

  async findPublicProductWithAllDetails (id: AnyProductId) {
    return getFirstOrUndefined(await this.findPublicProductsWithAllDetails([ id ]))
  }

  async findUnlistedProductWithAllDetails (id: AnyProductId) {
    return getFirstOrUndefined(await this.findUnlistedProductsWithAllDetails([ id ]))
  }
}
