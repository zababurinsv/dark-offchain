import { elasticIndexer } from '../connections/elastic'
import StorefrontsMapping from './mappings/storefronts.json'
import ProductsMapping from './mappings/products.json'
import ProfilesMapping from './mappings/profiles.json'
import OrderingsMapping from './mappings/orderings.json'
import { ES_INDEX_SPACES, ES_INDEX_POSTS, ES_INDEX_PROFILES, ES_INDEX_ORDERINGS } from './config'
import { elasticLog as log } from '../connections/loggers';

async function maybeCreateIndices () {
  await createIndexIfNotFound(ES_INDEX_SPACES, StorefrontsMapping)
  await createIndexIfNotFound(ES_INDEX_POSTS, ProductsMapping)
  await createIndexIfNotFound(ES_INDEX_PROFILES, ProfilesMapping)
  await createIndexIfNotFound(ES_INDEX_ORDERINGS, OrderingsMapping)
}

async function createIndexIfNotFound (indexName: string, mapping: any) {
  const result = await elasticIndexer.indices.exists(
    { index: indexName },
    { ignore: [ 404 ] }
  )

  if (result.statusCode === 404) {
    await elasticIndexer.indices.create({
      index: indexName,
      body: mapping
    })
    log.info(`${indexName} index created`)
  } else log.warn(`${indexName} index already exists`)
}

maybeCreateIndices()
  .catch(err => {
    log.error('Failed to create indices:', err)
    throw err
  })
