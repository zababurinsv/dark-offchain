import { ElasticIndex } from '@darkpay/dark-types/offchain/search';
import * as dotenv from 'dotenv'

dotenv.config()

export const ES_INDEX_URL = process.env.ES_INDEX_URL || 'http://localhost:9200'
export const ES_INDEX_SPACES = ElasticIndex.storefronts
export const ES_INDEX_POSTS = ElasticIndex.products
export const ES_INDEX_PROFILES = ElasticIndex.profiles
export const ES_INDEX_ORDERINGS = ElasticIndex.orderings
