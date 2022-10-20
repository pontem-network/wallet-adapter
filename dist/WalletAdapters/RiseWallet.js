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
exports.RiseWalletAdapter = exports.RiseWalletName = void 0;
const WalletProviders_1 = require("../WalletProviders");
const BaseAdapter_1 = require("./BaseAdapter");
exports.RiseWalletName = 'Rise Wallet';
class RiseWalletAdapter extends BaseAdapter_1.BaseWalletAdapter {
    constructor({ 
    // provider,
    // network = WalletAdapterNetwork.Testnet,
    timeout = 10000 } = {}) {
        super();
        this.name = exports.RiseWalletName;
        this.url = 'https://risewallet.io';
        this.icon = 'https://static.risewallet.io/logo.png';
        this._readyState = typeof window === 'undefined' || typeof document === 'undefined'
            ? BaseAdapter_1.WalletReadyState.Unsupported
            : BaseAdapter_1.WalletReadyState.NotDetected;
        this._provider = typeof window !== 'undefined' ? window.rise : undefined;
        this._network = undefined;
        this._timeout = timeout;
        this._connecting = false;
        this._wallet = null;
        if (typeof window !== 'undefined' && this._readyState !== BaseAdapter_1.WalletReadyState.Unsupported) {
            (0, BaseAdapter_1.scopePollingDetectionStrategy)(() => {
                if (window.rise) {
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
                    throw new WalletProviders_1.WalletNotReadyError();
                this._connecting = true;
                const provider = this._provider || window.rise;
                const isConnected = yield ((_a = this._provider) === null || _a === void 0 ? void 0 : _a.isConnected());
                if (isConnected === true) {
                    yield (provider === null || provider === void 0 ? void 0 : provider.disconnect());
                }
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.connect());
                if (!response) {
                    throw new WalletProviders_1.WalletNotConnectedError('User has rejected the request');
                }
                // TODO - remove this check in the future
                //  provider.network is still not live and we want smooth transition
                if (provider === null || provider === void 0 ? void 0 : provider.network) {
                    try {
                        const { chainId, api, name } = yield provider.network();
                        this._network = name;
                        this._chainId = chainId;
                        this._api = api;
                    }
                    catch (error) {
                        const errMsg = error.message;
                        this.emit('error', new WalletProviders_1.WalletGetNetworkError(errMsg));
                        throw error;
                    }
                }
                const account = yield (provider === null || provider === void 0 ? void 0 : provider.account());
                if (account) {
                    const { publicKey, address, authKey } = account;
                    this._wallet = {
                        publicKey,
                        address,
                        authKey,
                        isConnected: true
                    };
                    this.emit('connect', this._wallet.publicKey);
                }
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
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = this._wallet;
            if (wallet) {
                this._wallet = null;
                try {
                    const provider = this._provider || window.rise;
                    yield (provider === null || provider === void 0 ? void 0 : provider.disconnect());
                }
                catch (error) {
                    this.emit('error', new WalletProviders_1.WalletDisconnectionError(error === null || error === void 0 ? void 0 : error.message, error));
                }
            }
            this.emit('disconnect');
        });
    }
    signTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.rise;
                if (!wallet || !provider)
                    throw new WalletProviders_1.WalletNotConnectedError();
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.signTransaction(transaction));
                if (response) {
                    return response;
                }
                else {
                    throw new Error('Sign Transaction failed');
                }
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new WalletProviders_1.WalletSignTransactionError(errMsg));
                throw error;
            }
        });
    }
    signAndSubmitTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.rise;
                if (!wallet || !provider)
                    throw new WalletProviders_1.WalletNotConnectedError();
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.signAndSubmitTransaction(transaction));
                if (response) {
                    return response;
                }
                else {
                    throw new Error('Transaction failed');
                }
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new WalletProviders_1.WalletSignTransactionError(errMsg));
                throw error;
            }
        });
    }
    signMessage(msgPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.rise;
                if (!wallet || !provider)
                    throw new WalletProviders_1.WalletNotConnectedError();
                if (typeof msgPayload !== 'object' || !msgPayload.nonce) {
                    throw new WalletProviders_1.WalletSignMessageError('Invalid signMessage Payload');
                }
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.signMessage(msgPayload));
                if (response) {
                    return response;
                }
                else {
                    throw new Error('Sign Message failed');
                }
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new WalletProviders_1.WalletSignMessageError(errMsg));
                throw error;
            }
        });
    }
    onAccountChange() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.rise;
                if (!wallet || !provider)
                    throw new WalletProviders_1.WalletNotConnectedError();
                //To be implemented
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new WalletProviders_1.WalletAccountChangeError(errMsg));
                throw error;
            }
        });
    }
    onNetworkChange() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.rise;
                if (!wallet || !provider)
                    throw new WalletProviders_1.WalletNotConnectedError();
                //To be implemented
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new WalletProviders_1.WalletNetworkChangeError(errMsg));
                throw error;
            }
        });
    }
}
exports.RiseWalletAdapter = RiseWalletAdapter;
//# sourceMappingURL=RiseWallet.js.map