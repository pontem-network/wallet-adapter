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
exports.HippoWalletAdapter = exports.HippoWalletName = void 0;
const aptosConstants_1 = require("../config/aptosConstants");
const errors_1 = require("../WalletProviders/errors");
const BaseAdapter_1 = require("./BaseAdapter");
exports.HippoWalletName = 'Hippo Web';
class HippoWalletAdapter extends BaseAdapter_1.BaseWalletAdapter {
    constructor({ 
    // provider = WEBWALLET_URL,
    // network = WalletAdapterNetwork.Testnet,
    timeout = 10000 } = {}) {
        super();
        this.name = exports.HippoWalletName;
        this.url = 'https://hippo-wallet-test.web.app';
        this.icon = 'https://ui-test1-22e7c.web.app/static/media/hippo_logo.ecded6bf411652de9b7f.png';
        this._readyState = BaseAdapter_1.WalletReadyState.Installed;
        this.handleMessage = (e) => {
            var _a;
            if (e.origin === this._provider) {
                if (e.data.method === 'account') {
                    this._wallet = {
                        connected: true,
                        publicKey: e.data.publicKey || null,
                        address: e.data.address || null,
                        authKey: e.data.authKey || null
                    };
                    this.emit('connect', this._wallet);
                }
                else if (e.data.method === 'success') {
                    this.emit('success', (_a = e.data.detail) === null || _a === void 0 ? void 0 : _a.hash);
                }
                else if (e.data.method === 'fail') {
                    this.emit('error', new errors_1.WalletSignAndSubmitMessageError(e.data.error));
                }
                else if (e.data.method === 'disconnected') {
                    this.disconnect();
                }
            }
        };
        this._beforeUnload = () => {
            void this.disconnect();
        };
        this._provider = aptosConstants_1.WEBWALLET_URL || 'https://hippo-wallet-test.web.app';
        this._network = undefined;
        this._timeout = timeout;
        this._connecting = false;
        this._wallet = null;
        this._readyState = BaseAdapter_1.WalletReadyState.Installed;
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
        return !!((_a = this._wallet) === null || _a === void 0 ? void 0 : _a.connected);
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
                window.addEventListener('message', this.handleMessage);
                window.addEventListener('beforeunload', this._beforeUnload);
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
            window.removeEventListener('message', this.handleMessage);
            window.removeEventListener('beforeunload', this._beforeUnload);
            this._wallet = null;
            this.emit('disconnect');
        });
    }
    signTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = new URLSearchParams({
                    request: JSON.stringify({
                        method: 'signTransaction',
                        payload: transaction
                    }),
                    origin: window.location.origin,
                    isPopUp: 'true'
                }).toString();
                const popup = window.open(`${aptosConstants_1.WEBWALLET_URL}?${request}`, 'Transaction Confirmation', 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=440,height=700');
                if (!popup)
                    throw new errors_1.WalletNotConnectedError();
                const promise = yield new Promise((resolve, reject) => {
                    this.once('success', resolve);
                    this.once('error', reject);
                });
                return promise;
            }
            catch (error) {
                this.emit('error', error);
                throw error;
            }
        });
    }
    signAndSubmitTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = new URLSearchParams({
                    request: JSON.stringify({
                        method: 'signAndSubmit',
                        payload: transaction
                    }),
                    origin: window.location.origin
                }).toString();
                const popup = window.open(`${aptosConstants_1.WEBWALLET_URL}?${request}`, 'Transaction Confirmation', 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=440,height=700');
                if (!popup)
                    throw new errors_1.WalletNotConnectedError();
                const promise = yield new Promise((resolve, reject) => {
                    this.once('success', resolve);
                    this.once('error', reject);
                });
                return promise;
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
                const request = new URLSearchParams({
                    request: JSON.stringify({
                        method: 'signMessage',
                        payload: message
                    }),
                    origin: window.location.origin
                }).toString();
                const popup = window.open(`${aptosConstants_1.WEBWALLET_URL}?${request}`, 'Transaction Confirmation', 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=440,height=700');
                if (!popup)
                    throw new errors_1.WalletNotConnectedError();
                const promise = yield new Promise((resolve, reject) => {
                    this.once('success', resolve);
                    this.once('error', reject);
                });
                return promise;
            }
            catch (error) {
                this.emit('error', error);
                throw error;
            }
        });
    }
    onAccountChange() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
exports.HippoWalletAdapter = HippoWalletAdapter;
//# sourceMappingURL=HippoWallet.js.map