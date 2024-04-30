export declare const NightlyWallet: () => void;
import { Types } from 'aptos';
import { AccountKeys, BaseWalletAdapter, NetworkInfo, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
export declare class AptosPublicKey {
    private readonly hexString;
    static default(): AptosPublicKey;
    address(): string;
    asUint8Array(): Uint8Array;
    asString(): string;
    asPureHex(): string;
    constructor(hexString: string);
}
interface AptosNightly {
    publicKey: AptosPublicKey;
    constructor(eventMap: Map<string, (data: any) => any>): any;
    connect(onDisconnect?: () => void, eagerConnect?: boolean): Promise<AptosPublicKey>;
    disconnect(): Promise<void>;
    signTransaction: (transaction: Types.TransactionPayload, submit: boolean) => Promise<Uint8Array | Types.PendingTransaction>;
    signAllTransactions: (transaction: Types.TransactionPayload[]) => Promise<Uint8Array[]>;
    signMessage(msg: string): Promise<Uint8Array>;
    network(): Promise<{
        api: string;
        chainId: number;
        network: string;
    }>;
}
export declare const NightlyWalletName: WalletName<"Nightly">;
export interface NightlyWalletAdapterConfig {
    provider?: AptosNightly;
    timeout?: number;
}
export declare class NightlyWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"Nightly">;
    url: string;
    icon: string;
    protected _provider: AptosNightly | undefined;
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: {
        publicKey?: string;
        address?: string;
        authKey?: string;
        isConnected: boolean;
    } | null;
    constructor({ timeout }?: NightlyWalletAdapterConfig);
    get publicAccount(): AccountKeys;
    get network(): NetworkInfo;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(payload: Types.TransactionPayload): Promise<Uint8Array>;
    signAllTransaction(payload: Types.TransactionPayload[]): Promise<Uint8Array[]>;
    signAndSubmitTransaction(tx: Types.TransactionPayload): Promise<Types.PendingTransaction>;
    signMessage(message: string): Promise<string>;
    onAccountChange(): Promise<void>;
    onNetworkChange(): Promise<void>;
}
export {};
//# sourceMappingURL=NightlyWallet.d.ts.map