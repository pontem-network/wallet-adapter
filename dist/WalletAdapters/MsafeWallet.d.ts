import { MaybeHexString, Types } from 'aptos';
import { AccountKeys, BaseWalletAdapter, NetworkInfo, SignMessagePayload, SignMessageResponse, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
import { MSafeWallet } from 'msafe-wallet';
export declare const MSafeWalletName: WalletName<"MSafe">;
interface MSafeAccount {
    address: MaybeHexString;
    publicKey: MaybeHexString[];
    authKey: MaybeHexString;
    minKeysRequired: number;
    isConnected: boolean;
}
export declare class MSafeWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"MSafe">;
    icon: string;
    protected _provider: MSafeWallet | undefined;
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: MSafeAccount | null;
    private _origin?;
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
    constructor(origin?: string | string[]);
    get url(): string;
    get publicAccount(): AccountKeys;
    get network(): NetworkInfo;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transactionPyld: Types.TransactionPayload, options?: any): Promise<Uint8Array>;
    signAndSubmitTransaction(transactionPyld: Types.TransactionPayload, options?: any): Promise<{
        hash: Types.HexEncodedBytes;
    }>;
    signMessage(msgPayload: SignMessagePayload): Promise<SignMessageResponse>;
    onAccountChange(): Promise<void>;
    onNetworkChange(): Promise<void>;
}
/**
 * @deprecated Use `MSafeWalletName` instead.
 */
export declare const MsafeWalletName: WalletName<"MSafe">;
/**
 * @deprecated Use `MSafeWalletAdapter` instead.
 */
export declare class MsafeWalletAdapter extends MSafeWalletAdapter {
}
export {};
//# sourceMappingURL=MsafeWallet.d.ts.map