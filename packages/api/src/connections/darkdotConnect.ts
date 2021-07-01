import { ApiPromise } from '@polkadot/api'
import { DarkdotApiProps, DarkdotApi } from '../api'
import { getApi } from './substrateConnect'
let darkdot!: DarkdotApi
let isLoadingDarkdot = false

/**
 * Create a new or return existing connection to Darkdot API
 * (includes Substrate and IPFS connections).
 */

type Api = DarkdotApi & {
  api: ApiPromise
}

type NewDarkdotApiProps = Omit<DarkdotApiProps, 'substrateApi'> & {
  substrateNodeUrl: string
}

export const newDarkdotApi = async ({ substrateNodeUrl, ...props }: NewDarkdotApiProps) => {
  if (!darkdot && !isLoadingDarkdot) {
    isLoadingDarkdot = true
    const substrateApi = await getApi()
    darkdot = new DarkdotApi({ substrateApi, ...props })
    isLoadingDarkdot = false;

    (darkdot as any).api = substrateApi
  }
  return darkdot as Api
}

export const createResolveDarkdotApi = (context: NewDarkdotApiProps) => () => newDarkdotApi(context)