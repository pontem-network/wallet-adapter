import { HexEncodedBytes, INetworkResponse, TransactionPayload } from '../types';
import { AccountKeys, BaseWalletAdapter, SignMessagePayload, SignMessageResponse, WalletName, WalletReadyState } from './BaseAdapter';
interface IApotsErrorResult {
    code: number;
    name: string;
    message: string;
}
interface IAptosWallet {
    connect: () => Promise<{
        address: string;
        publicKey: string;
    }>;
    account: () => Promise<string>;
    isConnected: () => Promise<boolean>;
    signAndSubmitTransaction(transaction: any, options?: any): Promise<{
        hash: HexEncodedBytes;
    } | IApotsErrorResult>;
    signTransaction(transaction: any, options?: any): Promise<Uint8Array | IApotsErrorResult>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    disconnect(): Promise<void>;
    network(): Promise<string>;
    onAccountChange(listener: (address: string | {}) => void): Promise<void>;
    onNetworkChange(listener: ({ networkName }: {
        networkName: string;
    }) => void): Promise<void>;
}
export declare const AptosWalletName: WalletName<"Petra">;
export interface AptosWalletAdapterConfig {
    provider?: IAptosWallet;
    timeout?: number;
}
export declare class AptosWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"Petra">;
    url: string;
    icon: string;
    protected _provider: IAptosWallet | undefined;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ timeout }?: AptosWalletAdapterConfig);
    get publicAccount(): AccountKeys;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: TransactionPayload, options?: any): Promise<Uint8Array>;
    signAndSubmitTransaction(transaction: TransactionPayload, options?: any): Promise<{
        hash: HexEncodedBytes;
    }>;
    signMessage(msgPayload: SignMessagePayload): Promise<SignMessageResponse>;
    onAccountChange(listener: any): Promise<void>;
    network(): Promise<INetworkResponse>;
    onNetworkChange(listener: any): Promise<void>;
}
export {};
//# sourceMappingURL=PetraWallet.d.ts.map