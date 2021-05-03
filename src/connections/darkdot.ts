import { DarkdotApi } from '@darkpay/dark-api/api/darkdot'
import { Api } from '@darkpay/dark-api/connections/substrateConnect'
import { registry } from '@darkpay/dark-types/substrate/registry'
import { ipfsConfig } from './ipfs'
import { ApiPromise } from '@polkadot/api'
let darkdot: DarkdotApi
let api: ApiPromise
/**
 * Create a new or return existing connection to Darkdot API
 * (includes Substrate and IPFS connections).
 */

type Api = DarkdotApi & {
  api: ApiPromise
}

export const resolveDarkdotApi = async (): Promise<Api> => {
  // Connect to Darkdot's Substrate node:

  if (!darkdot) {
    api = await Api.connect(process.env.SUBSTRATE_URL)
    const properties = await api.rpc.system.properties()

    registry.setChainProperties(properties)
    darkdot = new DarkdotApi({
      substrateApi: api,
      ...ipfsConfig
    });

    (darkdot as any).api = api

  }

  return darkdot as unknown as Api
}
