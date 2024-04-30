"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faucetClient = exports.aptosClient = exports.FAUCET_URL = exports.NODE_URL = exports.DEVNET_FAUCET_URL = exports.LOCAL_FAUCET_URL = exports.DEVNET_NODE_URL = exports.LOCAL_NODE_URL = exports.WEBWALLET_URL = void 0;
const aptos_1 = require("aptos");
exports.WEBWALLET_URL = 'https://hippo-wallet-test.web.app';
// export const WEBWALLET_URL = 'http://localhost:3030';
exports.LOCAL_NODE_URL = 'http://127.0.0.1:8080';
exports.DEVNET_NODE_URL = 'https://fullnode.devnet.aptoslabs.com/v1';
exports.LOCAL_FAUCET_URL = 'http://127.0.0.1:8081';
exports.DEVNET_FAUCET_URL = 'https://faucet.devnet.aptoslabs.com';
exports.NODE_URL = exports.DEVNET_NODE_URL;
exports.FAUCET_URL = exports.DEVNET_FAUCET_URL;
exports.aptosClient = new aptos_1.AptosClient(exports.NODE_URL);
exports.faucetClient = new aptos_1.FaucetClient(exports.NODE_URL, exports.FAUCET_URL);
//# sourceMappingURL=aptosConstants.js.map