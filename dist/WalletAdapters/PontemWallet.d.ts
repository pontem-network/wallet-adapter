import { MaybeHexString, Types } from 'aptos';
import { AccountKeys, BaseWalletAdapter, NetworkInfo, SignMessagePayload, SignMessageResponse, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
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
    signAndSubmit(transaction: Types.TransactionPayload, options?: any): Promise<{
        success: boolean;
        result: {
            hash: Types.HexEncodedBytes;
        };
    }>;
    isConnected(): Promise<boolean>;
    signTransaction(transaction: Types.TransactionPayload, options?: any): Promise<Uint8Array>;
    signMessage(message: SignMessagePayload): Promise<{
        success: boolean;
        result: SignMessageResponse;
    }>;
    disconnect(): Promise<void>;
    network(): Promise<NetworkInfo>;
    onAccountChange(listener: (address: string | undefined) => void): Promise<void>;
    onNetworkChange(listener: (network: NetworkInfo) => void): Promise<void>;
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
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: PontemAccount | null;
    constructor({ timeout }?: PontemWalletAdapterConfig);
    get publicAccount(): AccountKeys;
    get network(): NetworkInfo;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transactionPyld: Types.TransactionPayload, options?: any): Promise<Uint8Array>;
    signAndSubmitTransaction(transactionPyld: Types.TransactionPayload, options?: any): Promise<{
        hash: Types.HexEncodedBytes;
    }>;
    signMessage(messagePayload: SignMessagePayload): Promise<SignMessageResponse>;
    onAccountChange(): Promise<void>;
    onNetworkChange(): Promise<void>;
}
export {};
//# sourceMappingURL=PontemWallet.d.ts.map