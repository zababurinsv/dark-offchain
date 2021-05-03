import { StorefrontId } from '@darkpay/dark-types/substrate/interfaces';
import { newLogger, nonEmptyStr } from '@darkpay/dark-utils';
import { resolveDarkdotApi } from '../../connections/darkdot';
import { appBaseUrl, ipfsGatewayUrl } from '../../env';
import { ActivityTable } from '../../postgres/queries/feed-and-notifs';
import { Activity } from '../telegramWS';
import { NotificationTemplateProp, FeedTemplateProp } from './types';
import { AnyAccountId } from '@darkpay/dark-types';
import { TemplateType } from './templates';
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(LocalizedFormat)
export const log = newLogger("Email")

// FIXME: export these to JS libs

type TableNameByActivityType = Record<TemplateType, ActivityTable>
export const TableNameByActivityType: TableNameByActivityType = {
	'feed': 'news_feed',
	'notifications': 'notifications',
	'confirmation': null
}

export type CreateEmailMessageFn = (activity: Activity) => Promise<NotificationTemplateProp | FeedTemplateProp>

export const createHrefForProduct = (storefrontId: string, productId: string) => {
	return `${appBaseUrl}/${storefrontId}/${productId}`
}

export const createHrefForStorefront = (storefrontId: string) => {
	return `${appBaseUrl}/${storefrontId}`
}

export const createHrefForAccount = (followingId: string) => {
	return `${appBaseUrl}/accounts/${followingId}`
}

export const createMessageForFeeds = (link: string, account: string, storefrontName: string, date: string) => {
	return link + "\n" + "Producted by " + account + " in storefront " + storefrontName + "\n" + date
}

export const toShortAddress = (_address: AnyAccountId) => {
  const address = (_address || '').toString()

  return address.length > 13 ? `${address.slice(0, 6)}…${address.slice(-6)}` : address
}

export const resolveIpfsUrl = (cid: string) => {
    return nonEmptyStr(cid) ? `${ipfsGatewayUrl}/ipfs/${cid}` : ''
}

export const DEFAULT_DATE_FORMAT = 'D MMM, YYYY h:mm A'

export const getAccountContent = async (account: string) => {
	const darkdot = await resolveDarkdotApi()
	const profile = await darkdot.findProfile(account)
	const shortAddress = toShortAddress(account)
	if (profile?.content) {
		const name = profile.content.name || shortAddress
		const avatar = profile.content.avatar ? resolveIpfsUrl(profile.content.avatar) : ''
		return { name, avatar }
	}
	else return { name: shortAddress, avatar: '' }
}

export const getStorefrontName = async (storefrontId: StorefrontId): Promise<string> => {
	const darkdot = await resolveDarkdotApi()
	const storefront = await darkdot.findStorefront({ id: storefrontId })
	if (storefront.content) {
		const name = storefront.content.name
		return name
	}
	else return ''
}

export const getExpiresOnDate = () => dayjs().add(1, 'hours').format('YYYY-MM-DDTHH:mm:ss').toString()

export const getFormatDate = (date: string) => dayjs(date).format('lll')

/**
 * Format date:
 * DD - 01-31
 * MMMM - January-December
 * YYYY - 2000
 * dddd - Monday-Subday
 * Full example: 01 January 2000 (Monday)
 */
export const getWeeklyDayDate = () => dayjs().format('DD MMMM YYYY (dddd)')