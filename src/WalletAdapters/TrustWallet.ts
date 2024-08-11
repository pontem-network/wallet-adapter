import { Types } from 'aptos';
import {
  WalletAccountChangeError,
  WalletDisconnectionError,
  WalletGetNetworkError,
  WalletNetworkChangeError,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletSignAndSubmitMessageError,
  WalletSignMessageError,
  WalletSignTransactionError
} from '../WalletProviders/errors';
import {
  AccountKeys,
  BaseWalletAdapter,
  NetworkInfo,
  scopePollingDetectionStrategy,
  SignMessagePayload,
  SignMessageResponse,
  WalletAdapterNetwork,
  WalletName,
  WalletReadyState
} from './BaseAdapter';

interface IApotsErrorResult {
  code: number;
  name: string;
  message: string;
}

type AddressInfo = { address: string; publicKey: string; authKey?: string };

interface IAptosWallet {
  connect: () => Promise<AddressInfo>;
  account: () => Promise<AddressInfo>;
  isConnected: () => Promise<boolean>;
  signAndSubmitTransaction(
    transaction: any,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes } | IApotsErrorResult>;
  signTransaction(transaction: any, options?: any): Promise<Uint8Array | IApotsErrorResult>;
  signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
  disconnect(): Promise<void>;
  network(): Promise<WalletAdapterNetwork>;
  requestId: Promise<number>;
  onAccountChange: (listener: (newAddress: AddressInfo) => void) => void;
  onNetworkChange: (listener: (network: { networkName: string }) => void) => void;
}

interface AptosWindow extends Window {
    aptos?: IAptosWallet
}

declare const window: AptosWindow;

export const TrustWalletName = 'Trust' as WalletName<'Trust'>;

export interface TrustWalletAdapterConfig {
  provider?: IAptosWallet;
  // network?: WalletAdapterNetwork;
  timeout?: number;
}

export class TrustWalletAdapter extends BaseWalletAdapter {
  name = TrustWalletName;

  url = 'https://trustwallet.com/';

  icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6dXJsKCNsaW5lYXItZ3JhZGllbnQpO30uY2xzLTJ7ZmlsbDojMDUwMGZmO308L3N0eWxlPjxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyLWdyYWRpZW50IiB4MT0iMTEyMy4yNiIgeTE9IjE4NjUuNzgiIHgyPSI5NTQuNjEiIHkyPSIxMzM3LjUiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAyMTgyKSBzY2FsZSgxIC0xKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjAyIiBzdG9wLWNvbG9yPSJibHVlIi8+PHN0b3Agb2Zmc2V0PSIuMDgiIHN0b3AtY29sb3I9IiMwMDk0ZmYiLz48c3RvcCBvZmZzZXQ9Ii4xNiIgc3RvcC1jb2xvcj0iIzQ4ZmY5MSIvPjxzdG9wIG9mZnNldD0iLjQyIiBzdG9wLWNvbG9yPSIjMDA5NGZmIi8+PHN0b3Agb2Zmc2V0PSIuNjgiIHN0b3AtY29sb3I9IiMwMDM4ZmYiLz48c3RvcCBvZmZzZXQ9Ii45IiBzdG9wLWNvbG9yPSIjMDUwMGZmIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJtNzM4LjcxLDQyMy40MWwyMjEuNDUtNzIuM3Y1MDAuNTJjLTE1OC4xOC02Ni43NC0yMjEuNDUtMTk0LjY1LTIyMS40NS0yNjYuOTR2LTE2MS4yOFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Im0xMTgxLjYyLDQyMy40MWwtMjIxLjQ1LTcyLjN2NTAwLjUyYzE1OC4xOC02Ni43NCwyMjEuNDUtMTk0LjY1LDIyMS40NS0yNjYuOTR2LTE2MS4yOFoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Im04MjUuOTEsMjMwLjg1aDMwLjl2MTcuMzFjMTAuMTMtMTUuNTYsMjEuNzgtMTcuMzEsMzguODQtMTcuMzF2MzAuNmgtNy43N2MtMjAuNDQsMC0zMC4yMyw5LjYyLTMwLjIzLDI4LjY3djMyLjUyaC0zMS43NXYtOTEuNzlaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJtOTk4Ljc4LDMyMi42M2gtMzEuNzV2LTguNzVjLTYuOTMsOC4wNS0xNi4zOCwxMS41NC0yOC4wMywxMS41NC0yMi4xMiwwLTM0LjYyLTEzLjExLTM0LjYyLTM3LjI0di01Ny4zNGgzMS43NXY1MC4xOGMwLDExLjM2LDUuNTcsMTgsMTUuMDIsMThzMTUuODgtNi40NywxNS44OC0xNy40OHYtNTAuN2gzMS43NXY5MS43OVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Im0xMDA2LjU0LDI5NC4zaDI5LjczYzEuMzYsNi42NCw1LjkxLDkuNDMsMTYuODgsOS40Myw4Ljk1LDAsMTQuMTktMi4wOSwxNC4xOS01Ljk0LDAtMi45OC0yLjU0LTQuOS05Ljc5LTYuNDdsLTIzLjk4LTUuNDJjLTE2LjA0LTMuNjYtMjQuMTUtMTIuOTMtMjQuMTUtMjcuOCwwLTE5LjU5LDE0LjM1LTI5LjczLDQyLjIxLTI5LjczczQxLjU0LDkuODgsNDMuOTEsMzEuMDRoLTI5LjU1Yy0uNS01LjU5LTYuMjUtOS4wMS0xNS43LTkuMDEtNy41OSwwLTEyLjQ5LDIuNDQtMTIuNDksNi4xMiwwLDMuMTQsMy4yLDUuNTksOS42Myw3LjE4bDI1LjE2LDYuMTJjMTYuNTQsNC4wMSwyNC40OSwxMi40MSwyNC40OSwyNi4wNSwwLDE4Ljg5LTE2LjM4LDMwLjA4LTQ0LjIzLDMwLjA4cy00Ni4yNy0xMi4wNi00Ni4yNy0zMS42NWgtLjAzWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0ibTExODEuNjIsMjU5LjR2LTI4LjU1aC03OC4zNXYyOC41NmgyMy4zOHY2My4yMmgzMS41OHYtNjMuMjRoMjMuMzlaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJtODE3LjA4LDI1OS40di0yOC41NWgtNzguMzV2MjguNTZoMjMuMzh2NjMuMjJoMzEuNTh2LTYzLjI0aDIzLjM4WiIvPjwvc3ZnPg==';

  protected _provider: IAptosWallet | undefined;

  protected _network: WalletAdapterNetwork;

  protected _chainId: string;

  protected _api: string;

  protected _timeout: number;

  protected _readyState: WalletReadyState =
    typeof window === 'undefined' || typeof document === 'undefined'
      ? WalletReadyState.Unsupported
      : WalletReadyState.NotDetected;

  protected _connecting: boolean;

  protected _wallet: any | null;

