// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { BTreeSet, Enum, Option, Struct, Text, Vec, bool, i32, u16, u32, u64, u8 } from '@polkadot/types';
import type { AccountId, Balance, BlockNumber, Moment } from '@polkadot/types/interfaces/runtime';

/** @name Address */
export interface Address extends AccountId {}

/** @name BountyIndex */
export interface BountyIndex extends u32 {}

/** @name Change */
export interface Change extends Struct {
  readonly created: WhoAndWhen;
  readonly id: ChangeId;
  readonly storefront_id: StorefrontId;
  readonly add_owners: Vec<AccountId>;
  readonly remove_owners: Vec<AccountId>;
  readonly new_threshold: Option<u16>;
  readonly notes: Text;
  readonly confirmed_by: Vec<AccountId>;
  readonly expires_at: BlockNumber;
}

/** @name ChangeId */
export interface ChangeId extends u64 {}

/** @name Comment */
export interface Comment extends Struct {
  readonly parent_id: Option<ProductId>;
  readonly root_product_id: ProductId;
}

/** @name Content */
export interface Content extends Enum {
  readonly isNone: boolean;
  readonly isRaw: boolean;
  readonly asRaw: Text;
  readonly isIpfs: boolean;
  readonly asIpfs: Text;
  readonly isHyper: boolean;
  readonly asHyper: Text;
}

/** @name Donation */
export interface Donation extends Struct {
  readonly id: DonationId;
  readonly created: WhoAndWhen;
  readonly recipient: DonationRecipient;
  readonly donation_wallet: AccountId;
  readonly amount: Balance;
  readonly comment_id: Option<ProductId>;
}

/** @name DonationId */
export interface DonationId extends u64 {}

/** @name DonationRecipient */
export interface DonationRecipient extends Enum {
  readonly isAccount: boolean;
  readonly asAccount: AccountId;
  readonly isStorefront: boolean;
  readonly asStorefront: StorefrontId;
  readonly isProduct: boolean;
  readonly asProduct: ProductId;
}

/** @name DonationSettings */
export interface DonationSettings extends Struct {
  readonly donations_allowed: bool;
  readonly min_amount: Option<Balance>;
  readonly max_amount: Option<Balance>;
}

/** @name DonationSettingsUpdate */
export interface DonationSettingsUpdate extends Struct {
  readonly donations_allowed: Option<bool>;
  readonly min_amount: Option<Option<Balance>>;
  readonly max_amount: Option<Option<Balance>>;
}

/** @name Drop */
export interface Drop extends Struct {
  readonly id: DropId;
  readonly first_drop_at: BlockNumber;
  readonly total_dropped: Balance;
}

/** @name DropId */
export interface DropId extends u64 {}

/** @name EntityId */
export interface EntityId extends Enum {
  readonly isContent: boolean;
  readonly asContent: Content;
  readonly isAccount: boolean;
  readonly asAccount: AccountId;
  readonly isStorefront: boolean;
  readonly asStorefront: StorefrontId;
  readonly isProduct: boolean;
  readonly asProduct: ProductId;
}

/** @name EntityStatus */
export interface EntityStatus extends Enum {
  readonly isAllowed: boolean;
  readonly isBlocked: boolean;
}

/** @name Faucet */
export interface Faucet extends Struct {
  readonly enabled: bool;
  readonly period: BlockNumber;
  readonly period_limit: Balance;
  readonly drip_limit: Balance;
  readonly next_period_at: BlockNumber;
  readonly dripped_in_current_period: Balance;
}

/** @name FaucetSettings */
export interface FaucetSettings extends Struct {
  readonly period: Option<BlockNumber>;
  readonly period_limit: Balance;
}

/** @name FaucetSettingsUpdate */
export interface FaucetSettingsUpdate extends Struct {
  readonly period: Option<Option<BlockNumber>>;
  readonly period_limit: Option<Balance>;
}

/** @name FaucetUpdate */
export interface FaucetUpdate extends Struct {
  readonly enabled: Option<bool>;
  readonly period: Option<BlockNumber>;
  readonly period_limit: Option<Balance>;
  readonly drip_limit: Option<Balance>;
}

