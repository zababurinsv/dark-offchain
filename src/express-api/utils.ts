import * as express from 'express'
import { nonEmptyStr, parseNumStr } from '@subsocial/utils'
import { expressApiLog } from '../connections/loggers'

export const MAX_RESULTS_LIMIT = parseNumStr(process.env.MAX_RESULTS_LIMIT) || 20

export type HandlerFn = (req: express.Request, res: express.Response) => Promise<any>

export type EmailSettings = {
	account: string,
	email: string,
	periodicity: string,
	send_feeds: boolean,
	send_notifs: boolean,
	last_block_bumber: number,
	last_event_index: number,
	next_leter_date: Date,
	confirmation_code: string,
	confirmed_on: Date
}

export type OkOrError = {
  ok: boolean,
  errors?: Record<string, string>
}

const getNumberFromRequest = (
  req: express.Request,
  value: 'limit' | 'offset',
  def: number
): number => {
  const reqParameter = req.query[value]
  return nonEmptyStr(reqParameter) ? parseNumStr(reqParameter) : def
}

export const resolvePromiseAndReturnJson = async (
  res: express.Response,
  promise: Promise<any>
) => {
  try {
    const data = await promise
    res.json(data)
  } catch (err) {
    expressApiLog.error(err)
    res.status(err.statusCode).send(err)
  }
}

export const getLimitFromRequest = (
  req: express.Request,
  maxLimit: number = MAX_RESULTS_LIMIT
): number => {
  const limit = getNumberFromRequest(req, 'limit', maxLimit)
  return limit < maxLimit ? limit : maxLimit
}

export const getOffsetFromRequest = (
  req: express.Request,
  defaultOffset?: number
): number => {
  return getNumberFromRequest(req, 'offset', defaultOffset)
}

