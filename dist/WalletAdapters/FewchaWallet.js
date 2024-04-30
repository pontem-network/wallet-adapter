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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FewchaWalletAdapter = exports.FewchaWalletName = void 0;
const errors_1 = require("../WalletProviders/errors");
const web3_1 = __importDefault(require("@fewcha/web3"));
const BaseAdapter_1 = require("./BaseAdapter");
exports.FewchaWalletName = 'Fewcha';
class FewchaWalletAdapter extends BaseAdapter_1.BaseWalletAdapter {
    constructor({ 
    // provider = WEBWALLET_URL,
    // network = WalletAdapterNetwork.Testnet,
    timeout = 10000 } = {}) {
        super();
        this.name = exports.FewchaWalletName;
        this.url = 'https://fewcha.app/';
        this.icon = 'https://miro.medium.com/fit/c/176/176/1*a0WaY-q7gjCRiuryRG6TkQ.png';
        this._readyState = typeof window === 'undefined' || typeof document === 'undefined'
            ? BaseAdapter_1.WalletReadyState.Unsupported
            : BaseAdapter_1.WalletReadyState.NotDetected;
        this._network = undefined;
        this._provider = typeof window !== 'undefined' ? new web3_1.default().action : undefined;
        this._timeout = timeout;
        this._connecting = false;
        this._wallet = null;
        // this._readyState = WalletReadyState.Installed;
        if (typeof window !== 'undefined' && this._readyState !== BaseAdapter_1.WalletReadyState.Unsupported) {
            (0, BaseAdapter_1.scopePollingDetectionStrategy)(() => {
                if (window.fewcha) {
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
                const provider = this._provider || window.fewcha;
                const isConnected = yield provider.isConnected();
                if ((isConnected === null || isConnected === void 0 ? void 0 : isConnected.data) === true) {
                    yield provider.disconnect();
                }
                const response = yield provider.connect();
                if (response.status === 401) {
                    throw new errors_1.WalletConnectionError('User has rejected the connection');
                }
                else if (response.status !== 200) {
                    throw new errors_1.WalletConnectionError('Wallet connect issue');
                }
                let accountDetail = Object.assign({}, response.data);
                if (!accountDetail.publicKey) {
                    const accountResp = yield provider.account();
                    if (!accountResp.data.publicKey) {
                        throw new errors_1.WalletConnectionError('Wallet connect issue', response.data);
                    }
                    accountDetail = Object.assign({}, accountResp.data);
                }
                this._wallet = Object.assign({ connected: true }, accountDetail);
                try {
                    const { data: name } = yield (provider === null || provider === void 0 ? void 0 : provider.getNetwork());
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
        return __awaiter(this, void 0, void 0, function* () {
            const provider = this._provider || window.fewcha;
            if (provider) {
                try {
                    const isDisconnected = yield provider.disconnect();
                    if (isDisconnected.data === true) {
                        this._provider = undefined;
                        this._wallet = null;
                    }
                    else {
                        throw new Error('Disconnect failed');
                    }
                }
                catch (error) {
                    this.emit('error', new errors_1.WalletDisconnectionError(error === null || error === void 0 ? void 0 : error.message, error));
                    throw error;
                }
            }
            this.emit('disconnect');
        });
    }
    signTransaction(transaction, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                if (!wallet)
                    throw new errors_1.WalletNotConnectedError();
                const provider = this._provider || window.fewcha;
                const tx = yield provider.generateTransaction(transaction, options);
                if (!tx)
                    throw new Error('Cannot generate transaction');
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.signTransaction(tx.data));
                if (!response || response.status !== 200) {
                    throw new Error('No response');
                }
                return response.data;
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : error.response.data.message;
                this.emit('error', new errors_1.WalletSignTransactionError(errMsg));
                throw error;
            }
        });
    }
    signAndSubmitTransaction(transaction, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                if (!wallet)
                    throw new errors_1.WalletNotConnectedError();
                const provider = this._provider || window.fewcha;
                const tx = yield provider.generateTransaction(transaction, options);
                if (!tx)
                    throw new Error('Cannot generate transaction');
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.signAndSubmitTransaction(tx.data));
                if (response.status === 401) {
                    throw new Error('User has rejected the transaction');
                }
                else if (response.status !== 200) {
                    throw new Error('Transaction issue');
                }
                return {
                    hash: response.data
                };
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : error.response.data.message;
                this.emit('error', new errors_1.WalletSignAndSubmitMessageError(errMsg));
                throw error;
            }
        });
    }
    signMessage(msgPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.fewcha;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.signMessage(msgPayload));
                if (response) {
                    return response.data;
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
                const provider = this._provider || window.fewcha;
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
                const provider = this._provider || window.fewcha;
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
exports.FewchaWalletAdapter = FewchaWalletAdapter;
//# sourceMappingURL=FewchaWallet.js.map