  constructor({
    // provider,
    // network = WalletAdapterNetwork.Testnet,
    timeout = 10000
  }: TrustWalletAdapterConfig = {}) {
    super();

    this._provider = typeof window !== 'undefined' ? window.aptos : undefined;
    this._network = undefined;
    this._timeout = timeout;
    this._connecting = false;
    this._wallet = null;

    if (typeof window !== 'undefined' && this._readyState !== WalletReadyState.Unsupported) {
      scopePollingDetectionStrategy(() => {
        if (window.aptos) {
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
      authKey: this._wallet?.authKey || null
    };
  }

  get network(): NetworkInfo {
    return {
      name: this._network,
      api: this._api,
      chainId: this._chainId
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

      const provider = this._provider || window.aptos;
      const response = await provider?.connect();
      this._wallet = {
        address: response?.address,
        publicKey: response?.publicKey,
        isConnected: true
      };

      try {
        const name = await provider?.network();
        const chainId = null;
        const api = null;

        this._network = name;
        this._chainId = chainId;
        this._api = api;
      } catch (error: any) {
        const errMsg = error.message;
        this.emit('error', new WalletGetNetworkError(errMsg));
        throw error;
      }

      this.emit('connect', this._wallet.address);
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    } finally {
      this._connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    const wallet = this._wallet;
    const provider = this._provider || window.aptos;
    if (wallet) {
      this._wallet = null;

      try {
        await provider?.disconnect();
      } catch (error: any) {
        this.emit('error', new WalletDisconnectionError(error?.message, error));
      }
    }

    this.emit('disconnect');
  }

  async signTransaction(transaction: Types.TransactionPayload, options?: any): Promise<Uint8Array> {
    try {
      const wallet = this._wallet;
      const provider = this._provider || window.aptos;
      if (!wallet || !provider) throw new WalletNotConnectedError();

      const response = await provider.signTransaction(transaction, options);
      if ((response as IApotsErrorResult).code) {
        throw new Error((response as IApotsErrorResult).message);
      }
      return response as Uint8Array;
    } catch (error: any) {
      const errMsg = error.message;
      this.emit('error', new WalletSignTransactionError(errMsg));
      throw error;
    }
  }

  async signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes }> {
    try {
      const wallet = this._wallet;
      const provider = this._provider || window.aptos;
      if (!wallet || !provider) throw new WalletNotConnectedError();

      const response = await provider.signAndSubmitTransaction(transaction, options);
      if ((response as IApotsErrorResult).code) {
        throw new Error((response as IApotsErrorResult).message);
      }
      return response as { hash: Types.HexEncodedBytes };
    } catch (error: any) {
      const errMsg = error.message;
      this.emit('error', new WalletSignAndSubmitMessageError(errMsg));
      throw error;
    }
  }

  async signMessage(msgPayload: SignMessagePayload): Promise<SignMessageResponse> {
    try {
      const wallet = this._wallet;
      const provider = this._provider || window.aptos;
      if (!wallet || !provider) throw new WalletNotConnectedError();
      if (typeof msgPayload !== 'object' || !msgPayload.nonce) {
        throw new WalletSignMessageError('Invalid signMessage Payload');
      }
      const response = await provider?.signMessage(msgPayload);
      if (response) {
        return response;
      } else {
        throw new Error('Sign Message failed');
      }
    } catch (error: any) {
      const errMsg = error.message;
      this.emit('error', new WalletSignMessageError(errMsg));
      throw error;
    }
  }

  async onAccountChange(): Promise<void> {
    try {
      const wallet = this._wallet;
      const provider = this._provider || window.aptos;
      if (!wallet || !provider) throw new WalletNotConnectedError();
      const handleAccountChange = async (newAccount: AddressInfo) => {
        if (newAccount?.publicKey) {
          this._wallet = {
            ...this._wallet,
            publicKey: newAccount.publicKey || this._wallet?.publicKey,
            authKey: newAccount.authKey || this._wallet?.authKey,
            address: newAccount.address || this._wallet?.address
          };
        } else {
          const response = await provider?.connect();
          this._wallet = {
            ...this._wallet,
            authKey: response?.authKey || this._wallet?.authKey,
            address: response?.address || this._wallet?.address,
            publicKey: response?.publicKey || this._wallet?.publicKey
          };
        }
        this.emit('accountChange', newAccount.publicKey);
      };
      await provider?.onAccountChange(handleAccountChange);
    } catch (error: any) {
      const errMsg = error.message;
      this.emit('error', new WalletAccountChangeError(errMsg));
      throw error;
    }
  }

  async onNetworkChange(): Promise<void> {
    try {
      const wallet = this._wallet;
      const provider = this._provider || window.aptos;
      if (!wallet || !provider) throw new WalletNotConnectedError();
      const handleNetworkChange = async (newNetwork: { networkName: WalletAdapterNetwork }) => {
        this._network = newNetwork.networkName;
        this.emit('networkChange', this._network);
      };
      await provider?.onNetworkChange(handleNetworkChange);
    } catch (error: any) {
      const errMsg = error.message;
      this.emit('error', new WalletNetworkChangeError(errMsg));
      throw error;
    }
  }
}
