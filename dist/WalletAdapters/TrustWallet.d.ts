import { Types } from 'aptos';
import { AccountKeys, BaseWalletAdapter, NetworkInfo, SignMessagePayload, SignMessageResponse, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
interface IApotsErrorResult {
    code: number;
    name: string;
    message: string;
}
declare type AddressInfo = {
    address: string;
    publicKey: string;
    authKey?: string;
};
interface IAptosWallet {
    connect: () => Promise<AddressInfo>;
    account: () => Promise<AddressInfo>;
    isConnected: () => Promise<boolean>;
    signAndSubmitTransaction(transaction: any, options?: any): Promise<{
        hash: Types.HexEncodedBytes;
    } | IApotsErrorResult>;
    signTransaction(transaction: any, options?: any): Promise<Uint8Array | IApotsErrorResult>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    disconnect(): Promise<void>;
    network(): Promise<WalletAdapterNetwork>;
    requestId: Promise<number>;
    onAccountChange: (listener: (newAddress: AddressInfo) => void) => void;
    onNetworkChange: (listener: (network: {
        networkName: string;
    }) => void) => void;
}
export declare const TrustWalletName: WalletName<"Trust">;
export interface TrustWalletAdapterConfig {
    provider?: IAptosWallet;
    timeout?: number;
}
export declare class TrustWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"Trust">;
    url: string;
    icon: string;
    protected _provider: IAptosWallet | undefined;
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ timeout }?: TrustWalletAdapterConfig);
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
//# sourceMappingURL=TrustWallet.d.ts.map