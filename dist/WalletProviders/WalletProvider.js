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
exports.WalletProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const errors_1 = require("./errors");
const useLocalStorage_1 = require("../hooks/useLocalStorage");
const BaseAdapter_1 = require("../WalletAdapters/BaseAdapter");
const useWallet_1 = require("./useWallet");
const initialState = {
    wallet: null,
    adapter: null,
    account: null,
    connected: false,
    network: null
};
const WalletProvider = ({ children, wallets: adapters, autoConnect = false, onError, localStorageKey = 'walletName' }) => {
    const [name, setName] = (0, useLocalStorage_1.useLocalStorage)(localStorageKey, null);
    const [{ wallet, adapter, account, connected, network }, setState] = (0, react_1.useState)(initialState);
    const readyState = (adapter === null || adapter === void 0 ? void 0 : adapter.readyState) || BaseAdapter_1.WalletReadyState.Unsupported;
    const [connecting, setConnecting] = (0, react_1.useState)(false);
    const [disconnecting, setDisconnecting] = (0, react_1.useState)(false);
    const isConnecting = (0, react_1.useRef)(false);
    const isDisconnecting = (0, react_1.useRef)(false);
    const isUnloading = (0, react_1.useRef)(false);
    // Wrap adapters to conform to the `Wallet` interface
    const [wallets, setWallets] = (0, react_1.useState)(() => adapters.map((adpt) => ({
        adapter: adpt,
        readyState: adpt.readyState
    })));
    // When the wallets change, start to listen for changes to their `readyState`
    (0, react_1.useEffect)(() => {
        // When the adapters change, wrap them to conform to the `Wallet` interface
        setWallets((currentWallets) => adapters.map((wAdapter, index) => {
            const currentWallet = currentWallets[index];
            // If the wallet hasn't changed, return the same instance
            return currentWallet &&
                currentWallet.adapter === wAdapter &&
                currentWallet.readyState === wAdapter.readyState
                ? currentWallet
                : {
                    adapter: wAdapter,
                    readyState: wAdapter.readyState
                };
        }));
        function handleReadyStateChange(wReadyState) {
            setWallets((prevWallets) => {
                const index = prevWallets.findIndex(({ adapter: wAdapter }) => wAdapter === this);
                if (index === -1)
                    return prevWallets;
                const { adapter: wAdapter } = prevWallets[index];
                return [
                    ...prevWallets.slice(0, index),
                    { adapter: wAdapter, readyState: wReadyState },
                    ...prevWallets.slice(index + 1)
                ];
            });
        }
        adapters.forEach((wAdapter) => wAdapter.on('readyStateChange', handleReadyStateChange, wAdapter));
        return () => adapters.forEach((wAdapter) => wAdapter.off('readyStateChange', handleReadyStateChange, wAdapter));
    }, [adapters]);
    // When the selected wallet changes, initialize the state
    (0, react_1.useEffect)(() => {
        const selectedWallet = wallets.find((wAdapter) => wAdapter.adapter.name === name);
        if (selectedWallet) {
            console.log('selectedWallets', selectedWallet);
            setState({
                wallet: selectedWallet,
                adapter: selectedWallet.adapter,
                connected: selectedWallet.adapter.connected,
                account: selectedWallet.adapter.publicAccount,
                network: selectedWallet.adapter.network
            });
        }
        else {
            setState(initialState);
        }
    }, [name, wallets]);
    // If the window is closing or reloading, ignore disconnect and error events from the adapter
    (0, react_1.useEffect)(() => {
        function listener() {
            if (!autoConnect) {
                setName(null);
            }
            isUnloading.current = true;
        }
        window.addEventListener('beforeunload', listener);
        return () => window.removeEventListener('beforeunload', listener);
    }, [isUnloading, autoConnect]);
    // Handle the adapter's connect event
    const handleConnect = (0, react_1.useCallback)(() => {
        if (!adapter)
            return;
        setState((state) => {
            return Object.assign(Object.assign({}, state), { connected: adapter.connected, account: adapter.publicAccount, network: adapter.network });
        });
    }, [adapter]);
    // Handle the adapter's network event
    const handleNetworkChange = (0, react_1.useCallback)(() => {
        if (!adapter)
            return;
        console.log('adapter: handleNetworkChange', adapter.network);
        setState((state) => {
            return Object.assign(Object.assign({}, state), { network: adapter.network });
        });
    }, [adapter]);
    // Handle the adapter's account event
    const handleAccountChange = (0, react_1.useCallback)(() => {
        if (!adapter)
            return;
        console.log('adapter: handleAccountChange', adapter.publicAccount);
        setState((state) => {
            return Object.assign(Object.assign({}, state), { account: adapter.publicAccount });
        });
    }, [adapter]);
    // Handle the adapter's disconnect event
    const handleDisconnect = (0, react_1.useCallback)(() => {
        // Clear the selected wallet unless the window is unloading
        if (!isUnloading.current)
            setName(null);
    }, [isUnloading, setName]);
    // Handle the adapter's error event, and local errors
    const handleError = (0, react_1.useCallback)((error) => {
        // Call onError unless the window is unloading
        if (!isUnloading.current)
            (onError || console.error)(error);
        return error;
    }, [isUnloading, onError]);
    // Listen on the adapter's network/account changes
    (0, react_1.useEffect)(() => {
        if (adapter && connected) {
            adapter.onAccountChange();
            adapter.onNetworkChange();
        }
    }, [adapter, connected]);
    // Setup and teardown event listeners when the adapter changes
    (0, react_1.useEffect)(() => {
        if (adapter) {
            adapter.on('connect', handleConnect);
            adapter.on('networkChange', handleNetworkChange);
            adapter.on('accountChange', handleAccountChange);
            adapter.on('disconnect', handleDisconnect);
            adapter.on('error', handleError);
            return () => {
                adapter.off('connect', handleConnect);
                adapter.off('networkChange', handleNetworkChange);
                adapter.off('accountChange', handleAccountChange);
                adapter.off('disconnect', handleDisconnect);
                adapter.off('error', handleError);
            };
        }
    }, [
        adapter,
        handleAccountChange,
        handleConnect,
        handleDisconnect,
        handleError,
        handleNetworkChange
    ]);
    // When the adapter changes, disconnect the old one
    (0, react_1.useEffect)(() => {
        return () => {
            adapter === null || adapter === void 0 ? void 0 : adapter.disconnect();
        };
    }, [adapter]);
    // If autoConnect is enabled, try to connect when the adapter changes and is ready
    (0, react_1.useEffect)(() => {
        if (isConnecting.current || connected || !autoConnect || !adapter)
            return;
        // Handle wallet not installed in Auto-connect mode
        if (!(readyState === BaseAdapter_1.WalletReadyState.Installed || readyState === BaseAdapter_1.WalletReadyState.Loadable)) {
            // Clear the selected wallet
            setName(null);
            if (typeof window !== 'undefined') {
                window.open(adapter.url, '_blank');
            }
            handleError(new errors_1.WalletNotReadyError());
            return;
        }
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                isConnecting.current = true;
                setConnecting(true);
                try {
                    yield adapter.connect();
                }
                catch (error) {
                    // Clear the selected wallet
                    setName(null);
                    // Don't throw error, but handleError will still be called
                }
                finally {
                    setConnecting(false);
                    isConnecting.current = false;
                }
            });
        })();
    }, [isConnecting, connected, autoConnect, adapter, readyState, setName]);
    // Connect the adapter to the wallet
    const connect = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (isConnecting.current || isDisconnecting.current || connected)
            return;
        if (!adapter)
            throw handleError(new errors_1.WalletNotSelectedError());
        if (!(readyState === BaseAdapter_1.WalletReadyState.Installed || readyState === BaseAdapter_1.WalletReadyState.Loadable)) {
            // Clear the selected wallet
            setName(null);
            if (typeof window !== 'undefined') {
                window.open(adapter.url, '_blank');
            }
            throw handleError(new errors_1.WalletNotReadyError());
        }
        isConnecting.current = true;
        setConnecting(true);
        try {
            yield adapter.connect();
        }
        catch (error) {
            // Clear the selected wallet
            setName(null);
            // Rethrow the error, and handleError will also be called
            throw error;
        }
        finally {
            setConnecting(false);
            isConnecting.current = false;
        }
    }), [isConnecting, isDisconnecting, connected, adapter, readyState, handleError, setName]);
    // Disconnect the adapter from the wallet
    const disconnect = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (isDisconnecting.current)
            return;
        if (!adapter)
            return setName(null);
        isDisconnecting.current = true;
        setDisconnecting(true);
        try {
            yield adapter.disconnect();
        }
        catch (error) {
            // Clear the selected wallet
            setName(null);
            // Rethrow the error, and handleError will also be called
            throw error;
        }
        finally {
            setDisconnecting(false);
            isDisconnecting.current = false;
        }
    }), [isDisconnecting, setName, adapter]);
    // Send a transaction using the provided connection
    const signAndSubmitTransaction = (0, react_1.useCallback)((transaction, option) => __awaiter(void 0, void 0, void 0, function* () {
        if (!adapter)
            throw handleError(new errors_1.WalletNotSelectedError());
        if (!connected)
            throw handleError(new errors_1.WalletNotConnectedError());
        const response = yield adapter.signAndSubmitTransaction(transaction, option);
        return response;
    }), [adapter, handleError, connected]);
    const signTransaction = (0, react_1.useCallback)((transaction, option) => __awaiter(void 0, void 0, void 0, function* () {
        if (!adapter)
            throw handleError(new errors_1.WalletNotSelectedError());
        if (!connected)
            throw handleError(new errors_1.WalletNotConnectedError());
        return adapter.signTransaction(transaction, option);
    }), [adapter, handleError, connected]);
    const signMessage = (0, react_1.useCallback)((msgPayload) => __awaiter(void 0, void 0, void 0, function* () {
        if (!adapter)
            throw handleError(new errors_1.WalletNotSelectedError());
        if (!connected)
            throw handleError(new errors_1.WalletNotConnectedError());
        return adapter.signMessage(msgPayload);
    }), [adapter, handleError, connected]);
    return (
    // @ts-ignore
    (0, jsx_runtime_1.jsx)(useWallet_1.WalletContext.Provider, Object.assign({ value: {
            wallets,
            wallet,
            account,
            connected,
            connecting,
            disconnecting,
            autoConnect,
            select: setName,
            connect,
            disconnect,
            signAndSubmitTransaction,
            signTransaction,
            signMessage,
            network
        } }, { children: children })));
};
exports.WalletProvider = WalletProvider;
//# sourceMappingURL=WalletProvider.js.map