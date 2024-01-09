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

import { MaybeHexString, Types } from "aptos";
import { PontemWalletAdapterConfig } from "./PontemWallet";
import {
  WalletDisconnectionError,
  WalletGetNetworkError,
  WalletNotConnectedError,
  WalletNotReadyError
} from "../WalletProviders";

interface OKXProvider extends Omit<BaseWalletAdapter, "signAndSubmitTransaction" | "connect" | "network" | "onNetworkChange" | "onAccountChange"> {
  signTransaction(
    transaction: any,
    options?: any
  ): Promise<Uint8Array>;
  signAndSubmitTransaction: (
    transaction: Types.TransactionPayload,
    options?: any
  ) => Promise<Types.HexEncodedBytes>;
  getNetwork: () => Promise<NetworkInfo>;
  connect: () => Promise<AccountInfo>;
  network: () => Promise<WalletAdapterNetwork>;
  onNetworkChange(listener: (newNetwork: {
    networkName: NetworkInfo;
  }) => void): Promise<void>;
  onAccountChange(listener: (newAccount: AccountInfo) => void): Promise<void>;

}

export const OKXWalletName = "OKX Wallet" as WalletName<"OKX Wallet">;


interface OKXWalletInterface {
  aptos?: OKXProvider;
}

interface OKXWindow extends Window {
  okxwallet?: OKXWalletInterface;
}

declare const window: OKXWindow;

declare type AccountInfo = {
  address: string;
  publicKey: string | string[];
  minKeysRequired?: number;
  isConnected: boolean;
};

export interface OkxWalletAdapterConfig {
  provider?: OKXWalletInterface;
  timeout?: number;
}

export class OkxWalletAdapter extends BaseWalletAdapter {
  private networkToChainId = {
    mainnet: 1,
  };

  readonly name = OKXWalletName;
  readonly url = "https://okx.com/web3/";
  readonly icon =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJDSURBVHgB7Zq9jtpAEMfHlhEgQLiioXEkoAGECwoKxMcTRHmC5E3IoyRPkPAEkI7unJYmTgEFTYwA8a3NTKScLnCHN6c9r1e3P2llWQy7M/s1Gv1twCP0ej37dDq9x+Zut1t3t9vZjDEHIiSRSPg4ZpDL5fxkMvn1cDh8m0wmfugfO53OoFQq/crn8wxfY9EymQyrVCqMfHvScZx1p9ls3pFxXBy/bKlUipGPrVbLuQqAfsCliq3zl0H84zwtjQrOw4Mt1W63P5LvBm2d+Xz+YzqdgkqUy+WgWCy+Mc/nc282m4FqLBYL+3g8fjDxenq72WxANZbLJeA13zDX67UDioL5ybXwafMYu64Ltn3bdDweQ5R97fd7GyhBQMipx4POeEDHIu2LfDdBIGGz+hJ9CQ1ABjoA2egAZPM6AgiCAEQhsi/C4jHyPA/6/f5NG3Ks2+3CYDC4aTccDrn6ojG54MnEvG00GoVmWLIRNZ7wTCwDHYBsdACy0QHIhiuRETxlICWpMMhGZHmqS8qH6JLyGegAZKMDkI0uKf8X4SWlaZo+Pp1bRrwlJU8ZKLIvUjKh0WiQ3sRUbNVq9c5Ebew7KEo2m/1p4jJ4qAmDaqDQBzj5XyiAT4VCQezJigAU+IDU+z8vJFnGWeC+bKQV/5VZ71FV6L7PA3gg3tXrdQ+DgLhC+75Wq3no69P3MC0NFQpx2lL04Ql9gHK1bRDjsSBIvScBnDTk1WrlGIZBorIDEYJj+rhdgnQ67VmWRe0zlplXl81vcyEt0rSoYDUAAAAASUVORK5CYII=";

  protected _provider: OKXWalletInterface | undefined;

  protected _network: WalletAdapterNetwork;

  protected _chainId: string;

  protected _api: string;

  protected _timeout: number;

  protected _readyState: WalletReadyState =
    typeof window !== "undefined"
      ? window?.okxwallet
        ? WalletReadyState.Installed
        : WalletReadyState.NotDetected
      : WalletReadyState.Unsupported;


  protected _connecting: boolean;

  protected _wallet: AccountInfo | null;

  constructor({
                timeout = 10000
              }: PontemWalletAdapterConfig = {}) {
    super();

    this._provider = typeof window !== 'undefined' ? window.okxwallet : undefined;
    this._network = undefined;
    this._timeout = timeout;
    this._connecting = false;
    this._wallet = null;

    if (typeof window !== 'undefined' && this._readyState !== WalletReadyState.Unsupported) {
      scopePollingDetectionStrategy(() => {
        if (window.okxwallet) {
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

      const provider = this._provider || window.okxwallet;

      const response = await provider.aptos?.connect();

      if (!response) {
        throw new WalletNotConnectedError(`${OKXWalletName} Connect Error`);
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
      if (!response) throw `${OKXWalletName} Network Error`;

      return {
        name: response.toLowerCase() as WalletAdapterNetwork.Mainnet,
        chainId: this.networkToChainId[response.toLowerCase()],
        api: ''
      };
    } catch (error: any) {
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    const wallet = this._wallet;
    const provider = this._provider || window.okxwallet;
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
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes }> {
    try {
      const wallet = this._wallet;
      const provider = this._provider || window.okxwallet;
      if (!wallet || !provider) throw new WalletNotConnectedError();

      const response = await provider?.aptos?.signAndSubmitTransaction(
        transaction,
        options
      );

      if (!response) {
        throw new Error("No response");
      }
      return (response as any) as { hash: Types.HexEncodedBytes };
    } catch (error: any) {
      // TODO: Message is improperly set from upstream, please convert it properly into a string.  Right now it shows the below:
      // `{"code":-32603,"message":"[object Object]","data":{"originalError":{}}}`
      // The `[object Object]` should be a string representation of the error, which should have an error message from the VM or elsewhere.
      // The JSON .stringify is a temporary fix to get some message to show up.
      throw new Error(`${JSON.stringify(error)}`)
    }
  }

  async signTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<Uint8Array> {
    try {
      const wallet = this._wallet;
      const provider = this._provider || window.okxwallet;
      if (!wallet || !provider) throw new WalletNotConnectedError();

      const response = await provider?.aptos?.signTransaction(
        transaction,
        options
      );
      if (!response) {
        throw new Error("Failed to sign transaction");
      }
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async signMessage(message: SignMessagePayload): Promise<string | SignMessageResponse> {
    try {
      const wallet = this._wallet;
      const provider = this._provider || window.okxwallet;
      if (!wallet || !provider) throw new WalletNotConnectedError();

      if (typeof message !== "object" || !message.nonce) {
        `${OKXWalletName} Invalid signMessage Payload`;
      }
      const response = await provider?.aptos?.signMessage(message);
      if (response) {
        return response;
      } else {
        throw `${OKXWalletName} Sign Message failed`;
      }
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async onNetworkChange(): Promise<void> {
    try {
      const wallet = this._wallet;
      const provider = this._provider || window.okxwallet;
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
      const provider = this._provider || window.okxwallet;
      if (!wallet || !provider) throw new WalletNotConnectedError();

      const handleAccountChange = async (
        newAccount: AccountInfo
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
