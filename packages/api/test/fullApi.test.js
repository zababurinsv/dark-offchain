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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const substrateConnect_1 = require("../src/substrateConnect");
const fullApi_1 = require("../src/fullApi");
const bn_js_1 = __importDefault(require("bn.js"));
// NOTE: To run this test pack you need to have Substrate node, IPFS node
// and Offchain app running at locally the next URLs:
const ipfsNodeUrl = 'http://localhost:8080';
const offchainUrl = 'http://localhost:3001';
test('Find a space in Substrate and IPFS', () => __awaiter(void 0, void 0, void 0, function* () {
    const substrateApi = yield substrateConnect_1.getApi();
    const spaceId = new bn_js_1.default(1);
    const api = new fullApi_1.SubsocialApi({ substrateApi, ipfsNodeUrl, offchainUrl });
    const space = yield api.findSpace(spaceId);
    console.log('Found space:', Object.assign({}, space));
    expect(space.struct.id.toString()).toBe(spaceId.toString());
}));
test('Find a shared post in Substrate and IPFS', () => __awaiter(void 0, void 0, void 0, function* () {
    const substrateApi = yield substrateConnect_1.getApi();
    const postId = new bn_js_1.default(2);
    const api = new fullApi_1.SubsocialApi({ substrateApi, ipfsNodeUrl, offchainUrl });
    const extPostData = yield api.findPostWithAllDetails(postId);
    console.log('Found a PostData of extension:', Object.assign({}, extPostData));
    expect(extPostData.post.struct.id.toString()).toBe(postId.toString());
}));
