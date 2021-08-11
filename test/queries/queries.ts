import { SelectFromTableFn } from '../compare-data';
import { pg } from '../../src/connections/postgres';

export const selectFromActivities: SelectFromTableFn = async () => {
  const query = `
    SELECT account,
      block_number,
      event_index,
      event,
      following_id,
      storefront_id,
      product_id,
      comment_id,
      parent_comment_id,
      aggregated,
      agg_count
    FROM df.activities
    ORDER BY block_number, event_index ASC
  `

  return (await pg.query(query)).rows
}

export const selectFromNotifications: SelectFromTableFn = async () => {
  const query = `
    SELECT account,
      block_number,
      event_index
    FROM df.notifications
    ORDER BY account, block_number, event_index ASC
  `

  return (await pg.query(query)).rows
}
export const selectFromNewsFeed: SelectFromTableFn = async () => {
  const query = `
    SELECT account,
      block_number,
      event_index
    FROM df.news_feed
    ORDER BY account, block_number, event_index ASC
  `

  return (await pg.query(query)).rows
}
export const selectFromAccountFollowers: SelectFromTableFn = async () => {
  const query = `
    SELECT follower_account,
      following_account
    FROM df.account_followers
    ORDER BY follower_account, following_account
  `

  return (await pg.query(query)).rows
}
export const selectFromProductFollowers: SelectFromTableFn = async () => {
  const query = `
    SELECT follower_account,
      following_product_id
    FROM df.product_followers
    ORDER BY follower_account, following_product_id
  `
  
  return (await pg.query(query)).rows
}
export const selectFromCommentFollowers: SelectFromTableFn = async () => {
  const query = `
    SELECT follower_account,
      following_comment_id
    FROM df.comment_followers
    ORDER BY follower_account, following_comment_id
  `

  return (await pg.query(query)).rows
}

export const selectFromStorefrontFollowers: SelectFromTableFn = async () => {
  const query = `
    SELECT follower_account,
      following_storefront_id
    FROM df.storefront_followers
    ORDER BY follower_account, following_storefront_id
  `

  return (await pg.query(query)).rows
}