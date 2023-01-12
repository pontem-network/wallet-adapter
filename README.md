<a name="readme-top"></a>
# @pontem/aptos-wallet-adapter
<!-- PROJECT SHIELDS -->
![npm](https://img.shields.io/npm/v/@pontem/aptos-wallet-adapter?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/pontem-network/wallet-adapter?style=for-the-badge)
![GitHub Repo stars](https://img.shields.io/github/stars/pontem-network/wallet-adapter?style=for-the-badge)
![GitHub contributors](https://img.shields.io/github/contributors/pontem-network/wallet-adapter?style=for-the-badge)

React and Vue `WalletProvider` supporting loads of aptos wallets.
Forked and featured with wallet provider based on Vue.js/Pinia.js from [Hippo Wallet Adapter](https://github.com/hippospace/aptos-wallet-adapter).

Supports:

- [Petra wallet](https://petra.app/)
- [Martian wallet](https://martianwallet.xyz/)
- [Fewcha wallet](https://fewcha.app/)
- [Pontem Wallet](https://pontem.network/pontem-wallet)
- [Spika wallet](https://spika.app)
- [Rise wallet](https://risewallet.io/)
- [HyperPay wallet](https://www.hyperpay.io/)
- [Fletch wallet](http://fletchwallet.io/)
- [Spika web wallet](https://spika.app)
- [Aptos snap](https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk)
- [Bitkeep wallet](https://bitkeep.com/)
- [TokenPocket wallet](https://tokenpocket.pro)
- [Blocto wallet](https://portto.com/download)
- [Nightly Wallet](https://nightly.app/download)
- [OpenBlock Wallet](https://openblock.com)
- [Spacecy wallet](https://spacecywallet.com/)

# Installation

with `yarn`

```
yarn add @pontem/aptos-wallet-adapter
```

with `npm`

```
npm install @pontem/aptos-wallet-adapter
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Example for Vue
## Dependencies

Vue app required 2 packages as dependency:
Because Vue and Pinia is optional dependency inside @pontem/aptos-wallet-adapter

```json
{
  "dependencies": {
    "vue": "3.2.40",
    "pinia": "2.0.22",
    ...
  }
}
```

<details>
  <summary>Use Vue Wallet Provider</summary>

```typescript
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import { useWalletProviderStore } from "@pontem/aptos-wallet-adapter";

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

</details>

<details>
  <summary>Init store inside Vue Component</summary>

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
} from "@pontem/aptos-wallet-adapter";

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
     *                      If autoConnect = true - also will connect wallet automatically. 
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
     * wallets: Wallet[]; - array of walletAdapters, passed on init.
     * wallet: Wallet | null; - currently selected wallet. 
     * connected: boolean; - true if selected wallet was succesfully connected 
     * connecting: boolean; - true while wallet is connecting
     * account: AccountKeys | null; { address, publicKey, authKey } - current account data
     * network: NetworkInfo | null; { name, chainId?, api? } current network data (if selected walletAdapter able to pass network)
     * disconnecting: boolean; - true while wallet is disconnecting
     * autoConnect: boolean; - autoConnect value, passed on init.
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
</details>
<p align="right">(<a href="#readme-top">back to top</a>)</p>


# Example for React

Here's an example of how we integrate the adapter into [hippo's frontend](https://github.com/hippospace/hippo-frontend/blob/main/src/Providers.tsx):


<details>
  <summary>Use React Provider</summary>

```typescript
import React from 'react';
import {
  WalletProvider,
  PontemWalletAdapter,
  HippoWalletAdapter,
  AptosWalletAdapter,
  HippoExtensionWalletAdapter,
  MartianWalletAdapter,
  FewchaWalletAdapter,
  SpikaWalletAdapter,
  RiseWalletAdapter,
  FletchWalletAdapter
} from '@pontem/aptos-wallet-adapter';

const wallets = [
  new PontemWalletAdapter(),
  new HippoWalletAdapter(),
  new MartianWalletAdapter(),
  new AptosWalletAdapter(),
  new FewchaWalletAdapter(),
  new HippoExtensionWalletAdapter(),
  new SpikaWalletAdapter(),
  new RiseWalletAdapter(),
  new FletchWalletAdapter()
];

const App: React.FC = () => {
  return (
    <WalletProvider
      wallets={wallets}
      autoConnect={true | false} /** allow auto wallet connection or not **/
      onError={(error: Error) => {
        console.log('Handle Error Message', error);
      }}>
      {/* your website */}
    </WalletProvider>
  );
};

export default App;
```

</details>

<details>
  <summary>Web3 Hook</summary>

```typescript
import { useWallet } from '@pontem/aptos-wallet-adapter';

const { connected, account, network, ...rest } = useWallet();

/*
  ** Properties available: **

  wallets: Wallet[]; - Array of wallets
  wallet: Wallet | null; - Selected wallet
  account: AccountKeys | null; { address, publicKey, authkey } - Wallet info: address, 
  network: NetworkInfo - { name, chainId?, api? }
  connected: boolean; - check the website is connected yet
  connect(walletName: string): Promise<void>; - trigger connect popup
  disconnect(): Promise<void>; - trigger disconnect action
  signAndSubmitTransaction(
    transaction: TransactionPayload
    options?: any
  ): Promise<PendingTransaction>; - function to sign and submit the transaction to chain
  signTransaction(
    transactionPayload,
    options?: any
  ): Promise<Uint8Array> - signs transaction and returns Uint8Array
  signMessage(
    signMessagePayload,
    options?: any
  ): Promise<signMessageResponse> - signs message and returns signMessageResponse
*/
```
</details>

<details>
  <summary>Connect & Disconnect</summary>

```typescript
import { AptosWalletName, useWallet } from "@pontem/aptos-wallet-adapter";

...

const { connect, disconnect, connected, select } = useWallet();

/** If auto-connect is not enabled, you will require to do the connect() manually **/
useEffect(() => {
  if (!autoConnect && currentWallet?.adapter) {
    connect();
  }
}, [autoConnect, currentWallet, connect]);
/** this is only required if you do not want auto connect wallet **/

if (!connected) {
  return (
    <button
      onClick={() => {
        select(); // E.g. connecting to the Aptos official wallet (Breaking Change)
      }}
    >
      Connect
    </button>
  );
} else {
  return (
    <button
      onClick={() => {
        disconnect();
      }}
    >
      Disconnect
    </button>
  );
}
```
</details>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Hippo SDK

<details>
  <summary>Hippo Wallet Client</summary>

```typescript
import { HippoSwapClient, HippoWalletClient } from '@manahippo/hippo-sdk';
import { getParserRepo } from '@manahippo/hippo-sdk';

export const hippoWalletClient = async (account: ActiveAptosWallet) => {
  if (!account) return undefined;
  const { netConf } = readConfig();
  const repo = getParserRepo();
  const walletClient = await HippoWalletClient.createInTwoCalls(
    netConf,
    aptosClient,
    repo,
    account
  );

  return walletClient;
};
```
</details>

<details>
  <summary>Hippo Swap Client</summary>

```typescript
import { HippoSwapClient, HippoWalletClient } from '@manahippo/hippo-sdk';
import { getParserRepo } from '@manahippo/hippo-sdk/';

export const hippoSwapClient = async () => {
  const { netConf } = readConfig();
  const repo = getParserRepo();
  const swapClient = await HippoSwapClient.createInOneCall(netConf, aptosClient, repo);

  return swapClient;
};
```
</details>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Submit and sign transaction

<details>
  <summary>Request faucet</summary>

```typescript
const { signAndSubmitTransaction } = useWallet();

const payload = await hippoWallet?.makeFaucetMintToPayload(uiAmtUsed, symbol);
if (payload) {
  const result = await signAndSubmitTransaction(payload);
  if (result) {
    message.success('Transaction Success');
    await hippoWallet?.refreshStores();
  }
}
```
</details>

<details>
  <summary>Swap Token</summary>

```typescript
const bestQuote = await hippoSwap.getBestQuoteBySymbols(fromSymbol, toSymbol, uiAmtIn, 3);
if (!bestQuote) {
  throw new Error(`No route exists from ${fromSymbol} to ${toSymbol}`);
}
const payload = await bestQuote.bestRoute.makeSwapPayload(uiAmtIn, uiAmtOutMin);
const result = await signAndSubmitTransaction(payload);
if (result) {
  message.success('Transaction Success');
  setRefresh(true);
}
```
</details>

<details>
  <summary>Deposit Transaction</summary>

```typescript
const pool = hippoSwap.getDirectPoolsBySymbolsAndPoolType(lhsSymbol, rhsSymbol, poolType);
if (pool.length === 0) {
  throw new Error('Desired pool does not exist');
}
const payload = await pool[0].makeAddLiquidityPayload(lhsUiAmt, rhsUiAmt);
const result = await signAndSubmitTransaction(payload);
if (result) {
  message.success('Transaction Success');
  setRefresh(true);
}
```
</details>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

