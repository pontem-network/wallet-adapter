import type {
  AccountInfo,
  AdapterPlugin,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  WalletName,
} from "@aptos-labs/wallet-adapter-core";
import {
  AptosWalletErrorResult,
  NetworkName,
  PluginProvider,
} from "@aptos-labs/wallet-adapter-core";
import { MSafeWallet } from "@msafe/aptos-wallet";
import { Types, HexString } from "aptos";

/// cat logo.png | base64
const LOGO_PNG_BASE64 =
  "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";


interface MSafeWindow extends Window {
  msafe?: PluginProvider;
}

declare const window: MSafeWindow;

export const MSafeWalletName = "MSafe" as WalletName<"MSafe">;

export class MSafeWalletAdapter implements AdapterPlugin {
  readonly name = MSafeWalletName;
  readonly icon = `data:image/png;base64,${LOGO_PNG_BASE64}` as const;

  private _origin?: string | string[];
  provider: PluginProvider | undefined = undefined;

  /**
   * @description create a MSafeWalletAdapter
   * @param origin allowlist of msafe website url, omit means accpets all msafe websites. you can pass a single url or an array of urls.
   * @example
   *  // 1. Initialize MSafeWalletAdapter with default allowlist:
   *      new MSafeWalletAdapter();
   *  // 2. Initialize MSafeWalletAdapter with a single MSafe url:
   *      new MSafeWalletAdapter('https://app.m-safe.io');
   *  // 3. Initialize MSafeWalletAdapter with an array of MSafe urls:
   *      new MSafeWalletAdapter(['https://app.m-safe.io', 'https://testnet.m-safe.io', 'https://partner.m-safe.io']);
   *  // 4. Initialize MSafeWalletAdapter with a single network type:
   *      new MSafeWalletAdapter('Mainnet');
   *  // 5. Initialize MSafeWalletAdapter with an array of network types:
   *      new MSafeWalletAdapter(['Mainnet', 'Testnet', 'Partner']);
   */
  constructor(origin?: string | string[]) {
    this._origin = origin;
    if (MSafeWallet.inMSafeWallet()) {
      MSafeWallet.new(origin)
        .then((msafe) => {
          window.msafe = this.provider = toPluginProvider(msafe);
        })
        .catch((e) => {
          console.log("🚀 ~ file: index.ts:57 ~ MSafeWalletAdapter:", e);
        });
    } else {
      console.log(
        "🚀 ~ file: index.ts:63 ~ MSafeWalletAdapter: not in msafe wallet:"
      );
    }
  }

  get url() {
    const defaultOrigin =
      this._origin instanceof Array ? this._origin[0] : this._origin;
    if (
      typeof window === "undefined" ||
      typeof window.location === "undefined" ||
      typeof window.location.href === "undefined"
    )
      return MSafeWallet.getOrigin(defaultOrigin);
    return MSafeWallet.getAppUrl(defaultOrigin);
  }

  async connect(): Promise<AccountInfo> {
    try {
      const accountInfo = await this.provider?.connect();
      if (!accountInfo) throw `${MSafeWalletName} Address Info Error`;
      return accountInfo;
    } catch (error: any) {
      throw error;
    }
  }

  async account(): Promise<AccountInfo> {
    const response = await this.provider?.account();
    if (!response) throw `${MSafeWalletName} Account Error`;
    return response;
  }

  async disconnect(): Promise<void> {
    try {
      await this.provider?.disconnect();
    } catch (error: any) {
      throw error;
    }
  }

  async signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes }> {
    try {
      const response = await this.provider?.signAndSubmitTransaction(
        transaction,
        options
      );
      if ((response as AptosWalletErrorResult).code) {
        throw new Error((response as AptosWalletErrorResult).message);
      }
      return response as { hash: Types.HexEncodedBytes };
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    try {
      if (typeof message !== "object" || !message.nonce) {
        `${MSafeWalletName} Invalid signMessage Payload`;
      }
      const response = await this.provider?.signMessage(message);
      if (response) {
        return response;
      } else {
        throw `${MSafeWalletName} Sign Message failed`;
      }
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async network(): Promise<NetworkInfo> {
    try {
      const response = await this.provider?.network();
      if (!response) throw `${MSafeWalletName} Network Error`;
      return {
        name: response as NetworkName,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async onNetworkChange(callback: any): Promise<void> {
    try {
      const handleNetworkChange = async (newNetwork: {
        networkName: NetworkInfo;
      }): Promise<void> => {
        callback({
          name: newNetwork.networkName,
          chainId: undefined,
          api: undefined,
        });
      };
      await this.provider?.onNetworkChange(handleNetworkChange);
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async onAccountChange(callback: any): Promise<void> {
    try {
      const handleAccountChange = async (
        newAccount: AccountInfo
      ): Promise<void> => {
        if (newAccount?.publicKey) {
          callback({
            publicKey: newAccount.publicKey,
            address: newAccount.address,
          });
        } else {
          const response = await this.connect();
          callback({
            address: response?.address,
            publicKey: response?.publicKey,
          });
        }
      };
      await this.provider?.onAccountChange(handleAccountChange);
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }
}

const toNetworkName = (network: string) => network as NetworkName;

export function toPluginProvider(msafe: MSafeWallet): PluginProvider {
  return {
    connect: () => {
      return msafe.connect();
    },
    account: () => {
      return msafe.account();
    },
    disconnect: () => {
      return msafe.disconnect();
    },
    signAndSubmitTransaction: async (transaction: any, options?: any) => {
      const result = await msafe.signAndSubmit(transaction, options);
      return { hash: HexString.fromUint8Array(result).hex() };
    },
    signMessage: (message: SignMessagePayload) => {
      throw "unsupported";
    },
    network: () => {
      return msafe.network().then((network) => toNetworkName(network));
    },
    onAccountChange: async (
      listener: (newAddress: AccountInfo) => Promise<void>
    ) => {
      return msafe.onChangeAccount((newAddress) => listener(newAddress));
    },
    onNetworkChange: async (
      listener: (network: { networkName: NetworkInfo }) => Promise<void>
    ) => {
      const listenerProxy = async (network: string) => {
        const chainId = await msafe.chainId();
        const networkName = {
          name: toNetworkName(network),
          chainId: chainId.toString(),
        };
        listener({ networkName });
      };
      return msafe.onChangeNetwork((network) => listenerProxy(network));
    },
  };
}

