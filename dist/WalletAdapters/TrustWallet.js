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
exports.TrustWalletAdapter = exports.TrustWalletName = void 0;
const errors_1 = require("../WalletProviders/errors");
const BaseAdapter_1 = require("./BaseAdapter");
exports.TrustWalletName = 'Trust';
class TrustWalletAdapter extends BaseAdapter_1.BaseWalletAdapter {
    constructor({ 
    // provider,
    // network = WalletAdapterNetwork.Testnet,
    timeout = 10000 } = {}) {
        super();
        this.name = exports.TrustWalletName;
        this.url = 'https://trustwallet.com/';
        this.icon = 'https://trustwallet.com/assets/images/trust_logotype.svg';
        this._readyState = typeof window === 'undefined' || typeof document === 'undefined'
            ? BaseAdapter_1.WalletReadyState.Unsupported
            : BaseAdapter_1.WalletReadyState.NotDetected;
        this._provider = typeof window !== 'undefined' ? window.aptos : undefined;
        this._network = undefined;
        this._timeout = timeout;
        this._connecting = false;
        this._wallet = null;
        if (typeof window !== 'undefined' && this._readyState !== BaseAdapter_1.WalletReadyState.Unsupported) {
            (0, BaseAdapter_1.scopePollingDetectionStrategy)(() => {
                if (window.aptos) {
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.connected || this.connecting)
                    return;
                if (!(this._readyState === BaseAdapter_1.WalletReadyState.Loadable ||
                    this._readyState === BaseAdapter_1.WalletReadyState.Installed))
                    throw new errors_1.WalletNotReadyError();
                this._connecting = true;
                const provider = this._provider || window.aptos;
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.connect());
                this._wallet = {
                    address: response === null || response === void 0 ? void 0 : response.address,
                    publicKey: response === null || response === void 0 ? void 0 : response.publicKey,
                    isConnected: true
                };
                try {
                    const name = yield (provider === null || provider === void 0 ? void 0 : provider.network());
                    const chainId = null;
                    const api = null;
                    this._network = name;
                    this._chainId = chainId;
                    this._api = api;
                }
                catch (error) {
                    const errMsg = error.message;
                    this.emit('error', new errors_1.WalletGetNetworkError(errMsg));
                    throw error;
                }
                this.emit('connect', this._wallet.address);
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
            const provider = this._provider || window.aptos;
            if (wallet) {
                this._wallet = null;
                try {
                    yield (provider === null || provider === void 0 ? void 0 : provider.disconnect());
                }
                catch (error) {
                    this.emit('error', new errors_1.WalletDisconnectionError(error === null || error === void 0 ? void 0 : error.message, error));
                }
            }
            this.emit('disconnect');
        });
    }
    signTransaction(transaction, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.aptos;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const response = yield provider.signTransaction(transaction, options);
                if (response.code) {
                    throw new Error(response.message);
                }
                return response;
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new errors_1.WalletSignTransactionError(errMsg));
                throw error;
            }
        });
    }
    signAndSubmitTransaction(transaction, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.aptos;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const response = yield provider.signAndSubmitTransaction(transaction, options);
                if (response.code) {
                    throw new Error(response.message);
                }
                return response;
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new errors_1.WalletSignAndSubmitMessageError(errMsg));
                throw error;
            }
        });
    }
    signMessage(msgPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.aptos;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                if (typeof msgPayload !== 'object' || !msgPayload.nonce) {
                    throw new errors_1.WalletSignMessageError('Invalid signMessage Payload');
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
                this.emit('error', new errors_1.WalletSignMessageError(errMsg));
                throw error;
            }
        });
    }
    onAccountChange() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.aptos;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const handleAccountChange = (newAccount) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d, _e, _f;
                    if (newAccount === null || newAccount === void 0 ? void 0 : newAccount.publicKey) {
                        this._wallet = Object.assign(Object.assign({}, this._wallet), { publicKey: newAccount.publicKey || ((_a = this._wallet) === null || _a === void 0 ? void 0 : _a.publicKey), authKey: newAccount.authKey || ((_b = this._wallet) === null || _b === void 0 ? void 0 : _b.authKey), address: newAccount.address || ((_c = this._wallet) === null || _c === void 0 ? void 0 : _c.address) });
                    }
                    else {
                        const response = yield (provider === null || provider === void 0 ? void 0 : provider.connect());
                        this._wallet = Object.assign(Object.assign({}, this._wallet), { authKey: (response === null || response === void 0 ? void 0 : response.authKey) || ((_d = this._wallet) === null || _d === void 0 ? void 0 : _d.authKey), address: (response === null || response === void 0 ? void 0 : response.address) || ((_e = this._wallet) === null || _e === void 0 ? void 0 : _e.address), publicKey: (response === null || response === void 0 ? void 0 : response.publicKey) || ((_f = this._wallet) === null || _f === void 0 ? void 0 : _f.publicKey) });
                    }
                    this.emit('accountChange', newAccount.publicKey);
                });
                yield (provider === null || provider === void 0 ? void 0 : provider.onAccountChange(handleAccountChange));
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
                const provider = this._provider || window.aptos;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const handleNetworkChange = (newNetwork) => __awaiter(this, void 0, void 0, function* () {
                    this._network = newNetwork.networkName;
                    this.emit('networkChange', this._network);
                });
                yield (provider === null || provider === void 0 ? void 0 : provider.onNetworkChange(handleNetworkChange));
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new errors_1.WalletNetworkChangeError(errMsg));
                throw error;
            }
        });
    }
}
exports.TrustWalletAdapter = TrustWalletAdapter;
//# sourceMappingURL=TrustWallet.js.map