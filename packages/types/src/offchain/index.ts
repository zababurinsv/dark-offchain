import CID from 'cids'
import { IpfsCid as RuntimeIpfsCid } from '../substrate/interfaces'

export { CID }

export type CommonContent =
  CommentContent |
  ProductContent |
  StorefrontContent |
  ProfileContent |
  OrderingContent | 
  SharedProductContent

export type Activity = {
  account: string
  block_number: string
  event_index: number
  event: EventsName
  /** Account id. */
  following_id?: string
  storefront_id?: string
  product_id?: string
  comment_id?: string
  ordering_id?: string
  /** Date of this activity. Example: "2020-12-03T19:22:36.000Z" */
  date: string
  aggregated: boolean
  agg_count: number
}

type FilterByTags = {
  data: string[]
}

type Url = {
  data: string
}

type NavTabContent = FilterByTags | Url

type ContentType = 'by-tag' | 'url'

export type NavTab = {
  id: number
  type: ContentType
  content: NavTabContent
  title: string
  description: string
  hidden: boolean
}

export type NamedLink = {
  name: string
  url?: string
}

export type StorefrontContent = {
  name: string
  about: string
  image: string
  email: string
  tags: string[]
  links: string[] | NamedLink[]
  navTabs?: NavTab[]
}

export type SharedProductContent = {
  body: string
}

export type ProposalContent = {
  network: 'kusama' | 'polkadot'
  proposalIndex: number
}

export type ProductExt = {
  proposal?: ProposalContent
}

export type ProductContent = SharedProductContent & {
  title: string;
  price: string;
  image: string;
  tags: string[];
  canonical: string;
  variations: string[];
  bescrow: string;
  sescrow: string;
  shipcost: string;
  shipsto: string;
  size: string;
  color: string;
  weight: string;
  ext?: ProductExt;
}

export declare type OrderingContent =  {
  body: string;
  address1: string;
  address2: string;
  postal_code: string;
  city: string;
  country: string;
  send_proof_image: string;
  email: string;
  bescrow: string,
  sescrow: string,
  orderingcontent_state: string;
  orderingcontent_total: string;
  links: string[] | NamedLink[];
};


export type CommentContent = {
  body: string
}

export type ProfileContent = {
  name: string
  avatar: string
  about: string
}

export type IpfsCid = string | CID | RuntimeIpfsCid

export type EventsName =
  'AccountFollowed' |
  'StorefrontFollowed' |
  'StorefrontCreated' |
  'CommentCreated' |
  'CommentReplyCreated' |
  'ProductCreated' |
  'ProductShared' |
  'CommentShared' |
  'ProductReactionCreated' |
  'OrderingCreated' |
  'CommentReactionCreated'

export type Counts = {
  productsCount: number
  commentsCount: number
  orderingsCount: number
  reactionsCount: number
  followsCount: number
  storefrontsCount: number
  activitiesCount: number
}
