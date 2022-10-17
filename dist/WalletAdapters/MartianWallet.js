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
exports.MartianWalletAdapter = exports.MartianWalletName = void 0;
const errors_1 = require("../WalletProviders/errors");
const BaseAdapter_1 = require("./BaseAdapter");
exports.MartianWalletName = 'Martian';
class MartianWalletAdapter extends BaseAdapter_1.BaseWalletAdapter {
    constructor({ 
    // provider,
    // network = WalletAdapterNetwork.Testnet,
    timeout = 10000 } = {}) {
        super();
        this.name = exports.MartianWalletName;
        this.url = 'https://chrome.google.com/webstore/detail/martian-wallet/efbglgofoippbgcjepnhiblaibcnclgk';
        this.icon = 'https://raw.githubusercontent.com/hippospace/aptos-wallet-adapter/main/logos/martian.png';
        this._readyState = typeof window === 'undefined' || typeof document === 'undefined'
            ? BaseAdapter_1.WalletReadyState.Unsupported
            : BaseAdapter_1.WalletReadyState.NotDetected;
        this._provider = typeof window !== 'undefined' ? window.martian : undefined;
        this._network = undefined;
        this._timeout = timeout;
        this._connecting = false;
        this._wallet = null;
        if (typeof window !== 'undefined' && this._readyState !== BaseAdapter_1.WalletReadyState.Unsupported) {
            (0, BaseAdapter_1.scopePollingDetectionStrategy)(() => {
                if (window.martian) {
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
                const provider = this._provider || window.martian;
                const isConnected = yield (provider === null || provider === void 0 ? void 0 : provider.isConnected());
                if (isConnected) {
                    yield (provider === null || provider === void 0 ? void 0 : provider.disconnect());
                }
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.connect());
                if (!response) {
                    throw new errors_1.WalletNotConnectedError('No connect response');
                }
                const walletAccount = yield (provider === null || provider === void 0 ? void 0 : provider.account());
                if (walletAccount) {
                    this._wallet = Object.assign(Object.assign({}, walletAccount), { isConnected: true });
                    try {
                        const name = yield (provider === null || provider === void 0 ? void 0 : provider.network());
                        const { chainId } = yield (provider === null || provider === void 0 ? void 0 : provider.getChainId());
                        const api = null;
                        this._network = name;
                        this._chainId = chainId.toString();
                        this._api = api;
                    }
                    catch (error) {
                        const errMsg = error.message;
                        this.emit('error', new errors_1.WalletGetNetworkError(errMsg));
                        throw error;
                    }
                }
                this.emit('connect', ((_a = this._wallet) === null || _a === void 0 ? void 0 : _a.address) || '');
            }
            catch (error) {
                this.emit('error', new Error(error));
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
            const provider = this._provider || window.martian;
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
                const provider = this._provider || window.martian;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const tx = yield provider.generateTransaction(wallet.address || '', transactionPyld, options);
                if (!tx)
                    throw new Error('Cannot generate transaction');
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.signTransaction(tx));
                if (!response) {
                    throw new Error('No response');
                }
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
                const provider = this._provider || window.martian;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const tx = yield provider.generateTransaction(wallet.address || '', transactionPyld, options);
                if (!tx)
                    throw new Error('Cannot generate transaction');
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.signAndSubmitTransaction(tx));
                if (!response) {
                    throw new Error('No response');
                }
                return { hash: response };
            }
            catch (error) {
                this.emit('error', new errors_1.WalletSignAndSubmitMessageError(error));
                throw error;
            }
        });
    }
    signMessage(msgPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.martian;
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
                const provider = this._provider || window.martian;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                yield (provider === null || provider === void 0 ? void 0 : provider.onAccountChange((newAccount) => {
                    this._wallet = Object.assign(Object.assign({}, this._wallet), { address: newAccount });
                    this.emit('accountChange', newAccount);
                }));
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
                const provider = this._provider || window.martian;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const handleNetworkChange = (newNetwork) => __awaiter(this, void 0, void 0, function* () {
                    this._network = newNetwork;
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
exports.MartianWalletAdapter = MartianWalletAdapter;
//# sourceMappingURL=MartianWallet.js.map