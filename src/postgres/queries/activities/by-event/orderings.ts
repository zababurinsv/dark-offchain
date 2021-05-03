import { GetActivitiesFn, GetCountFn } from '../../types'
import { getActivitiesByEvent, getActivitiesCountByEvent } from './common'
import { EventsName } from '@darkpay/dark-types'

const events: EventsName[] = [ 'OrderingCreated' ]

export const getOrderingActivitiesData: GetActivitiesFn = (params) =>
  getActivitiesByEvent({ ...params, events })

export const getOrderingActivitiesCount: GetCountFn = (account) =>
  getActivitiesCountByEvent({ account, events })
