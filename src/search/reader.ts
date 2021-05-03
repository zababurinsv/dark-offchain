import { newLogger, isEmptyArray } from '@darkpay/dark-utils'
import { MAX_RESULTS_LIMIT } from '../express-api/utils'
import {
  ElasticIndex,
  ElasticIndexTypes,
  AllElasticIndexes,
  ElasticFields,
  ElasticQueryParams,
} from '@darkpay/dark-types/offchain/search'

const log = newLogger('Elastic Reader')

const resoloveElasticIndexByType = (type: ElasticIndexTypes) =>
  ElasticIndex[type]

const resoloveElasticIndexes = (indexes: ElasticIndexTypes[]) =>
  indexes && indexes.includes('all')
    ? AllElasticIndexes
    : indexes?.map(resoloveElasticIndexByType)

export const buildElasticSearchQuery = (params: ElasticQueryParams) => {
  const indexes = resoloveElasticIndexes(params.indexes)
  const q = params.q || '*'
  const tags = params.tags || []
  const from = params.offset || 0
  const size = params.limit || MAX_RESULTS_LIMIT

  // TODO: support sorting of results

  const baseSearchProps = {
    index: indexes,
    from: from,
    size: size,
  }

  const tagFields = [
    ElasticFields.storefront.tags,
    ElasticFields.product.tags
  ]

  const searchFields = [
    `${ElasticFields.storefront.name}^3`,
    `${ElasticFields.storefront.handle}^2`,
    `${ElasticFields.storefront.about}^1`,
    `${ElasticFields.storefront.tags}^2`,

    `${ElasticFields.product.title}^3`,
    `${ElasticFields.product.body}^1`,
    `${ElasticFields.product.tags}^2`,

    `${ElasticFields.comment.body}^2`,

    `${ElasticFields.profile.name}^3`,
    `${ElasticFields.profile.about}^1`,

    `${ElasticFields.ordering.orderingcontent_total}^3`,
    `${ElasticFields.ordering.orderingcontent_state}^1`,
  ]

  const isEmptyQuery = q === '*' || q.trim() === ''

  const searchQueryPart = isEmptyQuery
    ? {
        match_all: {},
      }
    : {
        multi_match: {
          query: q,
          fields: searchFields,
        },
      }

  const tagFilterQueryPart = tags.map((tag) => ({
    multi_match: {
      query: tag,
      fields: tagFields,
    },
  }))

  const searchBody = isEmptyArray(tagFilterQueryPart)
    ? searchQueryPart
    : {
        bool: {
          must: searchQueryPart,
          filter: [tagFilterQueryPart],
        },
      }

  const searchReq = {
    ...baseSearchProps,
    body: {
      query: searchBody,
    },
  }

  log.debug('Final ElasticSearch query:', searchReq)

  return searchReq
}