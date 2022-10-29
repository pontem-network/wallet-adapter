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
const pinia_1 = require("pinia");
const vue_1 = require("vue");
const WalletAdapters_1 = require("../WalletAdapters");
const WalletProviders_1 = require("../WalletProviders");
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
    function init({ wallets = [], onError: onHandleError, localStorageKey: lsKey, autoConnect: autoConnection }) {
        adapters.value = wallets;
        if (lsKey)
            localStorageKey.value = lsKey;
        if (autoConnection !== undefined)
            autoConnect.value = autoConnection;
        if (onError.value)
            onError.value = onHandleError;
    }
    const walletName = (0, vue_1.ref)(null);
    const wallet = (0, vue_1.ref)(null);
    const adapter = (0, vue_1.ref)(null);
    const account = (0, vue_1.ref)(null);
    const connected = (0, vue_1.ref)(false);
    const connecting = (0, vue_1.ref)(false);
    const disconnecting = (0, vue_1.ref)(false);
    const readyState = (0, vue_1.ref)(WalletAdapters_1.WalletReadyState.Unsupported);
    const walletNetwork = (0, vue_1.ref)(null);
    const wallets = (0, vue_1.ref)([]);
    // Setting default state to yours
    function setDefaultState() {
        wallet.value = null;
        adapter.value = null;
        account.value = null;
        connected.value = false;
        walletNetwork.value = null;
    }
    // When the wallets change, start listen for changes to their `readyState`
    (0, vue_1.watch)(adapters, (_value, _oldValue, onCleanup) => {
        function handleReadyStateChange(isReadyState) {
            const index = wallets.value.findIndex((prevWallet) => prevWallet.adapter.name === this.name);
            if (index === -1)
                return wallets.value;
            const currentWallet = wallets.value[index];
            wallets.value = [
                ...wallets.value.slice(0, index),
                { adapter: currentWallet.adapter, readyState: isReadyState },
                ...wallets.value.slice(index + 1)
            ];
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
    function handleAddressChange() {
        if (!adapter.value)
            return;
        account.value = adapter.value.publicAccount;
    }
    function handleNetworkChange() {
        if (!adapter.value)
            return;
        walletNetwork.value = adapter.value.network;
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
    //Handle the adapter's connect event - add network and account listeners.
    function handleAfterConnect() {
        if (!adapter.value)
            return;
        adapter.value.on('accountChange', handleAddressChange);
        adapter.value.on('networkChange', handleNetworkChange);
        adapter.value.on('disconnect', handleDisconnect);
        adapter.value.on('error', handleError);
        adapter.value.onAccountChange();
        adapter.value.onNetworkChange();
    }
    // Handle the adapter's disconnect event
    function handleDisconnect() {
        setWalletName(null);
        if (!adapter.value)
            return;
        adapter.value.off('accountChange', handleAddressChange);
        adapter.value.off('networkChange', handleNetworkChange);
        adapter.value.off('disconnect', handleDisconnect);
        adapter.value.off('error', handleError);
        setDefaultState();
    }
    // Handle the adapter's error event, and local errors
    function handleError(error) {
        (onError.value || console.error)(error);
        return error;
    }
    // function to connect adapter
    function connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (connecting.value || disconnecting.value || connected.value)
                return;
            const selectedWallet = wallets.value.find((wAdapter) => wAdapter.adapter.name === walletName.value);
            if (!(selectedWallet === null || selectedWallet === void 0 ? void 0 : selectedWallet.adapter))
                throw handleError(new WalletProviders_1.WalletNotSelectedError());
            if (selectedWallet) {
                wallet.value = selectedWallet;
                adapter.value = selectedWallet.adapter;
                connected.value = selectedWallet.adapter.connected;
                account.value = selectedWallet.adapter.publicAccount;
                walletNetwork.value = selectedWallet.adapter.network;
            }
            else {
                setDefaultState();
                return;
            }
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
                handleAfterConnect();
            }
            catch (error) {
                // Clear the selected wallet
                setWalletName(null);
                // Rethrow the error, and handleError will also be called
                throw error;
            }
            finally {
                connecting.value = false;
            }
        });
    }
    // function to disconnect adapter and clear localstorage
    function disconnect() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (disconnecting.value)
                return;
            if (!adapter.value) {
                setWalletName(null);
                return;
            }
            disconnecting.value = true;
            try {
                yield ((_a = adapter.value) === null || _a === void 0 ? void 0 : _a.disconnect());
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
    (0, vue_1.watch)([walletName, wallets, readyState], () => {
        wallets.value.forEach((item) => {
            if (walletName.value === item.adapter.name) {
                readyState.value = item.adapter.readyState;
            }
        });
    });
    // autoConnect adapter if localStorage not empty
    (0, vue_1.watch)([autoConnect, localStorageKey, walletName], () => {
        walletName.value = getWalletNameFromLocalStorage(localStorageKey.value);
    });
    // If autoConnect is enabled, try to connect when the adapter changes and is ready
    (0, vue_1.watch)([walletName, adapter, connecting, connected, readyState, autoConnect], () => {
        if (connecting.value ||
            connected.value ||
            !walletName.value ||
            !autoConnect.value ||
            readyState.value === WalletAdapters_1.WalletReadyState.Unsupported) {
            return;
        }
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield connect();
                }
                catch (error) {
                    handleError(error);
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