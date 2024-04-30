/// <reference types="react" />
import { Types } from 'aptos';
import { AccountKeys, NetworkInfo, SignMessagePayload, SignMessageResponse, WalletAdapter, WalletName, WalletReadyState } from '../WalletAdapters/BaseAdapter';
export interface Wallet {
    adapter: WalletAdapter;
    readyState: WalletReadyState;
}
export interface WalletContextState {
    autoConnect: boolean;
    wallets: Wallet[];
    wallet: Wallet | null;
    account: AccountKeys | null;
    connecting: boolean;
    connected: boolean;
    disconnecting: boolean;
    network: NetworkInfo;
    select(walletName?: WalletName): Promise<void>;
    connect(walletName?: WalletName): Promise<void>;
    disconnect(): Promise<void>;
    signAndSubmitTransaction(transaction: Types.TransactionPayload, options?: any): Promise<{
        hash: Types.HexEncodedBytes;
    }>;
    signTransaction(transaction: Types.TransactionPayload, options?: any): Promise<Uint8Array>;
    signMessage(message: string | SignMessagePayload | Uint8Array): Promise<SignMessageResponse | string>;
}
export declare const WalletContext: import("react").Context<WalletContextState>;
export declare function useWallet(): WalletContextState;
//# sourceMappingURL=useWallet.d.ts.map