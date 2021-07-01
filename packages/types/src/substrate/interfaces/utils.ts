import { AccountId } from '@polkadot/types/interfaces';
import BN from 'bn.js';
import { StorefrontId, ProductId, Ordering, OrderingId, Storefront, Product, ReactionId } from '.';
import { SocialAccountWithId } from '../../dto';

export type SubstrateId = StorefrontId | ProductId | OrderingId | BN;
export type CommonStruct = Storefront | Product | Ordering | SocialAccountWithId;
export type AnyAccountId = AccountId | string;
export type AnyStorefrontId = StorefrontId | BN;
export type AnyProductId = ProductId | BN;
export type AnyOrderingId = ProductId | BN;
export type AnyReactionId = ReactionId | BN;
