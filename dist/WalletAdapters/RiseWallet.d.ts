import { HexEncodedBytes, TransactionPayload } from '../types';
import { AccountKeys, BaseWalletAdapter, SignMessagePayload, SignMessageResponse, WalletName, WalletReadyState } from './BaseAdapter';
import { MaybeHexString } from 'aptos';
interface RiseAccount {
    address: MaybeHexString;
    publicKey: MaybeHexString;
    authKey: MaybeHexString;
    isConnected: boolean;
}
interface IRiseWallet {
    connect: () => Promise<{
        address: string;
    }>;
    account(): Promise<RiseAccount>;
    isConnected: () => Promise<boolean>;
    signAndSubmitTransaction(transaction: any): Promise<{
        hash: HexEncodedBytes;
    }>;
    signTransaction(transaction: any, options?: any): Promise<Uint8Array>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    disconnect(): Promise<void>;
}
export declare const RiseWalletName: WalletName<"Rise Wallet">;
export interface RiseWalletAdapterConfig {
    provider?: IRiseWallet;
    timeout?: number;
}
export declare class RiseWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"Rise Wallet">;
    url: string;
    icon: string;
    protected _provider: IRiseWallet | undefined;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ timeout }?: RiseWalletAdapterConfig);
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
    signMessage(msgPayload: SignMessagePayload): Promise<SignMessageResponse>;
}
export {};
//# sourceMappingURL=RiseWallet.d.ts.map