/// <reference types="react" />
import { TransactionPayload, HexEncodedBytes } from '../types';
import { AccountKeys, SignMessagePayload, SignMessageResponse, WalletAdapter, WalletName, WalletReadyState } from '../WalletAdapters/BaseAdapter';
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
    select(walletName: WalletName): void;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signAndSubmitTransaction(transaction: TransactionPayload, options?: any): Promise<{
        hash: HexEncodedBytes;
    }>;
    signTransaction(transaction: TransactionPayload, options?: any): Promise<Uint8Array>;
    signMessage(message: string | SignMessagePayload | Uint8Array): Promise<SignMessageResponse | string>;
}
export declare const WalletContext: import("react").Context<WalletContextState>;
export declare function useWallet(): WalletContextState;
//# sourceMappingURL=useWallet.d.ts.map