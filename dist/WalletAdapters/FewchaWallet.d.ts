import { Web3ProviderType } from '@fewcha/web3';
import { AccountKeys, BaseWalletAdapter, SignMessagePayload, SignMessageResponse, WalletName, WalletReadyState } from './BaseAdapter';
import { TransactionPayload, HexEncodedBytes } from '../types';
export declare const FewchaWalletName: WalletName<"Fewcha">;
export interface FewchaAdapterConfig {
    provider?: string;
    timeout?: number;
}
export declare class FewchaWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"Fewcha">;
    url: string;
    icon: string;
    protected _provider: Web3ProviderType | undefined;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ timeout }?: FewchaAdapterConfig);
    get publicAccount(): AccountKeys;
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
}
//# sourceMappingURL=FewchaWallet.d.ts.map