export type NotificationTemplateProp = {
	date: string,
	ownerName: string,
	relatedEntityUrl: string,
	avatar: string,
	message: string,
	entityName: string,
	image?: string
}

export type FeedTemplateProp = {
	ownerName: string,
	avatar: string
	storefrontName: string,
	productTitle: string,
	productLink: string,
	productSummary: string,
	date: string,
	image?: string,
	ext?: FeedTemplateProp
}

export type ConfirmationProp = {
	link: string,
	message: string,
	image?: string,
	buttonText?: string
}


