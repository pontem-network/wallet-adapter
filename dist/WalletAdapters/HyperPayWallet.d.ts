import { MaybeHexString } from 'aptos';
import { TransactionPayload, HexEncodedBytes } from '../types';
import { AccountKeys, BaseWalletAdapter, WalletName, WalletReadyState } from './BaseAdapter';
interface ConnectHyperPayAccount {
    address: MaybeHexString;
    method: string;
    publicKey: MaybeHexString;
    status: number;
}
interface HyperPayAccount {
    address: MaybeHexString;
    publicKey: MaybeHexString;
    authKey: MaybeHexString;
    isConnected: boolean;
}
interface IHyperPayWallet {
    connect: () => Promise<ConnectHyperPayAccount>;
    account(): Promise<HyperPayAccount>;
    isConnected(): Promise<boolean>;
    generateTransaction(sender: MaybeHexString, payload: any, options?: any): Promise<any>;
    signAndSubmitTransaction(transaction: TransactionPayload): Promise<HexEncodedBytes>;
    signTransaction(transaction: TransactionPayload): Promise<Uint8Array>;
    signMessage(message: string): Promise<{
        signature: string;
    }>;
    disconnect(): Promise<void>;
}
export declare const HyperPayWalletName: WalletName<"HyperPay">;
export interface HyperPayWalletAdapterConfig {
    provider?: IHyperPayWallet;
    timeout?: number;
}
export declare class HyperPayWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"HyperPay">;
    url: string;
    icon: string;
    protected _provider: IHyperPayWallet | undefined;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: HyperPayAccount | null;
    constructor({ timeout }?: HyperPayWalletAdapterConfig);
    get publicAccount(): AccountKeys;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transactionPyld: TransactionPayload, options?: any): Promise<Uint8Array>;
    signAndSubmitTransaction(transactionPyld: TransactionPayload, options?: any): Promise<{
        hash: HexEncodedBytes;
    }>;
    signMessage(message: string): Promise<string>;
}
export {};
//# sourceMappingURL=HyperPayWallet.d.ts.map