"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockPostsData = exports.mockCommentOnSharedPostData = exports.mockSharedCommentData = exports.mockCommentOnRegularPostData = exports.mockSharedPostData = exports.mockRegularPostData = exports.mockCommentOnSharedPostJson = exports.mockSharedCommentJson = exports.mockCommentOnRegularPostJson = exports.mockSharedPostJson = exports.mockRegularPostJson = exports.mockCommentOnSharedPostStruct = exports.mockSharedCommentStruct = exports.mockCommentOnRegularPostStruct = exports.mockSharedPostStruct = exports.mockRegularPostStruct = exports.commentIdOnSharedPost = exports.sharedCommentId = exports.commentIdOnRegularPost = exports.sharedPostId = exports.regularPostId = exports.mockPostId = void 0;
const types_1 = require("@polkadot/types");
const registry_1 = require("@subsocial/types/src/substrate/registry");
const bn_js_1 = __importDefault(require("bn.js"));
const AccountMocks_1 = require("./AccountMocks");
const classes_1 = require("@subsocial/types/src/substrate/classes");
let _id = 0;
const nextId = () => new bn_js_1.default(++_id);
const createPostId = (id) => new bn_js_1.default(id);
exports.mockPostId = nextId();
function newPostStructMock({ id = nextId(), account = AccountMocks_1.mockAccountAlice, ipfs_hash = '', space_id = new classes_1.OptionId(), extension = new classes_1.PostExtension({ RegularPost: new types_1.Null(registry_1.registry) }) }) {
    return {
        id: new bn_js_1.default(id),
        created: {
            account,
            block: new bn_js_1.default(12345),
            time: new bn_js_1.default(1586523823996)
        },
        ipfs_hash: ipfs_hash,
        space_id: space_id,
        extension: extension
    };
}
exports.regularPostId = createPostId(1);
exports.sharedPostId = createPostId(2);
exports.commentIdOnRegularPost = createPostId(3);
exports.sharedCommentId = createPostId(4);
exports.commentIdOnSharedPost = createPostId(5);
exports.mockRegularPostStruct = newPostStructMock({
    account: AccountMocks_1.mockAccountAlice,
    id: exports.regularPostId,
    space_id: new classes_1.OptionId(new bn_js_1.default(1)),
    extension: new classes_1.PostExtension({ RegularPost: new types_1.Null(registry_1.registry) })
});
exports.mockSharedPostStruct = newPostStructMock({
    account: AccountMocks_1.mockAccountBob,
    id: exports.sharedPostId,
    space_id: new classes_1.OptionId(new bn_js_1.default(2)),
    extension: new classes_1.PostExtension({ SharedPost: exports.regularPostId })
});
exports.mockCommentOnRegularPostStruct = newPostStructMock({
    account: AccountMocks_1.mockAccountAlice,
    id: exports.commentIdOnRegularPost,
    space_id: new classes_1.OptionId(),
    extension: new classes_1.PostExtension({ Comment: new classes_1.Comment({ parent_id: new classes_1.OptionId(), root_post_id: exports.regularPostId }) })
});
exports.mockSharedCommentStruct = newPostStructMock({
    account: AccountMocks_1.mockAccountBob,
    id: exports.sharedCommentId,
    space_id: new classes_1.OptionId(new bn_js_1.default(1)),
    extension: new classes_1.PostExtension({ SharedPost: exports.commentIdOnRegularPost })
});
exports.mockCommentOnSharedPostStruct = newPostStructMock({
    account: AccountMocks_1.mockAccountAlice,
    id: exports.commentIdOnSharedPost,
    space_id: new classes_1.OptionId(),
    extension: new classes_1.PostExtension({ Comment: new classes_1.Comment({ parent_id: new classes_1.OptionId(), root_post_id: exports.sharedPostId }) })
});
exports.mockRegularPostJson = {
    title: 'Example post',
    body: 'The most interesting content ever.',
    image: '',
    tags: ['bitcoin', 'ethereum', 'polkadot'],
    canonical: 'http://example.com'
};
exports.mockSharedPostJson = {
    body: 'The most interesting shared content ever.',
};
exports.mockCommentOnRegularPostJson = {
    body: 'The most interesting comment content ever.',
};
exports.mockSharedCommentJson = {
    body: 'The most interesting shared comment content ever.',
};
exports.mockCommentOnSharedPostJson = {
    body: 'The most interesting comment on shared post content ever.',
};
exports.mockRegularPostData = {
    struct: exports.mockRegularPostStruct,
    content: exports.mockRegularPostJson
};
exports.mockSharedPostData = {
    struct: exports.mockSharedPostStruct,
    content: exports.mockSharedPostJson
};
exports.mockCommentOnRegularPostData = {
    struct: exports.mockCommentOnRegularPostStruct,
    content: exports.mockCommentOnRegularPostJson
};
exports.mockSharedCommentData = {
    struct: exports.mockSharedCommentStruct,
    content: exports.mockSharedCommentJson
};
exports.mockCommentOnSharedPostData = {
    struct: exports.mockCommentOnSharedPostStruct,
    content: exports.mockCommentOnSharedPostJson
};
exports.mockPostsData = [
    exports.mockRegularPostData,
    exports.mockSharedPostData,
    exports.mockCommentOnRegularPostData,
    exports.mockSharedCommentData,
    exports.mockCommentOnSharedPostData
];
