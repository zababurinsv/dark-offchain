import { resolveDarkdotApi } from '../../connections/darkdot';
import messages from './emailMessages';
import { getAccountContent, createHrefForProduct, createHrefForAccount, createHrefForStorefront, getFormatDate, resolveIpfsUrl } from './utils';
import { EventsName } from '@darkpay/dark-types';
import { Activity } from '../telegramWS';
import { ProductId, StorefrontId } from '@darkpay/dark-types/substrate/interfaces';
import { NotificationTemplateProp } from './types';
import { summarizeMd } from '@darkpay/dark-utils';

export const createNotifsEmailMessage = async (activity: Activity): Promise<NotificationTemplateProp> => {
	const { account, event, storefront_id, product_id, date, following_id, comment_id } = activity
	const eventName = event as EventsName

	const msg = messages.notifications[activity.event as EventsName]

	switch (eventName) {
		case 'AccountFollowed': return getAccountPreview(account, following_id, msg, date)
		case 'StorefrontFollowed': return getStorefrontPreview(account, storefront_id, msg, date)
		case 'StorefrontCreated': return getStorefrontPreview(account, storefront_id, msg, date)
		case 'CommentCreated': return getCommentPreview(account, comment_id, msg, date)
		case 'CommentReplyCreated': return getCommentPreview(account, comment_id, msg, date)
		case 'ProductShared': return getProductPreview(account, product_id, msg, date)
		case 'CommentShared': return getCommentPreview(account, comment_id, msg, date)
		case 'ProductReactionCreated': return getProductPreview(account, product_id, msg, date)
		case 'CommentReactionCreated': return getCommentPreview(account, comment_id, msg, date)
		case 'ProductCreated': return getProductPreview(account, product_id, msg, date)
		default: return undefined
	}
}

const getAccountPreview = async (account: string, following_id: string, message: string, date: string): Promise<NotificationTemplateProp> => {
	const actionDate = getFormatDate(date)

	const { name: followingName, avatar } = await getAccountContent(following_id)

	const { name: accountName } = await getAccountContent(account)
	const accountUrl = createHrefForAccount(account)

	return {
		date: actionDate,
		ownerName: followingName,
		avatar,
		message,
		relatedEntityUrl: accountUrl,
		entityName: accountName
	}
}

const getStorefrontPreview = async (account: string, storefrontId: string, message: string, date: string): Promise<NotificationTemplateProp | undefined> => {
	const darkdot = await resolveDarkdotApi()

	const actionDate = getFormatDate(date)

	const storefront = await darkdot.findStorefront({ id: storefrontId as unknown as StorefrontId })
	const { name, image } = storefront.content || {}

	const { name: accountName, avatar = '' } = await getAccountContent(account)

	const storefrontUrl = createHrefForStorefront(storefrontId.toString())

	return {
		date: actionDate,
		ownerName: accountName,
		avatar,
		message,
		relatedEntityUrl: storefrontUrl,
		entityName: name,
		image: resolveIpfsUrl(image)
	}

}

const getCommentPreview = async (account: string, commentId: string, message: string, date: string): Promise<NotificationTemplateProp | undefined> => {
	const darkdot = await resolveDarkdotApi()
	const actionDate = getFormatDate(date)

	const productDetails = await darkdot.findProductWithSomeDetails({ id: commentId as unknown as ProductId, withStorefront: true })
	const productId = productDetails.product.struct.id
	const storefrontId = productDetails.storefront.struct.id
	const content = productDetails.ext.product.content.body

	const { name: accountName, avatar } = await getAccountContent(account)

	const productUrl = createHrefForProduct(storefrontId.toString(), productId.toString())

	return {
		date: actionDate,
		ownerName: accountName,
		avatar,
		message,
		relatedEntityUrl: productUrl,
		entityName: summarizeMd(content, { limit: 60 }).summary
	}

}

const getProductPreview = async (account: string, productId: string, message: string, date: string): Promise<NotificationTemplateProp | undefined> => {
	const darkdot = await resolveDarkdotApi()

	const actionDate = getFormatDate(date)

	const product = await darkdot.findProduct({ id: productId as unknown as ProductId })
	const storefrontId = product.struct.storefront_id
	const { title, image = '' } = product.content || {}

	const { name: accountName, avatar } = await getAccountContent(account)

	const productUrl = createHrefForProduct(storefrontId.toString(), productId.toString())

	return {
		date: actionDate,
		ownerName: accountName,
		avatar,
		message,
		relatedEntityUrl: productUrl,
		entityName: title,
		image: resolveIpfsUrl(image)
	}
}
