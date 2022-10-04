import { MaybeHexString } from 'aptos';
import { TransactionPayload, HexEncodedBytes } from '../types';
import { AccountKeys, BaseWalletAdapter, WalletName, WalletReadyState } from './BaseAdapter';
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
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ timeout }?: HippoExtensionWalletAdapterConfig);
    get publicAccount(): AccountKeys;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: TransactionPayload): Promise<Uint8Array>;
    signAndSubmitTransaction(transaction: TransactionPayload): Promise<{
        hash: HexEncodedBytes;
    }>;
    signMessage(message: string): Promise<string>;
}
export {};
//# sourceMappingURL=HippoExtensionWallet.d.ts.map