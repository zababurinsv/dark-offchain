import { resolveDarkdotApi } from "../connections"
import { newLogger } from '@darkpay/dark-utils';
import { indexBlocksFromFile } from './block-indexer';

const log = newLogger('BlockIndexer')

resolveDarkdotApi()
  .then(({ substrate }) => indexBlocksFromFile(substrate))
  .catch((error) => {
    log.error('Unexpected error during processing of Substrate events:', error)
    process.exit(-1)
  })