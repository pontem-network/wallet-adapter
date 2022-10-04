import { TransactionPayload, HexEncodedBytes, EntryFunctionPayload, PendingTransaction } from '../types';
import { AccountKeys, BaseWalletAdapter, WalletName, WalletReadyState, SignMessagePayload, SignMessageResponse } from './BaseAdapter';
import { AptosNetwork, PublicAccount } from '@keystonehq/aptossnap-adapter/build/types';
interface IAptosSnap {
    connect: () => Promise<PublicAccount>;
    account: () => Promise<PublicAccount>;
    isConnected: () => Promise<boolean>;
    signAndSubmitTransaction(transaction: EntryFunctionPayload, options?: any): Promise<PendingTransaction>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    disconnect(): Promise<void>;
    signTransaction(transaction: EntryFunctionPayload): Promise<Uint8Array>;
}
export declare const AptosSnapName: WalletName<"Snap">;
export interface AptosSnapAdapterConfig {
    provider?: IAptosSnap;
    network: AptosNetwork;
    timeout?: number;
}
export declare class AptosSnapAdapter extends BaseWalletAdapter {
    name: WalletName<"Snap">;
    url: string;
    icon: string;
    protected _provider: IAptosSnap | undefined;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ network, timeout }?: AptosSnapAdapterConfig);
    get publicAccount(): AccountKeys;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: TransactionPayload): Promise<Uint8Array>;
    signAndSubmitTransaction(transaction: TransactionPayload, options?: any): Promise<{
        hash: HexEncodedBytes;
    }>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
}
export {};
//# sourceMappingURL=AptosSnap.d.ts.map