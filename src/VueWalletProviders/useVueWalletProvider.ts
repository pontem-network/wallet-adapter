import { Types } from 'aptos';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

import {
  AccountKeys,
  NetworkInfo,
  SignMessagePayload,
  WalletAdapter,
  WalletName,
  WalletReadyState
} from '../WalletAdapters';
import {
  Wallet,
  WalletError,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletNotSelectedError
} from '../WalletProviders';
import { isMobile, isRedirectable } from '../utilities/helpers';
import {AdapterPlugin, PluginProvider} from "@aptos-labs/wallet-adapter-core";

interface IUseVueWalletProvider {
  wallets: WalletAdapter[];
  onError?: (error: WalletError) => void;
  localStorageKey?: string;
  autoConnect: boolean;
}

const getWalletNameFromLocalStorage = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    if (value) return JSON.parse(value);
  } catch (e: any) {
    if (typeof window !== 'undefined') {
      console.error(e);
    }
  }
  return null;
};

export const useWalletProviderStore = defineStore('walletProviderStore', () => {
  const adapters = ref<WalletAdapter[]>([]);
  const localStorageKey = ref<string>('walletName');
  const autoConnect = ref<boolean>(false);
  const onError = ref<((error: WalletError) => void) | undefined>(undefined);

  function init({
                  wallets = [],
                  onError: onHandleError,
                  localStorageKey: lsKey,
                  autoConnect: autoConnection
                }: IUseVueWalletProvider) {
    adapters.value = wallets;
    if (lsKey) localStorageKey.value = lsKey;
    if (autoConnection !== undefined) autoConnect.value = autoConnection;
    if (onError.value) onError.value = onHandleError;
  }

  const walletName = ref<WalletName | null>(null);
  const wallet = ref<Wallet | null>(null);
  const adapter = ref<WalletAdapter | null>(null);
  const account = ref<AccountKeys | null>(null);
  const connected = ref<boolean>(false);
  const connecting = ref<boolean>(false);
  const disconnecting = ref<boolean>(false);
  const readyState = ref<WalletReadyState>(WalletReadyState.Unsupported);
  const walletNetwork = ref<NetworkInfo | null>(null);

  const wallets = ref<Wallet[]>([]);

  // Setting default state to yours
  function setDefaultState() {
    wallet.value = null;
    adapter.value = null;
    account.value = null;
    connected.value = false;
    walletNetwork.value = null;
  }

  // When the wallets change, start listen for changes to their `readyState`
  watch(adapters, (_value, _oldValue, onCleanup) => {
    function handleReadyStateChange(this: WalletAdapter, isReadyState: WalletReadyState) {
      const index = wallets.value.findIndex((prevWallet) => prevWallet.adapter.name === this.name);
      if (index === -1) return wallets.value;
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
    if (!adapter.value) return;
    account.value = adapter.value.publicAccount;
  }

  function handleNetworkChange() {
    if (!adapter.value) return;
    walletNetwork.value = adapter.value.network;
  }

  // set or reset current wallet from localstorage
  function setWalletName(name: WalletName | null) {
    try {
      if (name === null) {
        localStorage.removeItem(localStorageKey.value);
        walletName.value = null;
      } else {
        localStorage.setItem(localStorageKey.value, JSON.stringify(name));
        walletName.value = name;
      }
    } catch (e: any) {
      if (typeof window !== 'undefined') {
        console.error(e);
      }
    }
  }

  //Handle the adapter's connect event - add network and account listeners.
  function handleAfterConnect() {
    if (!adapter.value) return;
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
    if (!adapter.value) return;
    adapter.value.off('accountChange', handleAddressChange);
    adapter.value.off('networkChange', handleNetworkChange);
    adapter.value.off('disconnect', handleDisconnect);
    adapter.value.off('error', handleError);
    setDefaultState();
  }

  // Handle the adapter's error event, and local errors
  function handleError(error: WalletError) {
    if (onError.value)
      (onError.value || console.log)(error);
    return error;
  }

  // function to connect adapter
  async function connect() {
    if (connecting.value || disconnecting.value || connected.value) return;
    const selectedWallet = wallets.value.find(
      (wAdapter) => wAdapter.adapter.name === walletName.value
    );

    if (!selectedWallet?.adapter) throw handleError(new WalletNotSelectedError());

    // check if we are in a redirectable view (i.e on mobile AND not in an in-app browser) and
    // since wallet readyState can be NotDetected, we check it before the next check
    if (isRedirectable()) {
      // use wallet deep link
      if (selectedWallet.adapter.deeplinkProvider) {
        const url = encodeURIComponent(window.location.href);
        const location = selectedWallet.adapter.deeplinkProvider({ url });
        window.location.href = location;
      }
    }

    if (
      !(
        selectedWallet.adapter.readyState === WalletReadyState.Installed ||
        selectedWallet.adapter.readyState === WalletReadyState.Loadable
      )
    ) {
      // Clear the selected wallet
      setWalletName(null);

      if (typeof window !== 'undefined' && selectedWallet.adapter.url && !isMobile()) {
        window.open(selectedWallet.adapter.url, '_blank');
      }

      throw handleError(new WalletNotReadyError());
    }

    connecting.value = true;
    try {
      await selectedWallet.adapter.connect();
      wallet.value = selectedWallet;
      adapter.value = selectedWallet.adapter;
      connected.value = selectedWallet.adapter.connected;
      if (selectedWallet.adapter.name === 'Msafe') {
        account.value = await (selectedWallet.adapter as unknown as PluginProvider).account();
      } else {
        account.value = selectedWallet.adapter.publicAccount;
      }
      walletNetwork.value = selectedWallet.adapter.network;
      handleAfterConnect();
    } catch (error: any) {
      // Clear the selected wallet
      setWalletName(null);
      // Rethrow the error, and handleError will also be called
      throw error;
    } finally {
      connecting.value = false;
    }
  }

  // function to disconnect adapter and clear localstorage
  async function disconnect() {
    if (disconnecting.value) return;
    if (!adapter.value) {
      setWalletName(null);
      return;
    }

    disconnecting.value = true;
    try {
      await adapter.value?.disconnect();
    } catch (error: any) {
      // Clear the selected wallet
      setWalletName(null);
      // Rethrow the error, and handleError will also be called
      throw error;
    } finally {
      disconnecting.value = false;
      handleDisconnect();
    }
  }

  watch([walletName, wallets, readyState], () => {
    wallets.value.forEach((item) => {
      if (walletName.value === item.adapter.name) {
        readyState.value = item.adapter.readyState;
      }
    });
  });

  // autoConnect adapter if localStorage not empty
  watch([autoConnect, localStorageKey, walletName], () => {
    walletName.value = getWalletNameFromLocalStorage(localStorageKey.value);
  });

  // If autoConnect is enabled, try to connect when the adapter changes and is ready
  watch([connecting, connected, readyState, autoConnect], () => {
    if (
      connecting.value ||
      connected.value ||
      !autoConnect.value ||
      readyState.value === WalletReadyState.Unsupported
    ) {
      return;
    }
    (async function () {
      try {
        await connect();
      } catch (error: any) {
        handleError(error);
      }
    })();
  });

  async function signAndSubmitTransaction(transaction: Types.TransactionPayload, option?: any) {
    if (!adapter.value) throw handleError(new WalletNotSelectedError());
    if (!connected.value) throw handleError(new WalletNotConnectedError());
    const response = await adapter.value.signAndSubmitTransaction(transaction, option);
    return response;
  }

  async function signTransaction(transaction: Types.TransactionPayload, option?: any) {
    if (!adapter.value) throw handleError(new WalletNotSelectedError());
    if (!connected.value) throw handleError(new WalletNotConnectedError());
    const response = await adapter.value.signTransaction(transaction, option);
    return response;
  }

  async function signMessage(msgPayload: string | SignMessagePayload | Uint8Array) {
    if (!adapter.value) throw handleError(new WalletNotSelectedError());
    if (!connected.value) throw handleError(new WalletNotConnectedError());
    const response = await adapter.value.signMessage(msgPayload);
    return response;
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
