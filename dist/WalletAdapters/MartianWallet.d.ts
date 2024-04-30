import { MaybeHexString, Types } from 'aptos';
import { AccountKeys, BaseWalletAdapter, NetworkInfo, SignMessagePayload, SignMessageResponse, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
interface ConnectMartianAccount {
    address: MaybeHexString;
    method: string;
    publicKey: MaybeHexString;
    status: number;
}
interface MartianAccount {
    address: MaybeHexString;
    publicKey: MaybeHexString;
    authKey: MaybeHexString;
    isConnected: boolean;
}
interface IMartianWallet {
    connect: () => Promise<ConnectMartianAccount>;
    account(): Promise<MartianAccount>;
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
export declare const MartianWalletName: WalletName<"Martian">;
export interface MartianWalletAdapterConfig {
    provider?: IMartianWallet;
    timeout?: number;
}
export declare class MartianWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"Martian">;
    url: string;
    icon: string;
    protected _provider: IMartianWallet | undefined;
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: MartianAccount | null;
    constructor({ timeout }?: MartianWalletAdapterConfig);
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
//# sourceMappingURL=MartianWallet.d.ts.map