import { MaybeHexString } from 'aptos';
import { TransactionPayload, HexEncodedBytes, INetworkResponse } from '../types';
import { AccountKeys, BaseWalletAdapter, SignMessagePayload, SignMessageResponse, WalletName, WalletReadyState } from './BaseAdapter';
interface ConnectMartianAccount {
    address: MaybeHexString;
    method: string;
    publicKey: MaybeHexString;
    status: number;
}
interface MartianAccount {
    address: MaybeHexString;
    publicKey: MaybeHexString;
    authKey: MaybeHexString;
    isConnected: boolean;
}
interface IMartianWallet {
    connect: () => Promise<ConnectMartianAccount>;
    account(): Promise<MartianAccount>;
    isConnected(): Promise<boolean>;
    generateTransaction(sender: MaybeHexString, payload: any, options?: any): Promise<any>;
    signAndSubmitTransaction(transaction: TransactionPayload): Promise<HexEncodedBytes>;
    signTransaction(transaction: TransactionPayload): Promise<Uint8Array>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    disconnect(): Promise<void>;
    network(): Promise<string>;
    onAccountChange(listener: (address: string | undefined) => void): Promise<void>;
    onNetworkChange(listener: (network: string | undefined) => void): Promise<void>;
    getChainId(): Promise<{
        chainId: number;
    }>;
}
export declare const MartianWalletName: WalletName<"Martian">;
export interface MartianWalletAdapterConfig {
    provider?: IMartianWallet;
    timeout?: number;
}
export declare class MartianWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"Martian">;
    url: string;
    icon: string;
    protected _provider: IMartianWallet | undefined;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: MartianAccount | null;
    constructor({ timeout }?: MartianWalletAdapterConfig);
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
    signMessage(msgPayload: SignMessagePayload): Promise<SignMessageResponse>;
    onAccountChange(listener: any): Promise<void>;
    network(): Promise<INetworkResponse>;
    onNetworkChange(listener: any): Promise<void>;
}
export {};
//# sourceMappingURL=MartianWallet.d.ts.map