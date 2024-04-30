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
exports.OkxWalletAdapter = exports.OKXWalletName = void 0;
const BaseAdapter_1 = require("./BaseAdapter");
const WalletProviders_1 = require("../WalletProviders");
exports.OKXWalletName = "OKX Wallet";
class OkxWalletAdapter extends BaseAdapter_1.BaseWalletAdapter {
    constructor({ timeout = 10000 } = {}) {
        super();
        this.networkToChainId = {
            mainnet: 1,
        };
        this.name = exports.OKXWalletName;
        this.url = "https://okx.com/web3/";
        this.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJDSURBVHgB7Zq9jtpAEMfHlhEgQLiioXEkoAGECwoKxMcTRHmC5E3IoyRPkPAEkI7unJYmTgEFTYwA8a3NTKScLnCHN6c9r1e3P2llWQy7M/s1Gv1twCP0ej37dDq9x+Zut1t3t9vZjDEHIiSRSPg4ZpDL5fxkMvn1cDh8m0wmfugfO53OoFQq/crn8wxfY9EymQyrVCqMfHvScZx1p9ls3pFxXBy/bKlUipGPrVbLuQqAfsCliq3zl0H84zwtjQrOw4Mt1W63P5LvBm2d+Xz+YzqdgkqUy+WgWCy+Mc/nc282m4FqLBYL+3g8fjDxenq72WxANZbLJeA13zDX67UDioL5ybXwafMYu64Ltn3bdDweQ5R97fd7GyhBQMipx4POeEDHIu2LfDdBIGGz+hJ9CQ1ABjoA2egAZPM6AgiCAEQhsi/C4jHyPA/6/f5NG3Ks2+3CYDC4aTccDrn6ojG54MnEvG00GoVmWLIRNZ7wTCwDHYBsdACy0QHIhiuRETxlICWpMMhGZHmqS8qH6JLyGegAZKMDkI0uKf8X4SWlaZo+Pp1bRrwlJU8ZKLIvUjKh0WiQ3sRUbNVq9c5Ebew7KEo2m/1p4jJ4qAmDaqDQBzj5XyiAT4VCQezJigAU+IDU+z8vJFnGWeC+bKQV/5VZ71FV6L7PA3gg3tXrdQ+DgLhC+75Wq3no69P3MC0NFQpx2lL04Ql9gHK1bRDjsSBIvScBnDTk1WrlGIZBorIDEYJj+rhdgnQ67VmWRe0zlplXl81vcyEt0rSoYDUAAAAASUVORK5CYII=";
        this._readyState = typeof window !== "undefined"
            ? (window === null || window === void 0 ? void 0 : window.okxwallet)
                ? BaseAdapter_1.WalletReadyState.Installed
                : BaseAdapter_1.WalletReadyState.NotDetected
            : BaseAdapter_1.WalletReadyState.Unsupported;
        this._provider = typeof window !== 'undefined' ? window.okxwallet : undefined;
        this._network = undefined;
        this._timeout = timeout;
        this._connecting = false;
        this._wallet = null;
        if (typeof window !== 'undefined' && this._readyState !== BaseAdapter_1.WalletReadyState.Unsupported) {
            (0, BaseAdapter_1.scopePollingDetectionStrategy)(() => {
                if (window.okxwallet) {
                    this._readyState = BaseAdapter_1.WalletReadyState.Installed;
                    this.emit('readyStateChange', this._readyState);
                    return true;
                }
                return false;
            });
        }
    }
    get publicAccount() {
        var _a, _b;
        return {
            publicKey: ((_a = this._wallet) === null || _a === void 0 ? void 0 : _a.publicKey) || null,
            address: ((_b = this._wallet) === null || _b === void 0 ? void 0 : _b.address) || null,
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
                    throw new WalletProviders_1.WalletNotReadyError();
                this._connecting = true;
                const provider = this._provider || window.okxwallet;
                const response = yield ((_a = provider.aptos) === null || _a === void 0 ? void 0 : _a.connect());
                if (!response) {
                    throw new WalletProviders_1.WalletNotConnectedError(`${exports.OKXWalletName} Connect Error`);
                }
                const walletAccount = response.address;
                const publicKey = response.publicKey;
                if (walletAccount) {
                    this._wallet = {
                        address: walletAccount,
                        publicKey,
                        isConnected: true
                    };
                    try {
                        const networkInfo = yield this.getNetwork();
                        this._network = networkInfo.name;
                        this._chainId = networkInfo.chainId;
                        this._api = networkInfo.api;
                    }
                    catch (error) {
                        const errMsg = error.message;
                        this.emit('error', new WalletProviders_1.WalletGetNetworkError(errMsg));
                        throw error;
                    }
                }
                this.emit('connect', ((_b = this._wallet) === null || _b === void 0 ? void 0 : _b.address) || '');
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
    getNetwork() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield ((_b = (_a = this._provider) === null || _a === void 0 ? void 0 : _a.aptos) === null || _b === void 0 ? void 0 : _b.network());
                if (!response)
                    throw `${exports.OKXWalletName} Network Error`;
                return {
                    name: response.toLowerCase(),
                    chainId: this.networkToChainId[response.toLowerCase()],
                    api: ''
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    disconnect() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = this._wallet;
            const provider = this._provider || window.okxwallet;
            if (wallet) {
                this._wallet = null;
                try {
                    yield ((_a = provider === null || provider === void 0 ? void 0 : provider.aptos) === null || _a === void 0 ? void 0 : _a.disconnect());
                }
                catch (error) {
                    this.emit('error', new WalletProviders_1.WalletDisconnectionError(error === null || error === void 0 ? void 0 : error.message, error));
                }
            }
            this.emit('disconnect');
        });
    }
    signAndSubmitTransaction(transaction, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.okxwallet;
                if (!wallet || !provider)
                    throw new WalletProviders_1.WalletNotConnectedError();
                const response = yield ((_a = provider === null || provider === void 0 ? void 0 : provider.aptos) === null || _a === void 0 ? void 0 : _a.signAndSubmitTransaction(transaction, options));
                if (!response) {
                    throw new Error("No response");
                }
                return response;
            }
            catch (error) {
                // TODO: Message is improperly set from upstream, please convert it properly into a string.  Right now it shows the below:
                // `{"code":-32603,"message":"[object Object]","data":{"originalError":{}}}`
                // The `[object Object]` should be a string representation of the error, which should have an error message from the VM or elsewhere.
                // The JSON .stringify is a temporary fix to get some message to show up.
                throw new Error(`${JSON.stringify(error)}`);
            }
        });
    }
    signTransaction(transaction, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.okxwallet;
                if (!wallet || !provider)
                    throw new WalletProviders_1.WalletNotConnectedError();
                const response = yield ((_a = provider === null || provider === void 0 ? void 0 : provider.aptos) === null || _a === void 0 ? void 0 : _a.signTransaction(transaction, options));
                if (!response) {
                    throw new Error("Failed to sign transaction");
                }
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    signMessage(message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.okxwallet;
                if (!wallet || !provider)
                    throw new WalletProviders_1.WalletNotConnectedError();
                if (typeof message !== "object" || !message.nonce) {
                    `${exports.OKXWalletName} Invalid signMessage Payload`;
                }
                const response = yield ((_a = provider === null || provider === void 0 ? void 0 : provider.aptos) === null || _a === void 0 ? void 0 : _a.signMessage(message));
                if (response) {
                    return response;
                }
                else {
                    throw `${exports.OKXWalletName} Sign Message failed`;
                }
            }
            catch (error) {
                const errMsg = error.message;
                throw errMsg;
            }
        });
    }
    onNetworkChange() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.okxwallet;
                if (!wallet || !provider)
                    throw new WalletProviders_1.WalletNotConnectedError();
                const handleNetworkChange = (newNetwork) => {
                    var _a, _b, _c;
                    this._network = (_a = newNetwork.networkName) === null || _a === void 0 ? void 0 : _a.name;
                    this._api = (_b = newNetwork.networkName) === null || _b === void 0 ? void 0 : _b.api;
                    this._chainId = (_c = newNetwork.networkName) === null || _c === void 0 ? void 0 : _c.chainId;
                    this.emit('networkChange', this._network);
                };
                yield ((_a = provider === null || provider === void 0 ? void 0 : provider.aptos) === null || _a === void 0 ? void 0 : _a.onNetworkChange(handleNetworkChange));
            }
            catch (error) {
                const errMsg = error.message;
                throw errMsg;
            }
        });
    }
    onAccountChange() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                const provider = this._provider || window.okxwallet;
                if (!wallet || !provider)
                    throw new WalletProviders_1.WalletNotConnectedError();
                const handleAccountChange = (newAccount) => __awaiter(this, void 0, void 0, function* () {
                    if (newAccount === null) {
                        yield this.disconnect();
                        return;
                    }
                    if (newAccount === null || newAccount === void 0 ? void 0 : newAccount.publicKey) {
                        this._wallet.publicKey = newAccount.publicKey;
                        this._wallet.address = newAccount.address;
                        this._wallet.minKeysRequired = newAccount.minKeysRequired;
                        this.emit('accountChange', newAccount.address);
                    }
                    else if (wallet.isConnected) {
                        yield this.connect();
                    }
                });
                yield ((_a = provider === null || provider === void 0 ? void 0 : provider.aptos) === null || _a === void 0 ? void 0 : _a.onAccountChange(handleAccountChange));
            }
            catch (error) {
                console.log(error);
                const errMsg = error.message;
                throw errMsg;
            }
        });
    }
}
exports.OkxWalletAdapter = OkxWalletAdapter;
//# sourceMappingURL=OkxWallet.js.map