/** @name IpfsCid */
export interface IpfsCid extends Text {}

/** @name LookupSource */
export interface LookupSource extends AccountId {}

/** @name Product */
export interface Product extends Struct {
  readonly id: ProductId;
  readonly created: WhoAndWhen;
  readonly updated: Option<WhoAndWhen>;
  readonly owner: AccountId;
  readonly extension: ProductExtension;
  readonly storefront_id: Option<StorefrontId>;
  readonly content: Content;
  readonly price: Option<u32>,
  readonly hidden: bool;
  readonly replies_count: u16;
  readonly hidden_replies_count: u16;
  readonly shares_count: u16;
  readonly upvotes_count: u16;
  readonly downvotes_count: u16;
  readonly score: i32;
}

/** @name ProductExtension */
export interface ProductExtension extends Enum {
  readonly isRegularProduct: boolean;
  readonly isComment: boolean;
  readonly asComment: Comment;
  readonly isSharedProduct: boolean;
  readonly asSharedProduct: ProductId;
}

/** @name ProductHistoryRecord */
export interface ProductHistoryRecord extends Struct {
  readonly edited: WhoAndWhen;
  readonly old_data: ProductUpdate;
}

/** @name ProductId */
export interface ProductId extends u64 {}

/** @name ProductUpdate */
export interface ProductUpdate extends Struct {
  readonly storefront_id: Option<StorefrontId>;
  readonly content: Option<Content>;
  readonly price: Option<u32>,
  readonly hidden: Option<bool>;
}

/** @name Prices */
export interface Prices extends Enum {}


/** @name OrderingId */
export interface OrderingId extends u64 {
}
/** @name Ordering */
export interface Ordering extends Struct {
  readonly id: OrderingId;
  readonly created: WhoAndWhen;
  readonly updated: Option<WhoAndWhen>;
  readonly owner: AccountId;
  readonly ordering_state: OrderingState;
  readonly ordering_total: Balance;
  readonly seller: AccountId;
  readonly buyer_escrow: Balance;
  readonly seller_escrow: Balance;
  readonly storefront_id: Option<StorefrontId>;
  readonly product_id: ProductId;
  readonly content: Content;
}


/** @name OrderingUpdate */
export interface OrderingUpdate extends Struct {
  readonly ordering_state: OrderingState;
  readonly content: Option<Content>;
}

/** @name OrderingState */
export interface OrderingState extends Enum {
  readonly isNew: boolean;
  readonly isPending: boolean;
  readonly isAccepted: boolean;
  readonly isRefused: boolean;
  readonly isShipped: boolean;
  readonly isComplete: boolean;
  readonly isRefunded: boolean;
  readonly isDispute: boolean;
  readonly isSlashedBuyer: boolean;
  readonly isSlashedSeller: boolean;
  readonly isSlashedBoth: boolean;
}

/** @name OrderingHistoryRecord */
export interface OrderingHistoryRecord extends Struct {
  readonly edited: WhoAndWhen;
  readonly old_data: OrderingUpdate;
}

/** @name Profile */
export interface Profile extends Struct {
  readonly created: WhoAndWhen;
  readonly updated: Option<WhoAndWhen>;
  readonly content: Content;
}

/** @name ProfileHistoryRecord */
export interface ProfileHistoryRecord extends Struct {
  readonly edited: WhoAndWhen;
  readonly old_data: ProfileUpdate;
}

/** @name ProfileUpdate */
export interface ProfileUpdate extends Struct {
  readonly content: Option<Content>;
}

/** @name Reaction */
export interface Reaction extends Struct {
  readonly id: ReactionId;
  readonly created: WhoAndWhen;
  readonly updated: Option<WhoAndWhen>;
  readonly kind: ReactionKind;
}

/** @name ReactionId */
export interface ReactionId extends u64 {}

/** @name ReactionKind */
export interface ReactionKind extends Enum {
  readonly isUpvote: boolean;
  readonly isDownvote: boolean;
}

/** @name RefCount */
export interface RefCount extends u8 {}

