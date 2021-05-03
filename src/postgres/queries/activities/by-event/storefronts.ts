import { GetActivitiesFn, GetCountFn } from '../../types'
import { getActivitiesByEvent, getActivitiesCountByEvent } from './common'
import { EventsName } from '@darkpay/dark-types'

const events: EventsName[] = [ 'StorefrontCreated' ]

export const getStorefrontActivitiesData: GetActivitiesFn = (params) =>
  getActivitiesByEvent({ ...params, events })

export const getStorefrontActivitiesCount: GetCountFn = (account) =>
  getActivitiesCountByEvent({ account, events })
