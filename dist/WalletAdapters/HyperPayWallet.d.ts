import { MaybeHexString, Types } from 'aptos';
import { AccountKeys, BaseWalletAdapter, NetworkInfo, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
interface ConnectHyperPayAccount {
    address: MaybeHexString;
    method: string;
    publicKey: MaybeHexString;
    status: number;
}
interface HyperPayAccount {
    address: MaybeHexString;
    publicKey: MaybeHexString;
    authKey: MaybeHexString;
    isConnected: boolean;
}
interface IHyperPayWallet {
    connect: () => Promise<ConnectHyperPayAccount>;
    account(): Promise<HyperPayAccount>;
    isConnected(): Promise<boolean>;
    generateTransaction(sender: MaybeHexString, payload: any, options?: any): Promise<any>;
    signAndSubmitTransaction(transaction: Types.TransactionPayload): Promise<Types.HexEncodedBytes>;
    signTransaction(transaction: Types.TransactionPayload): Promise<Uint8Array>;
    signMessage(message: string): Promise<{
        signature: string;
    }>;
    disconnect(): Promise<void>;
}
export declare const HyperPayWalletName: WalletName<"HyperPay">;
export interface HyperPayWalletAdapterConfig {
    provider?: IHyperPayWallet;
    timeout?: number;
}
export declare class HyperPayWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"HyperPay">;
    url: string;
    icon: string;
    protected _provider: IHyperPayWallet | undefined;
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: HyperPayAccount | null;
    constructor({ timeout }?: HyperPayWalletAdapterConfig);
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
    signMessage(message: string): Promise<string>;
    onAccountChange(): Promise<void>;
    onNetworkChange(): Promise<void>;
}
export {};
//# sourceMappingURL=HyperPayWallet.d.ts.map