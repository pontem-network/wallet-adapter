import {
  AccountKeys,
  BaseWalletAdapter,
  NetworkInfo,
  scopePollingDetectionStrategy,
  SignMessagePayload,
  SignMessageResponse,
  WalletAdapterNetwork,
  WalletName,
  WalletReadyState,
} from './BaseAdapter';

import { MaybeHexString, Types } from 'aptos';
import { PontemWalletAdapterConfig } from './PontemWallet';
import {
  WalletDisconnectionError,
  WalletGetNetworkError,
  WalletNotConnectedError,
  WalletNotReadyError,
} from '../WalletProviders';

interface BitgetProvider
  extends Omit<
    BaseWalletAdapter,
    | 'signAndSubmitTransaction'
    | 'connect'
    | 'network'
    | 'onNetworkChange'
    | 'onAccountChange'
  > {
  signTransaction(transaction: any, options?: any): Promise<Uint8Array>;
  signAndSubmitTransaction: (
    transaction: Types.TransactionPayload,
    options?: any,
  ) => Promise<Types.HexEncodedBytes>;
  getNetwork: () => Promise<NetworkInfo>;
  connect: () => Promise<AccountInfo>;
  network: () => Promise<WalletAdapterNetwork>;
  onNetworkChange(
    listener: (newNetwork: { networkName: NetworkInfo }) => void,
  ): Promise<void>;
  onAccountChange(listener: (newAccount: AccountInfo) => void): Promise<void>;
}

export const BitgetWalletName = 'Bitget Wallet' as WalletName<'Bitget Wallet'>;

interface BitgetWalletInterface {
  aptos?: BitgetProvider;
}

interface BitgetWindow extends Window {
  bitkeep?: BitgetWalletInterface;
}

declare const window: BitgetWindow;

declare type AccountInfo = {
  address: string;
  publicKey: string | string[];
  minKeysRequired?: number;
  isConnected: boolean;
};

export interface BitgetWalletAdapterConfig {
  provider?: BitgetWalletInterface;
  timeout?: number;
}

export class BitgetWalletAdapter extends BaseWalletAdapter {
  private networkToChainId = {
    mainnet: 1,
  };

  readonly name = BitgetWalletName;
  readonly url = 'https://web3.bitget.com/';
  readonly icon =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAAACXBIWXMAACE4AAAhOAFFljFgAAAFw2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZWRhMmIzZmFjLCAyMDIxLzExLzE3LTE3OjIzOjE5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjMuMSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDEtMThUMjE6MDI6NTcrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTAxLTE4VDIxOjA1OjAzKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTAxLTE4VDIxOjA1OjAzKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NDlhZjYwMS0xZmYxLTQwMTMtYjc2Ny01ZTVlNTU1MDUwYWUiIHhtcE1NOkRvY3VtZW50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';

  protected _provider: BitgetWalletInterface | undefined;

  protected _network: WalletAdapterNetwork;

  protected _chainId: string;

  protected _api: string;

  protected _timeout: number;

  protected _readyState: WalletReadyState =
    typeof window !== 'undefined'
      ? window?.bitkeep
        ? WalletReadyState.Installed
        : WalletReadyState.NotDetected
      : WalletReadyState.Unsupported;

  protected _connecting: boolean;

  protected _wallet: AccountInfo | null;

  constructor({ timeout = 10000 }: PontemWalletAdapterConfig = {}) {
    super();

    this._provider =
      typeof window !== 'undefined' ? window.bitkeep : undefined;
    this._network = undefined;
    this._timeout = timeout;
    this._connecting = false;
    this._wallet = null;

    if (
      typeof window !== 'undefined' &&
      this._readyState !== WalletReadyState.Unsupported
    ) {
      scopePollingDetectionStrategy(() => {
        if (window.bitkeep) {
          this._readyState = WalletReadyState.Installed;
          this.emit('readyStateChange', this._readyState);
          return true;
        }
        return false;
      });
    }
  }

  get publicAccount(): AccountKeys {
    return {
      publicKey: this._wallet?.publicKey || null,
      address: this._wallet?.address || null,
    };
  }

  get network(): NetworkInfo {
    return {
      name: this._network,
      api: this._api,
      chainId: this._chainId,
    };
  }

  get connecting(): boolean {
    return this._connecting;
  }

  get connected(): boolean {
    return !!this._wallet?.isConnected;
  }

  get readyState(): WalletReadyState {
    return this._readyState;
  }

