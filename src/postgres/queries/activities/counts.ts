import { getProductActivitiesCount } from './by-event/products'
import { getStorefrontActivitiesCount } from './by-event/storefronts'
import { getOrderingActivitiesCount } from './by-event/orderings'
import { getFollowActivitiesCount } from './by-event/follows'
import { getReactionActivitiesCount } from './by-event/reactions'
import { getCommentActivitiesCount } from './by-event/comments'
import { getActivitiesCount } from './all'
import { Counts } from '@darkpay/dark-types'

export const getActivityCounts = async (account: string): Promise<Counts> => {
  const [
    productsCount,
    storefrontsCount,
    orderingsCount,
    followsCount,
    reactionsCount,
    commentsCount,
    activitiesCount
  ] = await Promise.all([
    getProductActivitiesCount(account),
    getStorefrontActivitiesCount(account),
    getOrderingActivitiesCount(account),
    getFollowActivitiesCount(account),
    getReactionActivitiesCount(account),
    getCommentActivitiesCount(account),
    getActivitiesCount(account)
  ])

  return {
    productsCount,
    commentsCount,
    reactionsCount,
    followsCount,
    storefrontsCount,
    orderingsCount,
    activitiesCount
  }
}
