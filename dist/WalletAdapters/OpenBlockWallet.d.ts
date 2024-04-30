import { Types } from 'aptos';
import { AccountKeys, BaseWalletAdapter, NetworkInfo, SignMessagePayload, SignMessageResponse, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
declare type AddressInfo = {
    address: string;
    publicKey: string;
    authKey?: string;
};
interface IOpenBlockWallet {
    connect: () => Promise<AddressInfo>;
    account: () => Promise<AddressInfo>;
    network: () => Promise<NetworkInfo>;
    isConnected: () => Promise<boolean>;
    signAndSubmitTransaction(transaction: any): Promise<{
        hash: string;
    }>;
    signTransaction(payload: any): Promise<string>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    disconnect(): Promise<void>;
    onAccountChange: (listener: (newAddress: AddressInfo) => void) => void;
    onNetworkChange: (listener: (network: NetworkInfo) => void) => void;
}
export declare const OpenBlockWalletName: WalletName<"OpenBlock">;
export interface OpenBlockWalletAdapterConfig {
    provider?: IOpenBlockWallet;
    timeout?: number;
}
export declare class OpenBlockWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"OpenBlock">;
    url: string;
    icon: string;
    protected _provider: IOpenBlockWallet;
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ timeout }?: OpenBlockWalletAdapterConfig);
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
}
export {};
//# sourceMappingURL=OpenBlockWallet.d.ts.map