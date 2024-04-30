import { Types } from 'aptos';
import { AccountKeys, BaseWalletAdapter, NetworkInfo, SignMessagePayload, SignMessageResponse, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
interface IFletchWallet {
    connect: () => Promise<{
        Address: string;
        PublicKey: string;
        code: number;
        error?: any;
    }>;
    account: () => Promise<string>;
    isConnected: () => Promise<boolean>;
    signAndSubmitTransaction(transaction: any): Promise<{
        code: number;
        error?: any;
        hash: string;
    }>;
    signTransaction(payload: any): Promise<{
        code: number;
        error?: any;
        tx: Uint8Array;
    }>;
    signMessage(message: SignMessagePayload): Promise<{
        code: number;
        error?: any;
        signedMessage: SignMessageResponse;
    }>;
    disconnect(): Promise<void>;
}
export declare const FletchWalletName: WalletName<"Fletch">;
export interface FletchWalletAdapterConfig {
    provider?: IFletchWallet;
    timeout?: number;
}
export declare class FletchWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"Fletch">;
    url: string;
    icon: string;
    protected _provider: IFletchWallet;
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ timeout }?: FletchWalletAdapterConfig);
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
//# sourceMappingURL=FletchWallet.d.ts.map