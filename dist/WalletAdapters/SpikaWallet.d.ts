import { Types } from 'aptos';
import { AccountKeys, BaseWalletAdapter, NetworkInfo, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
interface ISpikaWallet {
    connect: () => Promise<{
        publicKey: string;
        account: string;
        authKey: string;
    }>;
    account: () => Promise<string>;
    isConnected: () => Promise<boolean>;
    signAndSubmitTransaction(transaction: any, options?: any): Promise<{
        hash: Types.HexEncodedBytes;
    }>;
    signTransaction(transaction: any, options?: any): Promise<Uint8Array>;
    signMessage(message: string): Promise<string>;
    disconnect(): Promise<void>;
}
export declare const SpikaWalletName: WalletName<"Spika">;
export interface SpikaWalletAdapterConfig {
    provider?: ISpikaWallet;
    timeout?: number;
}
export declare class SpikaWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"Spika">;
    url: string;
    icon: string;
    protected _provider: ISpikaWallet | undefined;
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ timeout }?: SpikaWalletAdapterConfig);
    get publicAccount(): AccountKeys;
    get network(): NetworkInfo;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: Types.TransactionPayload, options?: any): Promise<Uint8Array>;
    signAndSubmitTransaction(transaction: Types.TransactionPayload, options?: any): Promise<{
        hash: Types.HexEncodedBytes;
    }>;
    signMessage(message: string): Promise<string>;
    onAccountChange(): Promise<void>;
    onNetworkChange(): Promise<void>;
}
export {};
//# sourceMappingURL=SpikaWallet.d.ts.map