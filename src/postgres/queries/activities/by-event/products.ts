import { GetActivitiesFn, GetCountFn } from '../../types'
import { getActivitiesByEvent, getActivitiesCountByEvent } from './common'
import { EventsName } from '@darkpay/dark-types'

const events: EventsName[] = [ 'ProductCreated' ]

export const getProductActivitiesData: GetActivitiesFn = (params) =>
  getActivitiesByEvent({ ...params, events })

export const getProductActivitiesCount: GetCountFn = (account) =>
  getActivitiesCountByEvent({ account, events })
