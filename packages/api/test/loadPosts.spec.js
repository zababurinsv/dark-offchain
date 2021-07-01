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
const PostMocks_1 = require("./mocks/PostMocks");
const MocksDB_1 = require("./mocks/MocksDB");
const loadPostStructs_1 = require("../src/utils/loadPostStructs");
const methods = {
    findSpaces: MocksDB_1.findSpaces,
    findPosts: MocksDB_1.findPosts,
    findProfiles: MocksDB_1.findProfiles
};
const opts = { withOwner: true, withSpace: true };
test('Load regular and shared post', () => __awaiter(void 0, void 0, void 0, function* () {
    const ids = [PostMocks_1.regularPostId, PostMocks_1.sharedPostId];
    const posts = yield MocksDB_1.findPosts(ids);
    const results = yield loadPostStructs_1.loadAndSetPostRelatedStructs(posts, methods, opts);
    console.log('Regular and shared post: ', results);
    expect(results.length).toBe(posts.length);
}));
test('Load comment on regular and shared post, also shared comment post', () => __awaiter(void 0, void 0, void 0, function* () {
    const ids = [PostMocks_1.commentIdOnRegularPost, PostMocks_1.commentIdOnSharedPost, PostMocks_1.sharedCommentId];
    const posts = yield MocksDB_1.findPosts(ids);
    const results = yield loadPostStructs_1.loadAndSetPostRelatedStructs(posts, methods, opts);
    console.log('Comment and shared comment post: ', results);
    expect(results.length).toBe(posts.length);
}));
