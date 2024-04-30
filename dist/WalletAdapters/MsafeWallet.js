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
exports.MsafeWalletAdapter = exports.MsafeWalletName = exports.MSafeWalletAdapter = exports.MSafeWalletName = void 0;
const aptos_1 = require("aptos");
const errors_1 = require("../WalletProviders/errors");
const BaseAdapter_1 = require("./BaseAdapter");
const msafe_wallet_1 = require("msafe-wallet");
exports.MSafeWalletName = 'MSafe';
class MSafeWalletAdapter extends BaseAdapter_1.BaseWalletAdapter {
    /**
     * @description create a MSafeWalletAdapter
     * @param origin allowlist of msafe website url, omit means accpets all msafe websites. you can pass a single url or an array of urls.
     * @example
     *  // 1. Initialize MSafeWalletAdapter with default allowlist:
     *      new MSafeWalletAdapter();
     *  // 2. Initialize MSafeWalletAdapter with a single MSafe url:
     *      new MSafeWalletAdapter('https://app.m-safe.io');
     *  // 3. Initialize MSafeWalletAdapter with an array of MSafe urls:
     *      new MSafeWalletAdapter(['https://app.m-safe.io', 'https://testnet.m-safe.io', 'https://partner.m-safe.io']);
     *  // 4. Initialize MSafeWalletAdapter with a single network type:
     *      new MSafeWalletAdapter('Mainnet');
     *  // 5. Initialize MSafeWalletAdapter with an array of network types:
     *      new MSafeWalletAdapter(['Mainnet', 'Testnet', 'Partner']);
     */
    constructor(origin) {
        super();
        this.name = exports.MSafeWalletName;
        this.icon = 'https://raw.githubusercontent.com/hippospace/aptos-wallet-adapter/main/logos/msafe.png';
        // MSafeWallet only works in msafe appstore iframe
        this._readyState = msafe_wallet_1.MSafeWallet.inMSafeWallet()
            ? BaseAdapter_1.WalletReadyState.NotDetected
            : BaseAdapter_1.WalletReadyState.Unsupported;
        this._network = undefined;
        this._connecting = false;
        this._origin = origin;
        if (this._readyState === BaseAdapter_1.WalletReadyState.NotDetected) {
            msafe_wallet_1.MSafeWallet.new(origin)
                .then((msafe) => {
                this._provider = msafe;
                this._readyState = BaseAdapter_1.WalletReadyState.Installed;
                this.emit('readyStateChange', this._readyState);
            })
                .catch((e) => {
                this._readyState = BaseAdapter_1.WalletReadyState.Unsupported;
                this.emit('readyStateChange', this._readyState);
                console.error('MSafe connect error:', e);
            });
        }
    }
    /// fix issue of next.js: access url via getter to avoid access window object in constructor
    get url() {
        return msafe_wallet_1.MSafeWallet.getAppUrl(this._origin instanceof Array ? this._origin[0] : this._origin);
    }
    get publicAccount() {
        var _a, _b, _c, _d;
        return {
            publicKey: (_a = this._wallet) === null || _a === void 0 ? void 0 : _a.publicKey,
            address: (_b = this._wallet) === null || _b === void 0 ? void 0 : _b.address,
            authKey: (_c = this._wallet) === null || _c === void 0 ? void 0 : _c.authKey,
            minKeysRequired: (_d = this._wallet) === null || _d === void 0 ? void 0 : _d.minKeysRequired
        };
    }
    get network() {
        return {
            name: this._network,
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
                const provider = this._provider;
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
                        const chainId = yield (provider === null || provider === void 0 ? void 0 : provider.chainId());
                        this._network = name;
                        this._chainId = chainId.toString();
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
    signTransaction(transactionPyld, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const response = yield provider.signTransaction(transactionPyld, options);
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
                const provider = this._provider;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const response = yield provider.signAndSubmit(transactionPyld, options);
                if (!response) {
                    throw new Error('No response');
                }
                return { hash: aptos_1.HexString.fromUint8Array(response).hex() };
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
                const provider = this._provider;
                if (!wallet || !provider)
                    throw new errors_1.WalletNotConnectedError();
                const response = yield provider.signMessage(msgPayload);
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
                const handleChangeAccount = (newAccount) => __awaiter(this, void 0, void 0, function* () {
                    this._wallet = Object.assign(Object.assign({}, this._wallet), newAccount);
                    this.emit('accountChange', newAccount.address);
                });
                provider.onChangeAccount(handleChangeAccount);
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
                const handleNetworkChange = (newNetwork) => __awaiter(this, void 0, void 0, function* () {
                    this._network = newNetwork;
                    this._chainId = (yield this._provider.chainId()).toString();
                    this.emit('networkChange', this._network);
                });
                provider.onChangeNetwork(handleNetworkChange);
            }
            catch (error) {
                const errMsg = error.message;
                this.emit('error', new errors_1.WalletNetworkChangeError(errMsg));
                throw error;
            }
        });
    }
}
exports.MSafeWalletAdapter = MSafeWalletAdapter;
/**
 * @deprecated Use `MSafeWalletName` instead.
 */
exports.MsafeWalletName = exports.MSafeWalletName;
/**
 * @deprecated Use `MSafeWalletAdapter` instead.
 */
class MsafeWalletAdapter extends MSafeWalletAdapter {
}
exports.MsafeWalletAdapter = MsafeWalletAdapter;
//# sourceMappingURL=MsafeWallet.js.map