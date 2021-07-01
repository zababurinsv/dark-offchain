"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockSpacesData = exports.mockSpaceDataBob = exports.mockSpaceDataAlice = exports.mockSpaceValidation = exports.mockSpaceJsonBob = exports.mockSpaceJson = exports.mockSpaceStructBob = exports.mockSpaceStruct = exports.mockSpaceId = void 0;
const U32_1 = __importDefault(require("@polkadot/types/primitive/U32"));
const registry_1 = require("@subsocial/types/src/substrate/registry");
const bn_js_1 = __importDefault(require("bn.js"));
const types_1 = require("@polkadot/types");
const AccountMocks_1 = require("./AccountMocks");
let _id = 0;
const nextId = () => new bn_js_1.default(_id++);
function newSpaceStructMock({ id = nextId(), account = AccountMocks_1.mockAccountAlice, handle, ipfs_hash = '', posts_count = 12, followers_count = 3456, edit_history = [], score = 678 }) {
    return {
        id: new bn_js_1.default(id),
        created: {
            account,
            block: new bn_js_1.default(12345),
            time: new bn_js_1.default(1586523823996)
        },
        updated: new types_1.Option(registry_1.registry, 'Null', null),
        owner: account,
        handle: new types_1.Option(registry_1.registry, 'Text', handle),
        ipfs_hash: ipfs_hash,
        posts_count: new bn_js_1.default(posts_count),
        followers_count: new bn_js_1.default(followers_count),
        edit_history: edit_history,
        score: new bn_js_1.default(score)
    };
}
exports.mockSpaceId = nextId();
exports.mockSpaceStruct = newSpaceStructMock({
    id: nextId(),
    account: AccountMocks_1.mockAccountAlice,
    handle: 'alice_in_chains',
    posts_count: 12,
    followers_count: 4561,
    score: 654
});
exports.mockSpaceStructBob = newSpaceStructMock({
    id: nextId(),
    account: AccountMocks_1.mockAccountBob,
    handle: 'bobster',
    posts_count: 0,
    followers_count: 43,
    score: 1
});
exports.mockSpaceJson = {
    name: 'Alice in Chains',
    about: 'Alice in Chains is an American rock band from Seattle, Washington, formed in 1987 by guitarist and vocalist Jerry Cantrell and drummer Sean Kinney, who later recruited bassist Mike Starr and lead vocalist Layne Staley. Starr was replaced by Mike Inez in 1993.',
    image: 'https://i.pinimg.com/originals/d1/dd/32/d1dd322177b1edf654be68644d427e74.jpg',
    tags: ['bitcoin', 'ethereum', 'polkadot'],
    navTabs: []
};
exports.mockSpaceJsonBob = {
    name: 'The Best Space You Can Ever Find on the Internet',
    about: 'In 2000 I set up a dot com web site called "the very best site ever" and on it carried pictures and descriptions of our worldwide holidays and our lives closer to home. However, I have learned that the webhosts have "lost" it. Time has moved on and it is being replaced by this space!',
    image: '',
    tags: [],
    navTabs: []
};
exports.mockSpaceValidation = {
    handleMinLen: new U32_1.default(registry_1.registry, 5),
    handleMaxLen: new U32_1.default(registry_1.registry, 50),
    spaceMaxLen: 500
};
exports.mockSpaceDataAlice = {
    struct: exports.mockSpaceStruct,
    content: exports.mockSpaceJson
};
exports.mockSpaceDataBob = {
    struct: exports.mockSpaceStructBob,
    content: exports.mockSpaceJsonBob
};
exports.mockSpacesData = [
    exports.mockSpaceDataAlice,
    exports.mockSpaceDataBob
];
