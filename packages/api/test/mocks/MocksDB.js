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
exports.findSpaces = exports.findProfiles = exports.findPosts = void 0;
const PostMocks_1 = require("./PostMocks");
const SpaceMocks_1 = require("./SpaceMocks");
const SocialProfileMocks_1 = require("./SocialProfileMocks");
const utils_1 = require("@subsocial/utils");
const mockPosts = new Map();
PostMocks_1.mockPostsData.forEach(x => mockPosts.set(x.struct.id.toString(), x));
const mockSpaces = new Map();
SpaceMocks_1.mockSpacesData.forEach(x => mockSpaces.set(x.struct.id.toString(), x));
const mockProfiles = new Map();
SocialProfileMocks_1.profilesData.forEach(x => {
    var _a;
    const idStr = (_a = x.profile) === null || _a === void 0 ? void 0 : _a.created.account.toString();
    idStr && mockProfiles.set(idStr, x);
});
function findPosts({ ids }) {
    return __awaiter(this, void 0, void 0, function* () {
        const posts = ids.map(id => mockPosts.get(id.toString()));
        return posts.filter(utils_1.isDefined);
    });
}
exports.findPosts = findPosts;
function findProfiles(ids) {
    return __awaiter(this, void 0, void 0, function* () {
        const profiles = ids.map(id => mockProfiles.get(id.toString()));
        return profiles.filter(utils_1.isDefined);
    });
}
exports.findProfiles = findProfiles;
function findSpaces({ ids }) {
    return __awaiter(this, void 0, void 0, function* () {
        const spaces = ids.map(id => mockSpaces.get(id.toString()));
        return spaces.filter(utils_1.isDefined);
    });
}
exports.findSpaces = findSpaces;
