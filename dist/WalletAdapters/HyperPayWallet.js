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
exports.HyperPayWalletAdapter = exports.HyperPayWalletName = void 0;
const errors_1 = require("../WalletProviders/errors");
const BaseAdapter_1 = require("./BaseAdapter");
exports.HyperPayWalletName = 'HyperPay';
class HyperPayWalletAdapter extends BaseAdapter_1.BaseWalletAdapter {
    constructor({ 
    // provider,
    // network = WalletAdapterNetwork.Mainnet,
    timeout = 10000 } = {}) {
        super();
        this.name = exports.HyperPayWalletName;
        this.url = 'https://www.hyperpay.tech/';
        this.icon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjE1IDEyMTUiPjxwYXRoIGQ9Ik02MDcuNSAwQzk0My4wMTMgMCAxMjE1IDI3MS45ODcgMTIxNSA2MDcuNVM5NDMuMDEzIDEyMTUgNjA3LjUgMTIxNSAwIDk0My4wMTMgMCA2MDcuNSAyNzEuOTg3IDAgNjA3LjUgMHpNMzUxLjY4IDM3MS4zMTVzMy43MDgtNzIuOSA3Ny43Ni03Mi45aDIwNC4xMnMxMTkuNDM3LS4xIDIwNC4xMiA3NS4zM2MwIDAgMTExLjg0MyA5My42MTIgMTE2LjY0IDIzNS43MSAwIDAgMS45NjIgMTE5LjA0NS03Mi45IDIxMS40MSAwIDAtNzcuOTMxIDEyMS41LTI2Mi40NCAxMjEuNUg0NDEuNTlzLTg5LjkxIDExLjA0OS04OS45MS04NS4wNXYtNDg2ek0xMTkuMzQ0IDU1My42NTlzLjkwNi0xNy44MiAxOS4wMDgtMTcuODJoNDkuOXMyOS4yLS4wMjMgNDkuOSAxOC40MTRjMCAwIDI3LjMzOSAyMi44ODMgMjguNTEyIDU3LjYxOCAwIDAgLjQ4IDI5LjEtMTcuODIgNTEuNjc4IDAgMC0xOS4wNSAyOS43LTY0LjE1MiAyOS43aC00My4zN3MtMjEuOTc4IDIuNy0yMS45NzgtMjAuNzl2LTExOC44eiIgZmlsbD0iIzE1N0VGQiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+';
        this._readyState = typeof window === 'undefined' || typeof document === 'undefined'
            ? BaseAdapter_1.WalletReadyState.Unsupported
            : BaseAdapter_1.WalletReadyState.NotDetected;
        this._provider = typeof window !== 'undefined' ? window.hyperpay : undefined;
        // this._network = network;
        this._timeout = timeout;
        this._connecting = false;
        this._wallet = null;
        if (typeof window !== 'undefined' && this._readyState !== BaseAdapter_1.WalletReadyState.Unsupported) {
            (0, BaseAdapter_1.scopePollingDetectionStrategy)(() => {
                if (window.hyperpay) {
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
                const provider = this._provider || window.hyperpay;
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
            const provider = this._provider || window.hyperpay;
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
                const provider = this._provider || window.hyperpay;
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
                const provider = this._provider || window.hyperpay;
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
    signMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.hyperpay;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.signMessage(message));
                if (response === null || response === void 0 ? void 0 : response.signature) {
                    return response === null || response === void 0 ? void 0 : response.signature;
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
                const provider = this._provider || window.hyperpay;
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
                const provider = this._provider || window.hyperpay;
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
exports.HyperPayWalletAdapter = HyperPayWalletAdapter;
//# sourceMappingURL=HyperPayWallet.js.map