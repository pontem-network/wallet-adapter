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
exports.PontemWalletAdapter = exports.PontemWalletName = void 0;
const errors_1 = require("../WalletProviders/errors");
const BaseAdapter_1 = require("./BaseAdapter");
exports.PontemWalletName = 'Pontem';
class PontemWalletAdapter extends BaseAdapter_1.BaseWalletAdapter {
    constructor({ 
    // provider,
    // network = WalletAdapterNetwork.Mainnet,
    timeout = 10000 } = {}) {
        super();
        this.name = exports.PontemWalletName;
        this.url = 'https://chrome.google.com/webstore/detail/pontem-wallet/phkbamefinggmakgklpkljjmgibohnba';
        this.icon = 'https://www.gitbook.com/cdn-cgi/image/width=20,height=20,fit=contain,dpr=2,format=auto/https%3A%2F%2F736486047-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MVVJKmKQGx983dZy_jr%252Favatar-1619180126965.png%3Fgeneration%3D1619180127194239%26alt%3Dmedia';
        this._readyState = typeof window === 'undefined' || typeof document === 'undefined'
            ? BaseAdapter_1.WalletReadyState.Unsupported
            : BaseAdapter_1.WalletReadyState.NotDetected;
        this._provider = typeof window !== 'undefined' ? window.pontem : undefined;
        // this._network = network;
        this._timeout = timeout;
        this._connecting = false;
        this._wallet = null;
        if (typeof window !== 'undefined' && this._readyState !== BaseAdapter_1.WalletReadyState.Unsupported) {
            (0, BaseAdapter_1.scopePollingDetectionStrategy)(() => {
                if (window.pontem) {
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
                const provider = this._provider || window.pontem;
                const isConnected = yield (provider === null || provider === void 0 ? void 0 : provider.isConnected());
                if (isConnected) {
                    yield (provider === null || provider === void 0 ? void 0 : provider.disconnect());
                }
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.connect());
                if (!response) {
                    throw new errors_1.WalletNotConnectedError('No connect response');
                }
                const walletAccount = yield (provider === null || provider === void 0 ? void 0 : provider.account());
                const publicKey = yield (provider === null || provider === void 0 ? void 0 : provider.publicKey());
                if (walletAccount) {
                    this._wallet = {
                        address: walletAccount,
                        publicKey,
                        isConnected: true
                    };
                }
                this.emit('connect', ((_a = this._wallet) === null || _a === void 0 ? void 0 : _a.address) || '');
            }
            catch (error) {
                this.emit('error', new Error('User has rejected the connection'));
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
            const provider = this._provider || window.pontem;
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
    signTransaction(transactionPyld, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.pontem;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.signTransaction(transactionPyld, options));
                return response;
            }
            catch (error) {
                this.emit('error', new errors_1.WalletSignTransactionError(error));
                throw error;
            }
        });
    }
    signAndSubmitTransaction(transactionPyld, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.pontem;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.signAndSubmit(transactionPyld, options));
                if (!response || !response.success) {
                    throw new Error('No response');
                }
                return { hash: response.result.hash };
            }
            catch (error) {
                this.emit('error', new errors_1.WalletSignAndSubmitMessageError(error.message));
                throw error;
            }
        });
    }
    signMessage(messagePayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.pontem;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.signMessage(messagePayload));
                if (response.success) {
                    return response.result;
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
    onAccountChange(listener) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.pontem;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                yield (provider === null || provider === void 0 ? void 0 : provider.onAccountChange(listener));
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new errors_1.WalletAccountError(errMsg));
                throw error;
            }
        });
    }
    onNetworkChange(listener) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.pontem;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                yield (provider === null || provider === void 0 ? void 0 : provider.onNetworkChange(listener));
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new errors_1.WalletSignMessageError(errMsg));
                throw error;
            }
        });
    }
    network() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.pontem;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.network());
                if (response) {
                    return response;
                }
                else {
                    throw new Error('Get network failed');
                }
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new errors_1.WalletNetworkError(errMsg));
                throw error;
            }
        });
    }
}
exports.PontemWalletAdapter = PontemWalletAdapter;
//# sourceMappingURL=PontemWallet.js.map