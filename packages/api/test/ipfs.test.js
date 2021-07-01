"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ipfs_1 = require("../src/ipfs");
const ipfs = new ipfs_1.SubsocialIpfsApi({
    ipfsNodeUrl: 'http://localhost:8080',
    offchainUrl: 'http://localhost:3001'
});
const cids = new Map();
const spaceContent = {
    name: 'Test Space',
    about: 'Space about',
    image: 'https://www.jisc.ac.uk/sites/default/files/spaceging.jpg',
    tags: ['space_tag_1', 'space_tag_2']
};
const postContent = {
    title: 'Test Post',
    body: 'Post body',
    canonical: 'http://original.acticle.com',
    image: 'https://www.petpaw.com.au/wp-content/uploads/2013/02/Tonkinese-cute-cat-1030x772.jpg',
    tags: ['post_tag_1', 'post_tag_2']
};
const commentContent = {
    body: 'Cool Comment'
};
test('Save a space to IPFS', () => __awaiter(void 0, void 0, void 0, function* () {
    const hash = yield ipfs.saveSpace(spaceContent);
    cids.set('Space', hash);
    expect(typeof hash).toBe('string');
}));
test('Save a post to IPFS', () => __awaiter(void 0, void 0, void 0, function* () {
    const hash = yield ipfs.savePost(postContent);
    cids.set('Post', hash);
    expect(typeof hash).toBe('string');
}));
test('Save a comment to IPFS', () => __awaiter(void 0, void 0, void 0, function* () {
    const hash = yield ipfs.saveComment(commentContent);
    cids.set('Comment', hash);
    expect(typeof hash).toBe('string');
}));
test('Load a space from IPFS', () => __awaiter(void 0, void 0, void 0, function* () {
    const struct = yield ipfs.findSpace(cids.get('Space'));
    expect(struct).toEqual(spaceContent);
}));
test('Load a post from IPFS', () => __awaiter(void 0, void 0, void 0, function* () {
    const struct = yield ipfs.findPost(cids.get('Post'));
    expect(struct).toEqual(postContent);
}));
test('Load a comment from IPFS', () => __awaiter(void 0, void 0, void 0, function* () {
    const struct = yield ipfs.findComment(cids.get('Comment'));
    expect(struct).toEqual(commentContent);
}));
