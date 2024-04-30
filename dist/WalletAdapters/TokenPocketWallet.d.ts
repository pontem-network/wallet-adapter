import { MaybeHexString } from 'aptos';
import { TransactionPayload, HexEncodedBytes } from 'aptos/src/generated';
import { AccountKeys, BaseWalletAdapter, NetworkInfo, SignMessagePayload, SignMessageResponse, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
interface TokenPocketAccount {
    address: MaybeHexString;
    publicKey: MaybeHexString;
}
interface ITokenPocketWallet {
    isTokenPocket: boolean;
    connect: () => Promise<TokenPocketAccount>;
    account: () => Promise<TokenPocketAccount>;
    isConnected: () => Promise<boolean>;
    signAndSubmitTransaction(transaction: TransactionPayload, options?: any): Promise<{
        hash: HexEncodedBytes;
    }>;
    network: () => Promise<WalletAdapterNetwork>;
    getChainId: () => Promise<string>;
    getNodeUrl: () => Promise<string>;
    signTransaction(transaction: TransactionPayload, options?: any): Promise<Uint8Array>;
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    disconnect(): Promise<void>;
    onAccountChange: (listener: (newAddress: TokenPocketAccount) => void) => void;
    onNetworkChange: (listener: (network: {
        networkName: string;
    }) => void) => void;
}
export declare const TokenPocketWalletName: WalletName<"TokenPocket">;
export interface TokenPocketWalletAdapterConfig {
    provider?: ITokenPocketWallet;
    timeout?: number;
}
export declare class TokenPocketWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"TokenPocket">;
    url: string;
    icon: string;
    protected _provider: ITokenPocketWallet | undefined;
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ timeout }?: TokenPocketWalletAdapterConfig);
    get publicAccount(): AccountKeys;
    get network(): NetworkInfo;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: TransactionPayload, options?: any): Promise<Uint8Array>;
    signAndSubmitTransaction(transaction: TransactionPayload, options?: any): Promise<{
        hash: HexEncodedBytes;
    }>;
    signMessage(msgPayload: SignMessagePayload): Promise<SignMessageResponse>;
    onNetworkChange(): Promise<void>;
    onAccountChange(): Promise<void>;
}
export {};
//# sourceMappingURL=TokenPocketWallet.d.ts.map