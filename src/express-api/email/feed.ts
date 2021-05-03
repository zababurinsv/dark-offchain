import { Activity } from '../telegramWS';
import { resolveDarkdotApi } from '../../connections/darkdot';
import { ProductId } from '@darkpay/dark-types/substrate/interfaces';
import { createHrefForProduct, getAccountContent, getFormatDate, toShortAddress } from './utils';
import { FeedTemplateProp } from './types';
import { summarizeMd } from '@darkpay/dark-utils/summarize'
import { ProductWithAllDetails } from '@darkpay/dark-types';

const createProductData = async ({ product, storefront }: ProductWithAllDetails) => {
	const { id, owner, storefront_id, created: { time } } = product.struct

	const { title: productTitle, body, image } = product.content

	const { summary: productSummary } = summarizeMd(body)

	const { name: storefrontName } = storefront.content

	const ownerAddress = owner.toString()

	const { name: ownerName = toShortAddress(ownerAddress), avatar } = await getAccountContent(ownerAddress)

	const productLink = createHrefForProduct(storefront_id.toString(), id.toString())
	
	return { ownerName, avatar, storefrontName, productTitle, productLink, productSummary, date: getFormatDate(time.toString()), image }
}

export const createFeedEmailMessage = async (activity: Activity): Promise<FeedTemplateProp> => {
	const { product_id } = activity
	const darkdot = await resolveDarkdotApi()
	const product = await darkdot.findProductWithAllDetails(product_id as unknown as ProductId)
	
	const { extension } = product.product.struct

	const productData = await createProductData(product)
	if (extension.isSharedProduct) {
		const extProduct = await darkdot.findProductWithAllDetails(extension.asSharedProduct)

		const ext = await createProductData(extProduct)

		return { ...productData, ext }
	}

	return productData
}