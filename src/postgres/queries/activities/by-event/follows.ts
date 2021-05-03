import { GetActivitiesFn, GetCountFn } from '../../types'
import { getActivitiesByEvent, getActivitiesCountByEvent } from './common'
import { EventsName } from '@darkpay/dark-types'

const events: EventsName[] = [ 'StorefrontFollowed', 'AccountFollowed' ]

export const getFollowActivitiesData: GetActivitiesFn = (params) =>
  getActivitiesByEvent({ ...params, events })

export const getFollowActivitiesCount: GetCountFn = (account) =>
  getActivitiesCountByEvent({ account, events })
