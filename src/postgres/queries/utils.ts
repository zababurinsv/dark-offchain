import { newLogger } from "@darkpay/dark-utils"
import { pg } from '../../connections/postgres'

const log = newLogger('PgQuery')

/** Execute ProductgreSQL query and return result data. */
export const execPgQuery = async (
  query: string,
  params: any[],
  errorMsg: string
): Promise<any> => {
  try {
    const data = await pg.query(query, params)
    return data.rows
  } catch (err) {
    log.error(errorMsg, err.stack);
    throw err.stack
  }
}
