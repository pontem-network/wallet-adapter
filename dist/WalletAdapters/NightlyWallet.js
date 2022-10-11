"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.NightlyWalletAdapter = exports.NightlyWalletName = exports.AptosPublicKey = exports.NightlyWallet = void 0;
const NightlyWallet = () => { };
exports.NightlyWallet = NightlyWallet;
const SHA3 = __importStar(require("js-sha3"));
const errors_1 = require("../WalletProviders/errors");
const BaseAdapter_1 = require("./BaseAdapter");
class AptosPublicKey {
    constructor(hexString) {
        if (hexString.startsWith('0x')) {
            this.hexString = hexString;
        }
        else {
            this.hexString = `0x${hexString}`;
        }
    }
    static default() {
        return new AptosPublicKey('0'.repeat(64));
    }
    address() {
        const hash = SHA3.sha3_256.create();
        hash.update(Buffer.from(this.asPureHex(), 'hex'));
        hash.update('\x00');
        return '0x' + hash.hex();
    }
    asUint8Array() {
        return new Uint8Array(Buffer.from(this.asPureHex(), 'hex'));
    }
    asString() {
        return this.hexString;
    }
    asPureHex() {
        return this.hexString.substr(2);
    }
}
exports.AptosPublicKey = AptosPublicKey;
exports.NightlyWalletName = 'Nightly';
class NightlyWalletAdapter extends BaseAdapter_1.BaseWalletAdapter {
    constructor({ 
    // provider,
    // network = WalletAdapterNetwork.Testnet,
    timeout = 10000 } = {}) {
        var _a;
        super();
        this.name = exports.NightlyWalletName;
        this.url = 'https://chrome.google.com/webstore/detail/nightly/fiikommddbeccaoicoejoniammnalkfa/related?hl=en&authuser=0';
        this.icon = 'https://lh3.googleusercontent.com/_feXM9qulMM5w9BYMLzMpZrxW2WlBmdyg3SbETIoRsHdAD9PANnLCEPabC7lzEK0N8fOyyvFkY3746jk8l73zUErxhU=w128-h128-e365-rj-sc0x00ffffff';
        this._readyState = typeof window === 'undefined' || typeof document === 'undefined'
            ? BaseAdapter_1.WalletReadyState.Unsupported
            : BaseAdapter_1.WalletReadyState.NotDetected;
        this._provider = (_a = window.nightly) === null || _a === void 0 ? void 0 : _a.aptos;
        this._network = undefined;
        this._timeout = timeout;
        this._connecting = false;
        this._wallet = null;
        if (this._readyState !== BaseAdapter_1.WalletReadyState.Unsupported) {
            (0, BaseAdapter_1.scopePollingDetectionStrategy)(() => {
                var _a;
                if ((_a = window.nightly) === null || _a === void 0 ? void 0 : _a.aptos) {
                    this._readyState = BaseAdapter_1.WalletReadyState.Installed;
                    this.emit('readyStateChange', this._readyState);
                    return true;
                }
                return false;
            });
        }
    }
    get publicAccount() {
        var _a, _b, _c;
        return {
            publicKey: ((_a = this._wallet) === null || _a === void 0 ? void 0 : _a.publicKey) || null,
            address: ((_b = this._wallet) === null || _b === void 0 ? void 0 : _b.address) || null,
            authKey: ((_c = this._wallet) === null || _c === void 0 ? void 0 : _c.authKey) || null
        };
    }
    get network() {
        return {
            name: this._network,
            api: this._api,
            chainId: this._chainId
        };
    }
    get connecting() {
        return this._connecting;
    }
    get connected() {
        var _a;
        return !!((_a = this._wallet) === null || _a === void 0 ? void 0 : _a.isConnected);
    }
    get readyState() {
        return this._readyState;
    }
    connect() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.connected || this.connecting)
                    return;
                if (!(this._readyState === BaseAdapter_1.WalletReadyState.Loadable ||
                    this._readyState === BaseAdapter_1.WalletReadyState.Installed))
                    throw new errors_1.WalletNotReadyError();
                this._connecting = true;
                const provider = this._provider || ((_a = window.nightly) === null || _a === void 0 ? void 0 : _a.aptos);
                const publicKey = yield (provider === null || provider === void 0 ? void 0 : provider.connect(() => {
                    this._wallet = null;
                    this.emit('disconnect');
                }));
                this._wallet = {
                    publicKey: publicKey === null || publicKey === void 0 ? void 0 : publicKey.asString(),
                    address: publicKey === null || publicKey === void 0 ? void 0 : publicKey.address(),
                    isConnected: true
                };
                this.emit('connect', this._wallet.publicKey || '');
                const networkData = yield (provider === null || provider === void 0 ? void 0 : provider.network());
                this._chainId = networkData === null || networkData === void 0 ? void 0 : networkData.chainId.toString();
                this._api = networkData === null || networkData === void 0 ? void 0 : networkData.api;
                this._network = networkData === null || networkData === void 0 ? void 0 : networkData.network.toLocaleLowerCase();
            }
            catch (error) {
                this.emit('error', error);
                throw error;
            }
            finally {
                this._connecting = false;
            }
        });
    }
    disconnect() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = this._wallet;
            if (wallet) {
                this._wallet = null;
                try {
                    const provider = this._provider || ((_a = window.nightly) === null || _a === void 0 ? void 0 : _a.aptos);
                    yield (provider === null || provider === void 0 ? void 0 : provider.disconnect());
                }
                catch (error) {
                    this.emit('error', new errors_1.WalletDisconnectionError(error === null || error === void 0 ? void 0 : error.message, error));
                }
            }
            this.emit('disconnect');
        });
    }
    signTransaction(payload) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                if (!wallet)
                    throw new errors_1.WalletNotConnectedError();
                try {
                    const provider = this._provider || ((_a = window.nightly) === null || _a === void 0 ? void 0 : _a.aptos);
                    const response = yield (provider === null || provider === void 0 ? void 0 : provider.signTransaction(payload, false));
                    if (response) {
                        return response;
                    }
                    else {
                        throw new Error('Transaction failed');
                    }
                }
                catch (error) {
                    throw new errors_1.WalletSignTransactionError(error === null || error === void 0 ? void 0 : error.message, error);
                }
            }
            catch (error) {
                this.emit('error', error);
                throw error;
            }
        });
    }
    signAllTransaction(payload) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                if (!wallet)
                    throw new errors_1.WalletNotConnectedError();
                try {
                    const provider = this._provider || ((_a = window.nightly) === null || _a === void 0 ? void 0 : _a.aptos);
                    const response = yield (provider === null || provider === void 0 ? void 0 : provider.signAllTransactions(payload));
                    if (response) {
                        return response;
                    }
                    else {
                        throw new Error('Transaction failed');
                    }
                }
                catch (error) {
                    throw new errors_1.WalletSignTransactionError(error === null || error === void 0 ? void 0 : error.message, error);
                }
            }
            catch (error) {
                this.emit('error', error);
                throw error;
            }
        });
    }
    signAndSubmitTransaction(tx) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                if (!wallet)
                    throw new errors_1.WalletNotConnectedError();
                try {
                    const provider = this._provider || ((_a = window.nightly) === null || _a === void 0 ? void 0 : _a.aptos);
                    const response = yield (provider === null || provider === void 0 ? void 0 : provider.signTransaction(tx, true));
                    if (response) {
                        return response;
                    }
                    else {
                        throw new Error('Transaction failed');
                    }
                }
                catch (error) {
                    const errMsg = error instanceof Error ? error.message : error.response.data.message;
                    throw new errors_1.WalletSignTransactionError(errMsg);
                }
            }
            catch (error) {
                this.emit('error', error);
                throw error;
            }
        });
    }
    signMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.nightly.aptos;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.signMessage(message));
                if (response) {
                    return Buffer.from(response).toString('hex');
                }
                else {
                    throw new Error('Sign Message failed');
                }
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new errors_1.WalletSignMessageError(errMsg));
                throw error;
            }
        });
    }
    onAccountChange() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.nightly.aptos;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                //To be implemented
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new errors_1.WalletAccountChangeError(errMsg));
                throw error;
            }
        });
    }
    onNetworkChange() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.nightly.aptos;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                //To be implemented
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new errors_1.WalletNetworkChangeError(errMsg));
                throw error;
            }
        });
    }
}
exports.NightlyWalletAdapter = NightlyWalletAdapter;
//# sourceMappingURL=NightlyWallet.js.map