"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockAccountBob = exports.mockAccountAlice = void 0;
const types_1 = require("@polkadot/types");
const registry_1 = require("@subsocial/types/src/substrate/registry");
exports.mockAccountAlice = new types_1.GenericAccountId(registry_1.registry, '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
exports.mockAccountBob = new types_1.GenericAccountId(registry_1.registry, '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty');