  async connect(): Promise<void> {
    try {
      if (this.connected || this.connecting) return;
      if (
        !(
          this._readyState === WalletReadyState.Loadable ||
          this._readyState === WalletReadyState.Installed
        )
      )
        throw new WalletNotReadyError();
      this._connecting = true;

      const provider = this._provider || window.bitkeep;

      const response = await provider.aptos?.connect();

      if (!response) {
        throw new WalletNotConnectedError(`${BitgetWalletName} Connect Error`);
      }

      const walletAccount = response.address;
      const publicKey = response.publicKey;
      if (walletAccount) {
        this._wallet = {
          address: walletAccount,
          publicKey,
          isConnected: true,
        };

        try {
          const networkInfo = await this.getNetwork();
          this._network = networkInfo.name;
          this._chainId = networkInfo.chainId;
          this._api = networkInfo.api;
        } catch (error: any) {
          const errMsg = error.message;
          this.emit('error', new WalletGetNetworkError(errMsg));
          throw error;
        }
      }

      this.emit('connect', this._wallet?.address || '');
    } catch (error: any) {
      this.emit('error', new Error('User has rejected the connection'));
      throw error;
    } finally {
      this._connecting = false;
    }
  }

  async getNetwork(): Promise<NetworkInfo> {
    try {
      const response = await this._provider?.aptos?.network();
      if (!response) throw `${BitgetWalletName} Network Error`;

      return {
        name: response.toLowerCase() as WalletAdapterNetwork.Mainnet,
        chainId: this.networkToChainId[response.toLowerCase()],
        api: '',
      };
    } catch (error: any) {
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    const wallet = this._wallet;
    const provider = this._provider || window.bitkeep;
    if (wallet) {
      this._wallet = null;

      try {
        await provider?.aptos?.disconnect();
      } catch (error: any) {
        this.emit('error', new WalletDisconnectionError(error?.message, error));
      }
    }
    this.emit('disconnect');
  }

  async signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: any,
  ): Promise<{ hash: Types.HexEncodedBytes }> {
    try {
      const wallet = this._wallet;
      const provider = this._provider || window.bitkeep;
      if (!wallet || !provider) throw new WalletNotConnectedError();

      const response = await provider?.aptos?.signAndSubmitTransaction(
        transaction,
        options,
      );

      if (!response) {
        throw new Error('No response');
      }
      return response as any as { hash: Types.HexEncodedBytes };
    } catch (error: any) {
      // TODO: Message is improperly set from upstream, please convert it properly into a string.  Right now it shows the below:
      // `{"code":-32603,"message":"[object Object]","data":{"originalError":{}}}`
      // The `[object Object]` should be a string representation of the error, which should have an error message from the VM or elsewhere.
      // The JSON .stringify is a temporary fix to get some message to show up.
      throw new Error(`${JSON.stringify(error)}`);
    }
  }

  async signTransaction(
    transaction: Types.TransactionPayload,
    options?: any,
  ): Promise<Uint8Array> {
    try {
      const wallet = this._wallet;
      const provider = this._provider || window.bitkeep;
      if (!wallet || !provider) throw new WalletNotConnectedError();

      const response = await provider?.aptos?.signTransaction(
        transaction,
        options,
      );
      if (!response) {
        throw new Error('Failed to sign transaction');
      }
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async signMessage(
    message: SignMessagePayload,
  ): Promise<string | SignMessageResponse> {
    try {
      const wallet = this._wallet;
      const provider = this._provider || window.bitkeep;
      if (!wallet || !provider) throw new WalletNotConnectedError();

      if (typeof message !== 'object' || !message.nonce) {
        `${BitgetWalletName} Invalid signMessage Payload`;
      }
      const response = await provider?.aptos?.signMessage(message);
      if (response) {
        return response;
      } else {
        throw `${BitgetWalletName} Sign Message failed`;
      }
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async onNetworkChange(): Promise<void> {
    try {
      const wallet = this._wallet;
      const provider = this._provider || window.bitkeep;
      if (!wallet || !provider) throw new WalletNotConnectedError();

      const handleNetworkChange = (newNetwork: {
        networkName: NetworkInfo;
      }) => {
        this._network = newNetwork.networkName?.name;
        this._api = newNetwork.networkName?.api;
        this._chainId = newNetwork.networkName?.chainId;
        this.emit('networkChange', this._network);
      };
      await provider?.aptos?.onNetworkChange(handleNetworkChange);
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async onAccountChange(): Promise<void> {
    try {
      const wallet = this._wallet;
      const provider = this._provider || window.bitkeep;
      if (!wallet || !provider) throw new WalletNotConnectedError();

      const handleAccountChange = async (
        newAccount: AccountInfo,
      ): Promise<void> => {
        if (newAccount === null) {
          await this.disconnect();
          return;
        }

        if (newAccount?.publicKey) {
          this._wallet.publicKey = newAccount.publicKey;
          this._wallet.address = newAccount.address;
          this._wallet.minKeysRequired = newAccount.minKeysRequired;
          this.emit('accountChange', newAccount.address);
        } else if (wallet.isConnected) {
          await this.connect();
        }
      };
      await provider?.aptos?.onAccountChange(handleAccountChange);
    } catch (error: any) {
      console.log(error);
      const errMsg = error.message;
      throw errMsg;
    }
  }
}
