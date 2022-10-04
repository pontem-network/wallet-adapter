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
exports.useWalletProviderStore = void 0;
const vue_1 = require("vue");
const pinia_1 = require("pinia");
const WalletProviders_1 = require("../WalletProviders");
const WalletAdapters_1 = require("../WalletAdapters");
const getWalletNameFromLocalStorage = (key) => {
    try {
        const value = localStorage.getItem(key);
        if (value)
            return JSON.parse(value);
    }
    catch (e) {
        if (typeof window !== 'undefined') {
            console.error(e);
        }
    }
    return null;
};
exports.useWalletProviderStore = (0, pinia_1.defineStore)('walletProviderStore', () => {
    const adapters = (0, vue_1.ref)([]);
    const localStorageKey = (0, vue_1.ref)('walletName');
    const autoConnect = (0, vue_1.ref)(false);
    const onError = (0, vue_1.ref)(undefined);
    // init method which developer should call from Vue component to init store with wallets and parameters
    function init({ wallets = [], onError: onHandleError, localStorageKey: lsKey, autoConnect: autoConnection }) {
        adapters.value = wallets;
        if (lsKey)
            localStorageKey.value = lsKey;
        if (autoConnection !== undefined)
            autoConnect.value = autoConnection;
        if (onError)
            onError.value = onHandleError;
    }
    const walletName = (0, vue_1.ref)(null);
    const wallet = (0, vue_1.ref)(null);
    const adapter = (0, vue_1.ref)(null);
    const account = (0, vue_1.ref)(null);
    const connected = (0, vue_1.ref)(false);
    const connecting = (0, vue_1.ref)(false);
    const disconnecting = (0, vue_1.ref)(false);
    const isUnloading = (0, vue_1.ref)(false);
    const readyState = (0, vue_1.computed)(() => { var _a; return ((_a = adapter.value) === null || _a === void 0 ? void 0 : _a.readyState) || WalletAdapters_1.WalletReadyState.Unsupported; });
    const walletNetwork = (0, vue_1.ref)(null);
    // Wrap adapters to conform to the `Wallet` interface
    const wallets = (0, vue_1.ref)([]);
    // Sets default state when none of wallets connected
    function setDefaultState() {
        wallet.value = null;
        adapter.value = null;
        account.value = null;
        connected.value = false;
    }
    // When the wallets change, start listen for changes to their `readyState`
    (0, vue_1.watch)(adapters, (_value, _oldValue, onCleanup) => {
        function handleReadyStateChange(isReadyState) {
            wallets.value = wallets.value.map((prevWallet) => {
                if (prevWallet.adapter.name === this.name) {
                    return Object.assign(Object.assign({}, prevWallet), { isReadyState });
                }
                return prevWallet;
            });
        }
        wallets.value = adapters.value.map((adpt) => ({
            adapter: adpt,
            readyState: adpt.readyState
        }));
        for (const wAdapter of adapters.value) {
            wAdapter.on('readyStateChange', handleReadyStateChange, wAdapter);
        }
        // When adapters dependency changed - cleanUp function runs before body of watcher;
        onCleanup(() => {
            for (const wAdapter of adapters.value) {
                wAdapter.off('readyStateChange', handleReadyStateChange, wAdapter);
            }
        });
    });
    // autoConnect adapter if localStorage not empty
    (0, vue_1.watch)([autoConnect, localStorageKey], () => {
        walletName.value = getWalletNameFromLocalStorage(localStorageKey.value);
    });
    function handleAddressChange() {
        var _a;
        function handleChange(address) {
            if (address) {
                account.value.address = address;
            }
        }
        if (!adapter.value)
            return;
        try {
            if (!((_a = adapter.value) === null || _a === void 0 ? void 0 : _a.onAccountChange))
                return;
            adapter.value.onAccountChange(handleChange);
        }
        catch (e) {
            (onError.value || console.error)(e);
        }
    }
    function handleNetworkChange() {
        var _a;
        function handleChange(network) {
            if (network) {
                walletNetwork.value = network;
            }
        }
        if (!adapter.value)
            return;
        try {
            if (!((_a = adapter.value) === null || _a === void 0 ? void 0 : _a.onNetworkChange))
                return;
            adapter.value.onNetworkChange(handleChange);
        }
        catch (e) {
            (onError.value || console.error)(e);
        }
    }
    function getNetwork() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = adapter.value) === null || _a === void 0 ? void 0 : _a.network) {
                try {
                    const network = yield adapter.value.network();
                    if (network) {
                        walletNetwork.value = network;
                    }
                }
                catch (e) {
                    (onError.value || console.error)(e);
                }
            }
        });
    }
    // set or reset current wallet from localstorage
    function setWalletName(name) {
        try {
            if (name === null) {
                localStorage.removeItem(localStorageKey.value);
                walletName.value = null;
            }
            else {
                localStorage.setItem(localStorageKey.value, JSON.stringify(name));
                walletName.value = name;
            }
        }
        catch (e) {
            if (typeof window !== 'undefined') {
                console.error(e);
            }
        }
    }
    //Handle the adapter's connect event
    function handleAfterConnect() {
        if (!adapter.value)
            return;
        connected.value = adapter.value.connected;
        account.value = adapter.value.publicAccount;
        handleAddressChange();
        handleNetworkChange();
        getNetwork();
    }
    // Handle the adapter's disconnect event
    function handleDisconnect() {
        if (!isUnloading.value)
            setWalletName(null);
        setDefaultState();
    }
    // Handle the adapter's error event, and local errors
    function handleError(error) {
        if (!isUnloading.value)
            (onError.value || console.error)(error);
        return error;
    }
    // function to connect adapter
    function connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (connecting.value || disconnecting.value || connected.value)
                return;
            const selectedWallet = wallets.value.find((wAdapter) => wAdapter.adapter.name === walletName.value);
            if (selectedWallet) {
                wallet.value = selectedWallet;
                adapter.value = selectedWallet.adapter;
                connected.value = selectedWallet.adapter.connected;
                account.value = selectedWallet.adapter.publicAccount;
            }
            else {
                setDefaultState();
            }
            if (!(selectedWallet === null || selectedWallet === void 0 ? void 0 : selectedWallet.adapter))
                throw handleError(new WalletProviders_1.WalletNotSelectedError());
            if (!(selectedWallet.adapter.readyState === WalletAdapters_1.WalletReadyState.Installed ||
                selectedWallet.adapter.readyState === WalletAdapters_1.WalletReadyState.Loadable)) {
                // Clear the selected wallet
                setWalletName(null);
                if (typeof window !== 'undefined' && selectedWallet.adapter.url) {
                    window.open(selectedWallet.adapter.url, '_blank');
                }
                throw handleError(new WalletProviders_1.WalletNotReadyError());
            }
            connecting.value = true;
            try {
                yield selectedWallet.adapter.connect();
            }
            catch (error) {
                // Clear the selected wallet
                setWalletName(null);
                // Rethrow the error, and handleError will also be called
                throw error;
            }
            finally {
                connecting.value = false;
                handleAfterConnect();
            }
        });
    }
    // function to disconnect adapter and clear localstorage
    function disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (disconnecting.value)
                return;
            if (!adapter.value) {
                setWalletName(null);
                return;
            }
            disconnecting.value = true;
            try {
                yield adapter.value.disconnect();
            }
            catch (error) {
                // Clear the selected wallet
                setWalletName(null);
                // Rethrow the error, and handleError will also be called
                throw error;
            }
            finally {
                disconnecting.value = false;
                handleDisconnect();
            }
        });
    }
    // If autoConnect is enabled, try to connect when the adapter changes and is ready
    (0, vue_1.watch)([walletName, adapter, connecting, connected, readyState], () => {
        if (connecting.value ||
            connected.value ||
            !walletName.value ||
            !autoConnect.value ||
            !(readyState.value === WalletAdapters_1.WalletReadyState.Installed || WalletAdapters_1.WalletReadyState.Loadable)) {
            return;
        }
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield connect();
                }
                catch (error) {
                    setWalletName(null);
                }
            });
        })();
    });
    function signAndSubmitTransaction(transaction, option) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!adapter.value)
                throw handleError(new WalletProviders_1.WalletNotSelectedError());
            if (!connected.value)
                throw handleError(new WalletProviders_1.WalletNotConnectedError());
            const response = yield adapter.value.signAndSubmitTransaction(transaction, option);
            return response;
        });
    }
    function signTransaction(transaction, option) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!adapter.value)
                throw handleError(new WalletProviders_1.WalletNotSelectedError());
            if (!connected.value)
                throw handleError(new WalletProviders_1.WalletNotConnectedError());
            const response = yield adapter.value.signTransaction(transaction, option);
            return response;
        });
    }
    function signMessage(msgPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!adapter.value)
                throw handleError(new WalletProviders_1.WalletNotSelectedError());
            if (!connected.value)
                throw handleError(new WalletProviders_1.WalletNotConnectedError());
            const response = yield adapter.value.signMessage(msgPayload);
            return response;
        });
    }
    return {
        init,
        wallets,
        wallet,
        account,
        connected,
        connecting,
        disconnecting,
        autoConnect,
        network: walletNetwork,
        select: setWalletName,
        connect,
        disconnect,
        signAndSubmitTransaction,
        signTransaction,
        signMessage
    };
});
//# sourceMappingURL=useVueWalletProvider.js.map