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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloctoWalletAdapter = exports.APTOS_NETWORK_CHAIN_ID_MAPPING = exports.BloctoWalletName = void 0;
const sdk_1 = __importDefault(require("@blocto/sdk"));
const errors_1 = require("../WalletProviders/errors");
const BaseAdapter_1 = require("./BaseAdapter");
exports.BloctoWalletName = 'Blocto';
exports.APTOS_NETWORK_CHAIN_ID_MAPPING = {
    // MAINNET
    [BaseAdapter_1.WalletAdapterNetwork.Mainnet]: 1,
    // TESTNET
    [BaseAdapter_1.WalletAdapterNetwork.Testnet]: 2
};
class BloctoWalletAdapter extends BaseAdapter_1.BaseWalletAdapter {
    constructor({ network, timeout = 10000, bloctoAppId = '' } = {
        network: BaseAdapter_1.WalletAdapterNetwork.Testnet
    }) {
        super();
        this.name = exports.BloctoWalletName;
        this.url = 'https://portto.com/download';
        this.icon = 'https://raw.githubusercontent.com/hippospace/aptos-wallet-adapter/main/logos/blocto.svg';
        this._readyState = typeof window === 'undefined' || typeof document === 'undefined'
            ? BaseAdapter_1.WalletReadyState.Unsupported
            : BaseAdapter_1.WalletReadyState.NotDetected;
        const sdk = new sdk_1.default({
            aptos: {
                chainId: exports.APTOS_NETWORK_CHAIN_ID_MAPPING[network]
            },
            appId: bloctoAppId
        });
        this._provider = sdk.aptos;
        this._network = network;
        this._timeout = timeout;
        this._connecting = false;
        this._wallet = null;
        if (typeof window !== 'undefined' && this._readyState !== BaseAdapter_1.WalletReadyState.Unsupported) {
            (0, BaseAdapter_1.scopePollingDetectionStrategy)(() => {
                if (window) {
                    this._readyState = BaseAdapter_1.WalletReadyState.Installed;
                    return true;
                }
                return false;
            });
        }
    }
    get publicAccount() {
        var _a, _b, _c, _d;
        return {
            publicKey: ((_a = this._wallet) === null || _a === void 0 ? void 0 : _a.publicKey) || null,
            address: ((_b = this._wallet) === null || _b === void 0 ? void 0 : _b.address) || null,
            authKey: ((_c = this._wallet) === null || _c === void 0 ? void 0 : _c.authKey) || null,
            minKeysRequired: (_d = this._wallet) === null || _d === void 0 ? void 0 : _d.minKeysRequired
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
                const provider = this._provider;
                const isConnected = yield (provider === null || provider === void 0 ? void 0 : provider.isConnected());
                if (isConnected) {
                    yield (provider === null || provider === void 0 ? void 0 : provider.disconnect());
                }
                const _a = yield (provider === null || provider === void 0 ? void 0 : provider.connect()), { publicKey } = _a, rest = __rest(_a, ["publicKey"]);
                this._wallet = Object.assign(Object.assign({}, rest), { publicKey, isConnected: true });
                const { api, chainId } = yield provider.network();
                this._api = api;
                this._chainId = chainId;
                this.emit('connect', this._wallet);
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
            const provider = this._provider;
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    const provider = this._provider;
                    const response = yield (provider === null || provider === void 0 ? void 0 : provider.signTransaction(transaction));
                    if (response) {
                        return new Uint8Array([]);
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
    signAndSubmitTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    const provider = this._provider;
                    const response = yield (provider === null || provider === void 0 ? void 0 : provider.signAndSubmitTransaction(transaction));
                    if (response) {
                        return { hash: response.hash };
                    }
                    else {
                        throw new Error('Transaction failed');
                    }
                }
                catch (error) {
                    throw new errors_1.WalletSignAndSubmitMessageError(error.message || error);
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
                const provider = this._provider;
                const response = yield (provider === null || provider === void 0 ? void 0 : provider.signMessage(message));
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
                const provider = this._provider;
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
                const provider = this._provider;
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
exports.BloctoWalletAdapter = BloctoWalletAdapter;
//# sourceMappingURL=BloctoWallet.js.map