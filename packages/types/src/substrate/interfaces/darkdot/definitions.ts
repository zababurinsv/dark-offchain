export default {
  types: {
    Address: 'MultiAddress',
    LookupSource: 'MultiAddress',
    RefCount: 'u8',
    IpfsCid: 'Text',
    DonationId: 'u64',
    BountyIndex: 'u32',
    DonationRecipient: {
      _enum: {
        Account: 'AccountId',
        Storefront: 'StorefrontId',
        Product: 'ProductId'
      }
    },
    Donation: {
      id: 'DonationId',
      created: 'WhoAndWhen',
      recipient: 'DonationRecipient',
      donation_wallet: 'AccountId',
      amount: 'Balance',
      comment_id: 'Option<ProductId>'
    },
    DonationSettings: {
      donations_allowed: 'bool',
      min_amount: 'Option<Balance>',
      max_amount: 'Option<Balance>'
    },
    DonationSettingsUpdate: {
      donations_allowed: 'Option<bool>',
      min_amount: 'Option<Option<Balance>>',
      max_amount: 'Option<Option<Balance>>'
    },
    DropId: 'u64',
    Drop: {
      id: 'DropId',
      first_drop_at: 'BlockNumber',
      total_dropped: 'Balance'
    },
    FaucetSettings: {
      period: 'Option<BlockNumber>',
      period_limit: 'Balance'
    },
    FaucetSettingsUpdate: {
      period: 'Option<Option<BlockNumber>>',
      period_limit: 'Option<Balance>'
    },
    ReportId: 'u64',
    EntityId: {
      _enum: {
        Content: 'Content',
        Account: 'AccountId',
        Storefront: 'StorefrontId',
        Product: 'ProductId',
        Ordering: 'OrderingId'
      }
    },
    EntityStatus: {
      _enum: [
        'Allowed',
        'Blocked'
      ]
    },
    Report: {
      id: 'ReportId',
      created: 'WhoAndWhen',
      reported_entity: 'EntityId',
      reported_within: 'StorefrontId',
      reason: 'Content'
    },
    SuggestedStatus: {
      suggested: 'WhoAndWhen',
      status: 'Option<EntityStatus>',
      report_id: 'Option<ReportId>'
    },
    StorefrontModerationSettings: {
      autoblock_threshold: 'Option<u16>'
    },
    StorefrontModerationSettingsUpdate: {
      autoblock_threshold: 'Option<Option<u16>>'
    },
    StorefrontPermissionSet: 'BTreeSet<StorefrontPermission>',
    StorefrontPermission: {
      _enum: [
        'ManageRoles',
        'RepresentStorefrontInternally',
        'RepresentStorefrontExternally',
        'UpdateStorefront',
        'CreateSubstorefronts',
        'UpdateOwnSubstorefronts',
        'DeleteOwnSubstorefronts',
        'HideOwnSubstorefronts',
        'UpdateAnySubstorefront',
        'DeleteAnySubstorefront',
        'HideAnySubstorefront',
        'CreateProducts',
        'UpdateOwnProducts',
        'DeleteOwnProducts',
        'HideOwnProducts',
        'UpdateAnyProduct',
        'DeleteAnyProduct',
        'HideAnyProduct',
        'CreateComments',
        'UpdateOwnComments',
        'DeleteOwnComments',
        'HideOwnComments',
        'HideAnyComment',
        'Upvote',
        'Downvote',
        'Share',
        'OverrideSubstorefrontPermissions',
        'OverrideProductPermissions',
        'SuggestEntityStatus',
        'UpdateEntityStatus',
        'UpdateStorefrontSettings'
      ]
    },
    StorefrontPermissions: {
      none: 'Option<StorefrontPermissionSet>',
      everyone: 'Option<StorefrontPermissionSet>',
      follower: 'Option<StorefrontPermissionSet>',
      storefront_owner: 'Option<StorefrontPermissionSet>'
    },
    StorefrontPermissionsContext: {
      storefront_id: 'StorefrontId',
      is_storefront_owner: 'bool',
      is_storefront_follower: 'bool',
      storefront_perms: 'Option<StorefrontPermissions>'
    },
    ProductHistoryRecord: {
      edited: 'WhoAndWhen',
      old_data: 'ProductUpdate'
    },
    ProductId: 'u64',
    Product: {
      id: 'ProductId',
      created: 'WhoAndWhen',
      updated: 'Option<WhoAndWhen>',
      owner: 'AccountId',
      extension: 'ProductExtension',
      storefront_id: 'Option<StorefrontId>',
      price: 'Option<u32>',
      content: 'Content',
      hidden: 'bool',
      replies_count: 'u16',
      hidden_replies_count: 'u16',
      shares_count: 'u16',
      upvotes_count: 'u16',
      downvotes_count: 'u16',
      score: 'i32'
    },
    ProductUpdate: {
      storefront_id: 'Option<StorefrontId>',
      price: 'Option<u32>',
      content: 'Option<Content>',
      hidden: 'Option<bool>'
    },
    ProductExtension: {
      _enum: {
        RegularProduct: 'Null',
        Comment: 'Comment',
        SharedProduct: 'ProductId'
      }
    },
    Prices: 'VecDeque<u32>',
    OrderingId: 'u64',
    Ordering: {
      id: 'OrderingId',
      created: 'WhoAndWhen',
      updated: 'Option<WhoAndWhen>',
      owner: 'AccountId',
      ordering_state: 'OrderingState',
      ordering_total: 'Balance',
      seller: 'AccountId',
      buyer_escrow: 'Balance',
      seller_escrow: 'Balance',
      storefront_id: 'Option<StorefrontId>',
      product_id: 'ProductId',
      content: 'Content'
  
    },
    OrderingUpdate: {
      content: 'Option<Content>',
      ordering_state: 'OrderingState'
    },
    OrderingState: {
      _enum: [
        'New',
        'Pending',
        'Accepted',
        'Refused',
        'Shipped',
        'Complete',
        'Refunded',
        'Dispute',
        'SlashedBuyer',
        'SlashedSeller',
        'SlashedBoth'
      ]
    },
    OrderingHistoryRecord: {
      edited: 'WhoAndWhen',
      old_data: 'OrderingUpdate'
    },

    Comment: {
      parent_id: 'Option<ProductId>',
      root_product_id: 'ProductId'
    },
    ProfileHistoryRecord: {
      edited: 'WhoAndWhen',
      old_data: 'ProfileUpdate'
    },
    SocialAccount: {
      followers_count: 'u32',
      following_accounts_count: 'u16',
      following_storefronts_count: 'u16',
      reputation: 'u32',
      profile: 'Option<Profile>'
    },
    Profile: {
      created: 'WhoAndWhen',
      updated: 'Option<WhoAndWhen>',
      content: 'Content'
    },
    ProfileUpdate: {
      content: 'Option<Content>'
    },
    ReactionId: 'u64',
    ReactionKind: {
      _enum: [
        'Upvote',
        'Downvote'
      ]
    },
    Reaction: {
      id: 'ReactionId',
      created: 'WhoAndWhen',
      updated: 'Option<WhoAndWhen>',
      kind: 'ReactionKind'
    },
    RoleId: 'u64',
    Role: {
      created: 'WhoAndWhen',
      updated: 'Option<WhoAndWhen>',
      id: 'RoleId',
      storefront_id: 'StorefrontId',
      disabled: 'bool',
      expires_at: 'Option<BlockNumber>',
      content: 'Content',
      permissions: 'StorefrontPermissionSet'
    },
    RoleUpdate: {
      disabled: 'Option<bool>',
      content: 'Option<Content>',
      permissions: 'Option<StorefrontPermissionSet>'
    },
    ScoringAction: {
      _enum: [
        'UpvoteProduct',
        'DownvoteProduct',
        'ShareProduct',
        'CreateComment',
        'UpvoteComment',
        'DownvoteComment',
        'ShareComment',
        'FollowStorefront',
        'FollowAccount'
      ]
    },
    SessionKey: {
      created: 'WhoAndWhen',
      updated: 'Option<WhoAndWhen>',
      expires_at: 'BlockNumber',
      limit: 'Option<Balance>',
      spent: 'Balance'
    },
    StorefrontHistoryRecord: {
      edited: 'WhoAndWhen',
      old_data: 'StorefrontUpdate'
    },
    Storefront: {
      id: 'StorefrontId',
      created: 'WhoAndWhen',
      updated: 'Option<WhoAndWhen>',
      owner: 'AccountId',
      parent_id: 'Option<StorefrontId>',
      handle: 'Option<Text>',
      content: 'Content',
      hidden: 'bool',
      products_count: 'u32',
      hidden_products_count: 'u32',
      followers_count: 'u32',
      score: 'i32',
      permissions: 'Option<StorefrontPermissions>'
    },
    StorefrontUpdate: {
      parent_id: 'Option<Option<StorefrontId>>',
      handle: 'Option<Option<Text>>',
      content: 'Option<Content>',
      hidden: 'Option<bool>',
      permissions: 'Option<Option<StorefrontPermissions>>'
    },
    SubscriptionPlanId: 'u64',
    SubscriptionId: 'u64',
    SubscriptionPeriod: {
      _enum: {
        Daily: 'Null',
        Weekly: 'Null',
        Monthly: 'Null',
        Quarterly: 'Null',
        Yearly: 'Null',
        Custom: 'BlockNumber'
      }
    },
    SubscriptionPlan: {
      id: 'SubscriptionPlanId',
      created: 'WhoAndWhen',
      updated: 'Option<WhoAndWhen>',
      is_active: 'bool',
      content: 'Content',
      storefront_id: 'StorefrontId',
      wallet: 'Option<AccountId>',
      price: 'Balance',
      period: 'SubscriptionPeriod'
    },
    Subscription: {
      id: 'SubscriptionPlanId',
      created: 'WhoAndWhen',
      updated: 'Option<WhoAndWhen>',
      is_active: 'bool',
      wallet: 'Option<AccountId>',
      plan_id: 'SubscriptionPlanId'
    },
    StorefrontId: 'u64',
    WhoAndWhen: {
      account: 'AccountId',
      block: 'BlockNumber',
      time: 'Moment'
    },
    User: {
      _enum: {
        Account: 'AccountId',
        Storefront: 'StorefrontId'
      }
    },
    Content: {
      _enum: {
        None: 'Null',
        Raw: 'Text',
        IPFS: 'Text',
        Hyper: 'Text'
      }
    },
    Faucet: {
      enabled: 'bool',
      period: 'BlockNumber',
      period_limit: 'Balance',
      drip_limit: 'Balance',
  
      next_period_at: 'BlockNumber',
      dripped_in_current_period: 'Balance'
    },
  
    FaucetUpdate: {
      enabled: 'Option<bool>',
      period: 'Option<BlockNumber>',
      period_limit: 'Option<Balance>',
      drip_limit: 'Option<Balance>'
    },
    ChangeId: 'u64',
  
    StorefrontOwners: {
      created: 'WhoAndWhen',
      storefront_id: 'StorefrontId',
      owners: 'Vec<AccountId>',
      threshold: 'u16',
      changes_count: 'u16'
    },
    Change: {
      created: 'WhoAndWhen',
      id: 'ChangeId',
      storefront_id: 'StorefrontId',
      add_owners: 'Vec<AccountId>',
      remove_owners: 'Vec<AccountId>',
      new_threshold: 'Option<u16>',
      notes: 'Text',
      confirmed_by: 'Vec<AccountId>',
      expires_at: 'BlockNumber'
    }
  }
}
