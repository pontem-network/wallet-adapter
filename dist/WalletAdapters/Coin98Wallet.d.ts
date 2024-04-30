import { Types } from 'aptos';
import { AccountKeys, BaseWalletAdapter, NetworkInfo, SignMessagePayload, SignMessageResponse, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
interface IApotsErrorResult {
    code: number;
    message: string;
}
declare type AddressInfo = {
    address: string;
    publicKey: string;
};
interface IConnectOptions {
    network: string;
}
interface ICoin98Wallet {
    connect: (options?: IConnectOptions) => Promise<AddressInfo>;
    account: () => Promise<AddressInfo>;
    isConnected: () => Promise<boolean>;
    signAndSubmitTransaction(transaction: any, options?: any): Promise<{
        hash: Types.HexEncodedBytes;
    } | IApotsErrorResult>;
    signTransaction(transaction: any, options?: any): Promise<Uint8Array | IApotsErrorResult>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    disconnect(): Promise<void>;
    on: (eventName: string, callback: Function) => void;
}
export declare const Coin98WalletName: WalletName<"Coin98">;
export interface Coin98WalletAdapterConfig {
    provider?: ICoin98Wallet;
    network?: WalletAdapterNetwork;
    timeout?: number;
}
export declare class Coin98WalletAdapter extends BaseWalletAdapter {
    name: WalletName<"Coin98">;
    url: string;
    icon: string;
    protected _provider: ICoin98Wallet | undefined;
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ timeout }?: Coin98WalletAdapterConfig);
    get publicAccount(): AccountKeys;
    get network(): NetworkInfo;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: Types.TransactionPayload, options?: any): Promise<Uint8Array>;
    signAndSubmitTransaction(transaction: Types.TransactionPayload, options?: any): Promise<{
        hash: Types.HexEncodedBytes;
    }>;
    signMessage(msgPayload: SignMessagePayload): Promise<SignMessageResponse>;
    onAccountChange(): Promise<void>;
    onNetworkChange(): Promise<void>;
}
export {};
//# sourceMappingURL=Coin98Wallet.d.ts.map