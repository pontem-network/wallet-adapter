import { MaybeHexString, Types } from 'aptos';
import { AccountKeys, BaseWalletAdapter, NetworkInfo, SignMessagePayload, SignMessageResponse, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
interface ConnectSpacecyAccount {
    address: MaybeHexString;
    method: string;
    publicKey: MaybeHexString;
    status: number;
}
interface SpacecyAccount {
    address: MaybeHexString;
    publicKey?: MaybeHexString;
    authKey?: MaybeHexString;
    isConnected: boolean;
}
export interface ISpacecyWallet {
    checkIsConnectedAndAccount: () => Promise<{
        isConnected: boolean;
        accountWallet: MaybeHexString;
    }>;
    connect: () => Promise<ConnectSpacecyAccount>;
    account(): Promise<MaybeHexString>;
    publicKey(): Promise<MaybeHexString>;
    signAndSubmitTransaction(transaction: Types.TransactionPayload, options?: any): Promise<{
        status: number;
        data: Types.HexEncodedBytes;
        method: 'signAndSubmitTransaction';
    }>;
    isConnected(): Promise<boolean>;
    signTransaction(transaction: Types.TransactionPayload, options?: any): Promise<{
        status: number;
        data: Uint8Array;
        method: 'signTransaction';
    }>;
    signMessage(message: SignMessagePayload): Promise<{
        status: number;
        data: SignMessageResponse;
        method: 'signMessage';
    }>;
    generateTransaction(sender: MaybeHexString, payload: any, options?: any): Promise<any>;
    disconnect(): Promise<void>;
    chainId(): Promise<void>;
    network(): Promise<NetworkInfo>;
    onAccountChange(listener: (address: string | undefined) => void): Promise<void>;
    onNetworkChange(listener: (network: NetworkInfo) => void): Promise<void>;
}
export interface SpacecyWalletAdapterConfig {
    provider?: ISpacecyWallet;
    timeout?: number;
}
export declare class SpacecyWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"Spacecy">;
    url: string;
    icon: string;
    protected _provider: ISpacecyWallet | undefined;
    protected _network: WalletAdapterNetwork | undefined;
    protected _chainId: string | undefined;
    protected _api: string | undefined;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: SpacecyAccount | null;
    constructor({ timeout }?: SpacecyWalletAdapterConfig);
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
//# sourceMappingURL=SpacecyWallet.d.ts.map