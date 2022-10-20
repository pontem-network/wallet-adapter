import { MaybeHexString, Types } from 'aptos';
import EventEmitter from 'eventemitter3';
declare global {
    interface Window {
        hippo: any;
    }
}
export { EventEmitter };
export declare type PublicKey = MaybeHexString;
export declare type Address = MaybeHexString;
export declare type AuthKey = MaybeHexString;
export interface AccountKeys {
    publicKey: PublicKey | PublicKey[] | null;
    address: Address | null;
    authKey: AuthKey | null;
    minKeysRequired?: number;
}
export interface WalletAdapterEvents {
    connect(publicKey: PublicKey): void;
    disconnect(): void;
    error(error: any): void;
    success(value: any): void;
    readyStateChange(readyState: WalletReadyState): void;
    networkChange(network: WalletAdapterNetwork): void;
    accountChange(account: string): void;
}
export declare enum WalletReadyState {
    /**
     * User-installable wallets can typically be detected by scanning for an API
     * that they've injected into the global context. If such an API is present,
     * we consider the wallet to have been installed.
     */
    Installed = "Installed",
    NotDetected = "NotDetected",
    /**
     * Loadable wallets are always available to you. Since you can load them at
     * any time, it's meaningless to say that they have been detected.
     */
    Loadable = "Loadable",
    /**
     * If a wallet is not supported on a given platform (eg. server-rendering, or
     * mobile) then it will stay in the `Unsupported` state.
     */
    Unsupported = "Unsupported"
}
export declare type WalletName<T extends string = string> = T & {
    __brand__: 'WalletName';
};
export declare type NetworkInfo = {
    api?: string;
    chainId?: string;
    name: WalletAdapterNetwork | undefined;
};
export declare enum WalletAdapterNetwork {
    Mainnet = "mainnet",
    Testnet = "testnet",
    Devnet = "devnet"
}
export interface WalletAdapterProps<Name extends string = string> {
    name: WalletName<Name>;
    url: string;
    icon: string;
    readyState: WalletReadyState;
    connecting: boolean;
    connected: boolean;
    publicAccount: AccountKeys;
    network: NetworkInfo;
    onAccountChange(): Promise<void>;
    onNetworkChange(): Promise<void>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signAndSubmitTransaction(transaction: Types.TransactionPayload, options?: any): Promise<{
        hash: Types.HexEncodedBytes;
    }>;
    signTransaction(transaction: Types.TransactionPayload, options?: any): Promise<Uint8Array>;
    signMessage(message: string | SignMessagePayload | Uint8Array): Promise<string | SignMessageResponse>;
}
export declare type WalletAdapter<Name extends string = string> = WalletAdapterProps<Name> & EventEmitter<WalletAdapterEvents>;
export interface SignMessagePayload {
    address?: boolean;
    application?: boolean;
    chainId?: boolean;
    message: string;
    nonce: string;
}
export interface SignMessageResponse {
    address: string;
    application: string;
    chainId: number;
    fullMessage: string;
    message: string;
    nonce: string;
    prefix: string;
    signature: string;
}
export declare abstract class BaseWalletAdapter extends EventEmitter<WalletAdapterEvents> implements WalletAdapter {
    abstract name: WalletName;
    abstract url: string;
    abstract icon: string;
    abstract get readyState(): WalletReadyState;
    abstract get publicAccount(): AccountKeys;
    abstract get network(): NetworkInfo;
    abstract get connecting(): boolean;
    get connected(): boolean;
    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract signAndSubmitTransaction(transaction: Types.TransactionPayload): Promise<{
        hash: Types.HexEncodedBytes;
    }>;
    abstract signTransaction(transaction: Types.TransactionPayload): Promise<Uint8Array>;
    abstract signMessage(message: string | SignMessagePayload | Uint8Array): Promise<string | SignMessageResponse>;
    abstract onAccountChange(): Promise<void>;
    abstract onNetworkChange(): Promise<void>;
}
export declare function scopePollingDetectionStrategy(detect: () => boolean): void;
//# sourceMappingURL=BaseAdapter.d.ts.map