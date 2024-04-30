import { MaybeHexString, Types } from 'aptos';
import { AccountKeys, BaseWalletAdapter, NetworkInfo, SignMessagePayload, SignMessageResponse, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
interface RiseAccount {
    address: MaybeHexString;
    publicKey: MaybeHexString;
    authKey: MaybeHexString;
    isConnected: boolean;
}
declare type AddressInfo = {
    address: string;
    publicKey: string;
    authKey?: string;
};
interface IRiseWallet {
    connect: () => Promise<AddressInfo>;
    account(): Promise<RiseAccount>;
    isConnected: () => Promise<boolean>;
    signAndSubmitTransaction(transaction: any): Promise<{
        hash: Types.HexEncodedBytes;
    }>;
    signTransaction(transaction: any, options?: any): Promise<Uint8Array>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    disconnect(): Promise<void>;
    network(): Promise<NetworkInfo>;
    on(event: string, listener: () => any): void;
    off(event: string, listener: () => any): void;
    onAccountChange: (listener: (newAddress: AddressInfo) => void) => void;
    onNetworkChange: (listener: (network: NetworkInfo) => void) => void;
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
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ timeout }?: RiseWalletAdapterConfig);
    get publicAccount(): AccountKeys;
    get network(): NetworkInfo;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: Types.TransactionPayload): Promise<Uint8Array>;
    signAndSubmitTransaction(transaction: Types.TransactionPayload): Promise<{
        hash: Types.HexEncodedBytes;
    }>;
    signMessage(msgPayload: SignMessagePayload): Promise<SignMessageResponse>;
    onAccountChange(): Promise<void>;
    onNetworkChange(): Promise<void>;
    private handleDisconnect;
}
export {};
//# sourceMappingURL=RiseWallet.d.ts.map