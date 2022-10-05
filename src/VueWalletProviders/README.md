# pontem-wallet-adapter

Vue `WalletProvider` supporting loads of aptos wallets.

Supports:

- [Pontem Wallet](https://pontem.network/pontem-wallet)
- [Aptos official wallet](https://github.com/aptos-labs/aptos-core/releases/tag/wallet-v0.1.1)
- [Martian wallet](https://martianwallet.xyz/)
- [Fewcha wallet](https://fewcha.app/)
- [Hippo wallet](https://github.com/hippospace/hippo-wallet)
- [Hippo web wallet](https://hippo-wallet-test.web.app/)
- [Spika wallet](https://spika.app)
- [Rise Wallet](https://rise)
- [Fletch wallet](http://fletchwallet.io/)

# Installation

Your app required as dependency:

```json
{
  "dependencies": {
    "vue": "^3.X.X",
    "pinia": "^2.X.X",
    ...
  }
}
```

# Use Vue Wallet Provider

```typescript
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import { useWalletProviderStore } from "@manahippo/aptos-wallet-adapter";

const app = createApp(App);

/**
 * To solve issue with call pinia before pinia mounted we should use store here with pinia passed to store
 * The order of next 3 lines matters. 
 * */
const pinia = createPinia();
app.use(pinia);
const _store = useWalletProviderStore(pinia);

app.mount("#app");
```

# Init store inside Vue Component 

You can use both [composition](https://vuejs.org/guide/extras/composition-api-faq.html) and [options](https://vuejs.org/guide/typescript/options-api.html) API

```typescript
<script lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref, defineComponent } from "vue";
import {
  AptosWalletAdapter,
  MartianWalletAdapter,
  PontemWalletAdapter,
  useWalletProviderStore,
  WalletName,
} from "@manahippo/aptos-wallet-adapter";

const defaultWalletName = "Pontem" as WalletName<"Pontem">;
const handleError = (error) => {
  /* some fancy notify error callback or just console.log handle */
}

export default defineComponent({
  name: "App",
  setup: function () {
    const store = useWalletProviderStore();
    const walletAdapters = [new PontemWalletAdapter(), new MartianWalletAdapter(), new AptosWalletAdapter()];

    const {
      select,
      connect,
      disconnect,
      signAndSubmitTransaction,
      signTransaction,
      signMessage,
      init,
    } = store; // this is methods:
    /**
     * select(walletName): selects one of walletAdapters(sets walletName to localstorage with localStorageKey)
     *                      If autoConnect = true - also will autoconnect wallet. 
     * connect(): connect selected wallet (first need to call select and pass walletName).
     * disconnect(): disconnects currently connected wallet.
     * signAndSubmitTransaction(transactionPayload, options?): Signs and submits transaction and returns hash 
     * signTransaction(transactionPayload, options?): signs transaction and returns Uint8Array
     * signMessage(signMessagePayload, options?): signs message and returns signMessageResponse
     * init({
     *    wallets: array of wallet adapters.
     *    localStorageKey?: string which used as key to store selected walletName at localstorage. 
     *    onError?: callback function to get an error message
     *    autoConnect?: boolean, if true enables autoConnection to keep wallet connected even if page reloaded. 
     *  }): inits store with parameters
     * */
    
    // All refs from store should be extracted with storeToRefs to prevent breaking reactivity:
    const { 
      wallets,
      wallet,
      connected, 
      connecting, 
      account,
      network, 
      disconnecting,
      autoConnect
    } = storeToRefs(store);

    /**
     * wallets: array of walletAdapters, passed on init.
     * wallet: currently selected wallet. 
     * connected: true if selected wallet was succesfully connected 
     * connecting: true while wallet is connecting
     * account: current account data
     * network: current network data (if selected walletAdapter able to pass network)
     * disconnecting: true while wallet is disconnecting
     * autoConnect: autoConnect value, passed on init.
     */

    // Init store should be called once, this method accepts object with next parameters:
    init({
      wallets: walletAdapters,
      localStorageKey: "VueAdapterLocalStorage",
      onError: handleError, 
      autoConnect: true,
    });
</script>
```

