CREATE SCHEMA IF NOT EXISTS df;

-- Create custom types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'action') THEN
        CREATE TYPE df.action AS ENUM (
            'StorefrontCreated',
            'StorefrontUpdated',
            'StorefrontFollowed',
            'StorefrontUnfollowed',
            'AccountFollowed',
            'AccountUnfollowed',
            'ProductCreated',
            'ProductUpdated',
            'ProductShared',
            'CommentCreated',
            'CommentUpdated',
            'CommentShared',
            'CommentDeleted',
            'CommentReplyCreated',
            'ProductReactionCreated',
            'ProductReactionUpdated',
            'CommentReactionCreated',
            'CommentReactionUpdated',
            'OrderingCreated',
            'OrderingUpdated'
        );
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS df.activities
(
    account varchar(48) NOT NULL,
    block_number bigint NOT NULL,
    event_index integer NOT NULL,
    event df.action NOT NULL,
    following_id varchar(48) NULL,
    storefront_id bigint NULL,
    product_id bigint NULL,
    ordering_id bigint NULL,
    comment_id bigint NULL,
    parent_comment_id bigint NULL,
    date TIMESTAMP NOT NULL DEFAULT NOW(),
    aggregated boolean NOT NULL DEFAULT true,
    agg_count bigint NOT NULL DEFAULT 0,
    PRIMARY KEY (block_number, event_index)
);

CREATE TABLE IF NOT EXISTS df.news_feed
(
    account varchar(48) NOT NULL,
    block_number bigint NOT NULL,
    event_index integer NOT NULL,
    FOREIGN KEY (block_number, event_index)
        REFERENCES df.activities(block_number, event_index)
);

CREATE TABLE IF NOT EXISTS df.notifications
(
    account varchar(48) NOT NULL,
    block_number bigint NOT NULL,
    event_index integer NOT NULL,
    FOREIGN KEY (block_number, event_index)
        REFERENCES df.activities(block_number, event_index)
);

CREATE TABLE IF NOT EXISTS df.notifications_counter
(
    account varchar(48) NOT NULL UNIQUE,
    last_read_block_number bigint NULL DEFAULT NULL,
    last_read_event_index integer NULL DEFAULT NULL,
    unread_count bigint NOT NULL DEFAULT 0,
    FOREIGN KEY (last_read_block_number, last_read_event_index)
        REFERENCES df.activities(block_number, event_index)
);

CREATE TABLE IF NOT EXISTS df.account_followers
(
    follower_account varchar(48) NOT NULL,
    following_account varchar(48) NOT NULL
);

CREATE TABLE IF NOT EXISTS df.storefront_followers
(
    follower_account varchar(48) NOT NULL,
    following_storefront_id bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS df.product_followers
(
    follower_account varchar(48) NOT NULL,
    following_product_id bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS df.comment_followers
(
    follower_account varchar(48) NOT NULL,
    following_comment_id bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS df.schema_version
(
    value integer DEFAULT 0 NOT NULL
);

INSERT INTO df.schema_version
(
    -- Note that the value '0' means a DEFAULT value of the "value" field.
    SELECT 0
    WHERE NOT EXISTS(SELECT * FROM df.schema_version)
);

CREATE INDEX IF NOT EXISTS idx_follower_account
ON df.account_followers(follower_account);

CREATE INDEX IF NOT EXISTS idx_following_account
ON df.account_followers(following_account);

CREATE INDEX IF NOT EXISTS idx_product_follower_account
ON df.product_followers(follower_account);

CREATE INDEX IF NOT EXISTS idx_storefront_follower_account
ON df.storefront_followers(follower_account);

CREATE INDEX IF NOT EXISTS idx_comment_follower_account
ON df.comment_followers(follower_account);

CREATE INDEX IF NOT EXISTS idx_following_product_id
ON df.product_followers(following_product_id);

CREATE INDEX IF NOT EXISTS idx_following_storefront_id
ON df.storefront_followers(following_storefront_id);

CREATE INDEX IF NOT EXISTS idx_following_comment_id
ON df.comment_followers(following_comment_id);

CREATE INDEX IF NOT EXISTS idx_account
ON df.activities(account);

CREATE INDEX IF NOT EXISTS idx_event
ON df.activities(event);

CREATE INDEX IF NOT EXISTS idx_following_id
ON df.activities(following_id);

CREATE INDEX IF NOT EXISTS idx_product_id
ON df.activities(product_id);

CREATE INDEX IF NOT EXISTS idx_storefront_id
ON df.activities(storefront_id);

CREATE INDEX IF NOT EXISTS idx_comment_id
ON df.activities(comment_id);

CREATE INDEX IF NOT EXISTS idx_parent_comment_id
ON df.activities(parent_comment_id);

CREATE INDEX IF NOT EXISTS idx_ordering_id
ON df.activities(ordering_id);

-- CREATE INDEX IF NOT EXISTS idx_aggregated
-- ON df.activities(aggregated);
