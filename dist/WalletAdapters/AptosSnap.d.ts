import { Types } from 'aptos';
import { AccountKeys, BaseWalletAdapter, WalletName, WalletReadyState, SignMessagePayload, SignMessageResponse, NetworkInfo, WalletAdapterNetwork } from './BaseAdapter';
import { PublicAccount } from '@keystonehq/aptossnap-adapter/build/types';
interface IAptosSnap {
    connect: () => Promise<PublicAccount>;
    account: () => Promise<PublicAccount>;
    isConnected: () => Promise<boolean>;
    signAndSubmitTransaction(transaction: Types.EntryFunctionPayload, options?: any): Promise<Types.PendingTransaction>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    disconnect(): Promise<void>;
    signTransaction(transaction: Types.EntryFunctionPayload): Promise<Uint8Array>;
}
export declare const AptosSnapName: WalletName<"Snap">;
export interface AptosSnapAdapterConfig {
    provider?: IAptosSnap;
    network: WalletAdapterNetwork;
    timeout?: number;
}
export declare class AptosSnapAdapter extends BaseWalletAdapter {
    name: WalletName<"Snap">;
    url: string;
    icon: string;
    protected _provider: IAptosSnap | undefined;
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ network, timeout }?: AptosSnapAdapterConfig);
    get publicAccount(): AccountKeys;
    get network(): NetworkInfo;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: Types.TransactionPayload): Promise<Uint8Array>;
    signAndSubmitTransaction(transaction: Types.TransactionPayload, options?: any): Promise<{
        hash: Types.HexEncodedBytes;
    }>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    onAccountChange(): Promise<void>;
    onNetworkChange(): Promise<void>;
}
export {};
//# sourceMappingURL=AptosSnap.d.ts.map