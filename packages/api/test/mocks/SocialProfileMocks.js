"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profilesData = exports.mockProfileDataBob = exports.mockContentBob = exports.mockProfileBob = exports.mockSocialAccountBob = exports.mockProfileDataAlice = exports.mockContentAlice = exports.mockProfileAlice = exports.mockSocialAccountAlice = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const AccountMocks_1 = require("./AccountMocks");
const alice_1 = __importDefault(require("./avatars/alice"));
const bob_1 = __importDefault(require("./avatars/bob"));
exports.mockSocialAccountAlice = {
    reputation: new bn_js_1.default(100),
    followers_count: new bn_js_1.default(23),
    following_spaces_count: new bn_js_1.default(15),
    following_accounts_count: new bn_js_1.default(122)
};
exports.mockProfileAlice = {
    username: 'alice',
    created: {
        account: AccountMocks_1.mockAccountAlice,
        block: new bn_js_1.default(12345),
        time: new bn_js_1.default(1586523823996)
    },
};
exports.mockContentAlice = {
    about: 'About of Alice',
    name: 'Alice Allison',
    avatar: alice_1.default
};
exports.mockProfileDataAlice = {
    struct: exports.mockSocialAccountAlice,
    profile: exports.mockProfileAlice,
    content: exports.mockContentAlice
};
exports.mockSocialAccountBob = {
    reputation: new bn_js_1.default(100),
    followers_count: new bn_js_1.default(23),
    following_spaces_count: new bn_js_1.default(15),
    following_accounts_count: new bn_js_1.default(122)
};
exports.mockProfileBob = {
    username: 'bobby',
    created: {
        account: AccountMocks_1.mockAccountBob,
        block: new bn_js_1.default(12345),
        time: new bn_js_1.default(1586523823996)
    },
};
exports.mockContentBob = {
    about: 'About of Bob',
    name: 'Bob Bobster',
    avatar: bob_1.default
};
exports.mockProfileDataBob = {
    struct: exports.mockSocialAccountBob,
    profile: exports.mockProfileBob,
    content: exports.mockContentBob
};
exports.profilesData = [
    exports.mockProfileDataAlice,
    exports.mockProfileDataBob
];
