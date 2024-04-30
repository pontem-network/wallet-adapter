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
exports.OpenBlockWalletAdapter = exports.OpenBlockWalletName = void 0;
const errors_1 = require("../WalletProviders/errors");
const BaseAdapter_1 = require("./BaseAdapter");
exports.OpenBlockWalletName = 'OpenBlock';
class OpenBlockWalletAdapter extends BaseAdapter_1.BaseWalletAdapter {
    constructor({ 
    // provider,
    // network = WalletAdapterNetwork.Testnet,
    timeout = 10000 } = {}) {
        var _a;
        super();
        this.name = exports.OpenBlockWalletName;
        this.url = 'https://openblock.com/';
        this.icon = 'https://obstatic.243096.com/download/dapp/sdk/images/logo_blue.svg';
        this._readyState = typeof window === 'undefined' || typeof document === 'undefined'
            ? BaseAdapter_1.WalletReadyState.Unsupported
            : BaseAdapter_1.WalletReadyState.NotDetected;
        this._provider = typeof window !== 'undefined' ? (_a = window.openblock) === null || _a === void 0 ? void 0 : _a.aptos : undefined;
        this._network = undefined;
        this._timeout = timeout;
        this._connecting = false;
        this._wallet = null;
        if (typeof window !== 'undefined' && this._readyState !== BaseAdapter_1.WalletReadyState.Unsupported) {
            require('@openblockhq/dappsdk');
            (0, BaseAdapter_1.scopePollingDetectionStrategy)(() => {
                var _a;
                if ((_a = window.openblock) === null || _a === void 0 ? void 0 : _a.aptos) {
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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.connected || this.connecting)
                    return;
                if (!(this._readyState === BaseAdapter_1.WalletReadyState.Loadable ||
                    this._readyState === BaseAdapter_1.WalletReadyState.Installed))
                    throw new errors_1.WalletNotReadyError();
                this._connecting = true;
                const provider = this._provider || ((_a = window === null || window === void 0 ? void 0 : window.openblock) === null || _a === void 0 ? void 0 : _a.aptos);
                const isConnected = yield ((_b = this._provider) === null || _b === void 0 ? void 0 : _b.isConnected());
                if (isConnected === true) {
                    yield (provider === null || provider === void 0 ? void 0 : provider.disconnect());
                }
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.connect());
                if (response.address) {
                    this._wallet = {
                        address: response === null || response === void 0 ? void 0 : response.address,
                        publicKey: response === null || response === void 0 ? void 0 : response.publicKey,
                        isConnected: true
                    };
                    const network = yield (provider === null || provider === void 0 ? void 0 : provider.network());
                    this._network = network.name;
                    this._chainId = network.chainId;
                    this._api = network.api;
                }
                else {
                    throw new Error('failed to connect');
                }
                this.emit('connect', this._wallet.publicKey);
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
            const provider = this._provider || ((_a = window === null || window === void 0 ? void 0 : window.openblock) === null || _a === void 0 ? void 0 : _a.aptos);
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
    signTransaction(transaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || ((_a = window === null || window === void 0 ? void 0 : window.openblock) === null || _a === void 0 ? void 0 : _a.aptos);
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const response = yield provider.signTransaction(transaction);
                if (response) {
                    return new TextEncoder().encode(response);
                }
                throw new Error('failed to SignTransaction');
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new errors_1.WalletSignTransactionError(errMsg));
                throw error;
            }
        });
    }
    signAndSubmitTransaction(transaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || ((_a = window === null || window === void 0 ? void 0 : window.openblock) === null || _a === void 0 ? void 0 : _a.aptos);
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const response = yield provider.signAndSubmitTransaction(transaction);
                if (response) {
                    return response;
                }
                throw new Error('Failed to SignAndSubmitTransaction');
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new errors_1.WalletSignAndSubmitMessageError(errMsg));
                throw error;
            }
        });
    }
    signMessage(msgPayload) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || ((_a = window === null || window === void 0 ? void 0 : window.openblock) === null || _a === void 0 ? void 0 : _a.aptos);
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                if (typeof msgPayload !== 'object' || !msgPayload.nonce) {
                    throw new errors_1.WalletSignMessageError('Invalid signMessage Payload');
                }
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.signMessage(msgPayload));
                if (response) {
                    return response;
                }
                throw new Error('Failed to signMessage');
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new errors_1.WalletSignMessageError(errMsg));
                throw error;
            }
        });
    }
    onAccountChange() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || ((_a = window === null || window === void 0 ? void 0 : window.openblock) === null || _a === void 0 ? void 0 : _a.aptos);
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const handleAccountChange = (newAccount) => __awaiter(this, void 0, void 0, function* () {
                    var _b, _c, _d;
                    this._wallet = Object.assign(Object.assign({}, this._wallet), { publicKey: newAccount.publicKey || ((_b = this._wallet) === null || _b === void 0 ? void 0 : _b.publicKey), authKey: newAccount.authKey || ((_c = this._wallet) === null || _c === void 0 ? void 0 : _c.authKey), address: newAccount.address || ((_d = this._wallet) === null || _d === void 0 ? void 0 : _d.address) });
                    this.emit('accountChange', newAccount.publicKey);
                });
                provider === null || provider === void 0 ? void 0 : provider.onAccountChange(handleAccountChange);
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new errors_1.WalletAccountChangeError(errMsg));
                throw error;
            }
        });
    }
    onNetworkChange() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || ((_a = window === null || window === void 0 ? void 0 : window.openblock) === null || _a === void 0 ? void 0 : _a.aptos);
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const handleNetworkChange = (newNetwork) => __awaiter(this, void 0, void 0, function* () {
                    this._network = newNetwork.name;
                    this._api = newNetwork.api;
                    this._chainId = newNetwork.chainId;
                    this.emit('networkChange', this._network);
                });
                provider === null || provider === void 0 ? void 0 : provider.onNetworkChange(handleNetworkChange);
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new errors_1.WalletNetworkChangeError(errMsg));
                throw error;
            }
        });
    }
}
exports.OpenBlockWalletAdapter = OpenBlockWalletAdapter;
//# sourceMappingURL=OpenBlockWallet.js.map