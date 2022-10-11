import { MaybeHexString, Types } from 'aptos';
import { AccountKeys, BaseWalletAdapter, NetworkInfo, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
interface IHippoWallet {
    connect: () => Promise<{
        address: MaybeHexString;
        publicKey: MaybeHexString;
        authKey: MaybeHexString;
    }>;
    account: () => Promise<string>;
    isConnected: () => Promise<boolean>;
    signAndSubmitTransaction(transaction: any): Promise<any>;
    signTransaction(transaction: any): Promise<Uint8Array>;
    signMessage(message: string): Promise<string>;
    disconnect(): Promise<void>;
}
export declare const HippoExtensionWalletName: WalletName<"Hippo">;
export interface HippoExtensionWalletAdapterConfig {
    provider?: IHippoWallet;
    timeout?: number;
}
export declare class HippoExtensionWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"Hippo">;
    url: string;
    icon: string;
    protected _provider: IHippoWallet | undefined;
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ timeout }?: HippoExtensionWalletAdapterConfig);
    get publicAccount(): AccountKeys;
    get network(): NetworkInfo;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: Types.TransactionPayload): Promise<Uint8Array>;
    signAndSubmitTransaction(transaction: Types.TransactionPayload): Promise<{
        hash: Types.HexEncodedBytes;
    }>;
    signMessage(message: string): Promise<string>;
    onAccountChange(): Promise<void>;
    onNetworkChange(): Promise<void>;
}
export {};
//# sourceMappingURL=HippoExtensionWallet.d.ts.map