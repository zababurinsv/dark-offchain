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
const substrate_1 = require("../src/substrate");
const bn_js_1 = __importDefault(require("bn.js"));
const ipfs_1 = require("../src/ipfs");
let spaceHash;
const ipfs = new ipfs_1.SubsocialIpfsApi({
    ipfsNodeUrl: 'http://localhost:8080',
    offchainUrl: 'http:localhost:3001'
});
test('Get a space from Substrate', () => __awaiter(void 0, void 0, void 0, function* () {
    const api = yield substrateConnect_1.getApi();
    const spaceId = new bn_js_1.default(1);
    const substrate = new substrate_1.SubsocialSubstrateApi(api);
    const space = yield substrate.findSpace(spaceId);
    spaceHash = space === null || space === void 0 ? void 0 : space.ipfs_hash.toString();
    expect(typeof space !== 'undefined').toBe(true);
}));
test('Get a space from IPFS', () => __awaiter(void 0, void 0, void 0, function* () {
    const space = spaceHash && (yield ipfs.findSpace(spaceHash));
    console.log(space);
    expect(typeof space).toBe('object');
}));
