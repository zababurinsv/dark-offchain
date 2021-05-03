import { postgesLog as log } from '../connections/loggers';

export { log };

export const logSuccess = (operation: string, structName: string) =>
  log.debug(`Succeeded to ${operation} ${structName}`)

export const logError = (operation: string, structName: string, error: any) =>
  log.error(`Failed to ${operation} ${structName}. Error: ${error}`)

type StructName = 'product' | 'storefront' | 'comment' | 'account' | 'owner' | 'product reaction' | 'comment reaction' | 'ordering';

const insertActivity = 'insert for';

export const emptyParamsLogError = (structName: StructName) => {
  logError(insertActivity, structName, 'Empty struct params ids')
}
export const updateCountLog = (count: number) => log.debug(`Update ${count} count`)
