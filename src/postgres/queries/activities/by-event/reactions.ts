import { GetActivitiesFn, GetCountFn } from '../../types'
import { getActivitiesByEvent, getActivitiesCountByEvent } from './common'
import { EventsName } from '@darkpay/dark-types'

const events: EventsName[] = [ 'CommentReactionCreated', 'ProductReactionCreated' ]

export const getReactionActivitiesData: GetActivitiesFn = (params) =>
  getActivitiesByEvent({ ...params, events })

export const getReactionActivitiesCount: GetCountFn = (account) =>
  getActivitiesCountByEvent({ account, events })
