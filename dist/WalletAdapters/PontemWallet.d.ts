import { MaybeHexString } from 'aptos';
import { TransactionPayload, HexEncodedBytes, INetworkResponse } from '../types';
import { AccountKeys, BaseWalletAdapter, SignMessagePayload, SignMessageResponse, WalletName, WalletReadyState } from './BaseAdapter';
interface ConnectPontemAccount {
    address: MaybeHexString;
    method: string;
    publicKey: MaybeHexString;
    status: number;
}
interface PontemAccount {
    address: MaybeHexString;
    publicKey?: MaybeHexString;
    authKey?: MaybeHexString;
    isConnected: boolean;
}
interface IPontemWallet {
    connect: () => Promise<ConnectPontemAccount>;
    account(): Promise<MaybeHexString>;
    publicKey(): Promise<MaybeHexString>;
    generateTransaction(sender: MaybeHexString, payload: any): Promise<any>;
    signAndSubmit(transaction: TransactionPayload, options?: any): Promise<{
        success: boolean;
        result: {
            hash: HexEncodedBytes;
        };
    }>;
    isConnected(): Promise<boolean>;
    signTransaction(transaction: TransactionPayload, options?: any): Promise<Uint8Array>;
    signMessage(message: SignMessagePayload): Promise<{
        success: boolean;
        result: SignMessageResponse;
    }>;
    disconnect(): Promise<void>;
    network(): Promise<INetworkResponse>;
    onAccountChange(listener: (address: string | undefined) => void): Promise<void>;
    onNetworkChange(listener: (network: INetworkResponse | undefined) => void): Promise<void>;
}
export declare const PontemWalletName: WalletName<"Pontem">;
export interface PontemWalletAdapterConfig {
    provider?: IPontemWallet;
    timeout?: number;
}
export declare class PontemWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"Pontem">;
    url: string;
    icon: string;
    protected _provider: IPontemWallet | undefined;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: PontemAccount | null;
    constructor({ timeout }?: PontemWalletAdapterConfig);
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
    signMessage(messagePayload: SignMessagePayload): Promise<SignMessageResponse>;
    onAccountChange(listener: any): Promise<void>;
    onNetworkChange(listener: any): Promise<void>;
    network(): Promise<INetworkResponse>;
}
export {};
//# sourceMappingURL=PontemWallet.d.ts.map