import { MaybeHexString, Types } from 'aptos';
import { AccountKeys, BaseWalletAdapter, NetworkInfo, SignMessagePayload, SignMessageResponse, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
interface ConnectSafePalAccount {
    address: MaybeHexString;
    method: string;
    publicKey: MaybeHexString;
    status: number;
}
interface SafePalAccount {
    address: MaybeHexString;
    publicKey: MaybeHexString;
    authKey: MaybeHexString;
    isConnected: boolean;
}
interface ISafePalWallet {
    connect: () => Promise<ConnectSafePalAccount>;
    account(): Promise<SafePalAccount>;
    isConnected(): Promise<boolean>;
    generateTransaction(sender: MaybeHexString, payload: any, options?: any): Promise<any>;
    signAndSubmitTransaction(transaction: Types.TransactionPayload): Promise<Types.HexEncodedBytes>;
    signTransaction(transaction: Types.TransactionPayload): Promise<Uint8Array>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    disconnect(): Promise<void>;
    getChainId(): Promise<{
        chainId: number;
    }>;
    network(): Promise<WalletAdapterNetwork>;
    onAccountChange: (listenr: (newAddress: string) => void) => void;
    onNetworkChange: (listenr: (network: string) => void) => void;
}
export declare const SafePalWalletName: WalletName<"SafePal">;
export interface SafePalWalletAdapterConfig {
    provider?: ISafePalWallet;
    timeout?: number;
}
export declare class SafePalWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"SafePal">;
    url: string;
    icon: string;
    protected _provider: ISafePalWallet | undefined;
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: SafePalAccount | null;
    constructor({ timeout }?: SafePalWalletAdapterConfig);
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
    signMessage(msgPayload: SignMessagePayload): Promise<SignMessageResponse>;
    onAccountChange(): Promise<void>;
    onNetworkChange(): Promise<void>;
}
export {};
//# sourceMappingURL=SafePalWallet.d.ts.map