/** @name Report */
export interface Report extends Struct {
  readonly id: ReportId;
  readonly created: WhoAndWhen;
  readonly reported_entity: EntityId;
  readonly reported_within: StorefrontId;
  readonly reason: Content;
}

/** @name ReportId */
export interface ReportId extends u64 {}

/** @name Role */
export interface Role extends Struct {
  readonly created: WhoAndWhen;
  readonly updated: Option<WhoAndWhen>;
  readonly id: RoleId;
  readonly storefront_id: StorefrontId;
  readonly disabled: bool;
  readonly expires_at: Option<BlockNumber>;
  readonly content: Content;
  readonly permissions: StorefrontPermissionSet;
}

/** @name RoleId */
export interface RoleId extends u64 {}

/** @name RoleUpdate */
export interface RoleUpdate extends Struct {
  readonly disabled: Option<bool>;
  readonly content: Option<Content>;
  readonly permissions: Option<StorefrontPermissionSet>;
}

/** @name ScoringAction */
export interface ScoringAction extends Enum {
  readonly isUpvoteProduct: boolean;
  readonly isDownvoteProduct: boolean;
  readonly isShareProduct: boolean;
  readonly isCreateComment: boolean;
  readonly isUpvoteComment: boolean;
  readonly isDownvoteComment: boolean;
  readonly isShareComment: boolean;
  readonly isFollowStorefront: boolean;
  readonly isFollowAccount: boolean;
}

/** @name SessionKey */
export interface SessionKey extends Struct {
  readonly created: WhoAndWhen;
  readonly updated: Option<WhoAndWhen>;
  readonly expires_at: BlockNumber;
  readonly limit: Option<Balance>;
  readonly spent: Balance;
}

/** @name SocialAccount */
export interface SocialAccount extends Struct {
  readonly followers_count: u32;
  readonly following_accounts_count: u16;
  readonly following_storefronts_count: u16;
  readonly reputation: u32;
  readonly profile: Option<Profile>;
}

/** @name Storefront */
export interface Storefront extends Struct {
  readonly id: StorefrontId;
  readonly created: WhoAndWhen;
  readonly updated: Option<WhoAndWhen>;
  readonly owner: AccountId;
  readonly parent_id: Option<StorefrontId>;
  readonly handle: Option<Text>;
  readonly content: Content;
  readonly hidden: bool;
  readonly products_count: u32;
  readonly hidden_products_count: u32;
  readonly followers_count: u32;
  readonly score: i32;
  readonly permissions: Option<StorefrontPermissions>;
}

/** @name StorefrontHistoryRecord */
export interface StorefrontHistoryRecord extends Struct {
  readonly edited: WhoAndWhen;
  readonly old_data: StorefrontUpdate;
}

/** @name StorefrontId */
export interface StorefrontId extends u64 {}

/** @name StorefrontModerationSettings */
export interface StorefrontModerationSettings extends Struct {
  readonly autoblock_threshold: Option<u16>;
}

/** @name StorefrontModerationSettingsUpdate */
export interface StorefrontModerationSettingsUpdate extends Struct {
  readonly autoblock_threshold: Option<Option<u16>>;
}

/** @name StorefrontOwners */
export interface StorefrontOwners extends Struct {
  readonly created: WhoAndWhen;
  readonly storefront_id: StorefrontId;
  readonly owners: Vec<AccountId>;
  readonly threshold: u16;
  readonly changes_count: u16;
}

