import { MaybeHexString } from 'aptos';
import { TransactionPayload, HexEncodedBytes } from '../types';
import { AccountKeys, BaseWalletAdapter, WalletName, WalletReadyState } from './BaseAdapter';
export declare const HippoWalletName: WalletName<"Hippo Web">;
export interface HippoWalletAdapterConfig {
    provider?: string;
    timeout?: number;
}
export declare class HippoWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"Hippo Web">;
    url: string;
    icon: string;
    protected _provider: string | undefined;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ timeout }?: HippoWalletAdapterConfig);
    get publicAccount(): AccountKeys;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    handleMessage: (e: MessageEvent<{
        id: number;
        method: string;
        address?: {
            hexString: MaybeHexString;
        };
        publicKey?: {
            hexString: MaybeHexString;
        };
        authKey?: {
            hexString: MaybeHexString;
        };
        detail?: {
            hash: MaybeHexString;
        };
        error?: string;
    }>) => void;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: TransactionPayload): Promise<Uint8Array>;
    signAndSubmitTransaction(transaction: TransactionPayload): Promise<{
        hash: HexEncodedBytes;
    }>;
    signMessage(message: string): Promise<string>;
    private _beforeUnload;
}
//# sourceMappingURL=HippoWallet.d.ts.map