/** @name StorefrontPermission */
export interface StorefrontPermission extends Enum {
  readonly isManageRoles: boolean;
  readonly isRepresentStorefrontInternally: boolean;
  readonly isRepresentStorefrontExternally: boolean;
  readonly isUpdateStorefront: boolean;
  readonly isCreateSubstorefronts: boolean;
  readonly isUpdateOwnSubstorefronts: boolean;
  readonly isDeleteOwnSubstorefronts: boolean;
  readonly isHideOwnSubstorefronts: boolean;
  readonly isUpdateAnySubstorefront: boolean;
  readonly isDeleteAnySubstorefront: boolean;
  readonly isHideAnySubstorefront: boolean;
  readonly isCreateProducts: boolean;
  readonly isUpdateOwnProducts: boolean;
  readonly isDeleteOwnProducts: boolean;
  readonly isHideOwnProducts: boolean;
  readonly isUpdateAnyProduct: boolean;
  readonly isDeleteAnyProduct: boolean;
  readonly isHideAnyProduct: boolean;
  readonly isCreateComments: boolean;
  readonly isUpdateOwnComments: boolean;
  readonly isDeleteOwnComments: boolean;
  readonly isHideOwnComments: boolean;
  readonly isHideAnyComment: boolean;
  readonly isUpvote: boolean;
  readonly isDownvote: boolean;
  readonly isShare: boolean;
  readonly isOverrideSubstorefrontPermissions: boolean;
  readonly isOverrideProductPermissions: boolean;
  readonly isSuggestEntityStatus: boolean;
  readonly isUpdateEntityStatus: boolean;
  readonly isUpdateStorefrontSettings: boolean;
}

/** @name StorefrontPermissions */
export interface StorefrontPermissions extends Struct {
  readonly none: Option<StorefrontPermissionSet>;
  readonly everyone: Option<StorefrontPermissionSet>;
  readonly follower: Option<StorefrontPermissionSet>;
  readonly storefront_owner: Option<StorefrontPermissionSet>;
}

/** @name StorefrontPermissionsContext */
export interface StorefrontPermissionsContext extends Struct {
  readonly storefront_id: StorefrontId;
  readonly is_storefront_owner: bool;
  readonly is_storefront_follower: bool;
  readonly storefront_perms: Option<StorefrontPermissions>;
}

/** @name StorefrontPermissionSet */
export interface StorefrontPermissionSet extends BTreeSet<StorefrontPermission> {}

/** @name StorefrontUpdate */
export interface StorefrontUpdate extends Struct {
  readonly parent_id: Option<Option<StorefrontId>>;
  readonly handle: Option<Option<Text>>;
  readonly content: Option<Content>;
  readonly hidden: Option<bool>;
  readonly permissions: Option<Option<StorefrontPermissions>>;
}

/** @name Subscription */
export interface Subscription extends Struct {
  readonly id: SubscriptionPlanId;
  readonly created: WhoAndWhen;
  readonly updated: Option<WhoAndWhen>;
  readonly is_active: bool;
  readonly wallet: Option<AccountId>;
  readonly plan_id: SubscriptionPlanId;
}

/** @name SubscriptionId */
export interface SubscriptionId extends u64 {}

/** @name SubscriptionPeriod */
export interface SubscriptionPeriod extends Enum {
  readonly isDaily: boolean;
  readonly isWeekly: boolean;
  readonly isMonthly: boolean;
  readonly isQuarterly: boolean;
  readonly isYearly: boolean;
  readonly isCustom: boolean;
  readonly asCustom: BlockNumber;
}

/** @name SubscriptionPlan */
export interface SubscriptionPlan extends Struct {
  readonly id: SubscriptionPlanId;
  readonly created: WhoAndWhen;
  readonly updated: Option<WhoAndWhen>;
  readonly is_active: bool;
  readonly content: Content;
  readonly storefront_id: StorefrontId;
  readonly wallet: Option<AccountId>;
  readonly price: Balance;
  readonly period: SubscriptionPeriod;
}

/** @name SubscriptionPlanId */
export interface SubscriptionPlanId extends u64 {}

/** @name SuggestedStatus */
export interface SuggestedStatus extends Struct {
  readonly suggested: WhoAndWhen;
  readonly status: Option<EntityStatus>;
  readonly report_id: Option<ReportId>;
}

/** @name User */
export interface User extends Enum {
  readonly isAccount: boolean;
  readonly asAccount: AccountId;
  readonly isStorefront: boolean;
  readonly asStorefront: StorefrontId;
}

/** @name WhoAndWhen */
export interface WhoAndWhen extends Struct {
  readonly account: AccountId;
  readonly block: BlockNumber;
  readonly time: Moment;
}

export type PHANTOM_SUBSOCIAL = 'darkdot';
