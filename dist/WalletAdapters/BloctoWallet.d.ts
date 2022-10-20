import { Types } from 'aptos';
import { AptosProviderInterface as IBloctoAptos } from '@blocto/sdk';
import { AccountKeys, BaseWalletAdapter, WalletName, WalletReadyState, SignMessagePayload, SignMessageResponse, NetworkInfo, WalletAdapterNetwork } from './BaseAdapter';
export declare const BloctoWalletName: WalletName<"Blocto">;
export interface BloctoWalletAdapterConfig {
    provider?: IBloctoAptos;
    network: Exclude<WalletAdapterNetwork, WalletAdapterNetwork.Devnet>;
    timeout?: number;
    bloctoAppId?: string;
}
export declare const APTOS_NETWORK_CHAIN_ID_MAPPING: {
    mainnet: number;
    testnet: number;
};
export declare class BloctoWalletAdapter extends BaseWalletAdapter {
    name: WalletName<"Blocto">;
    url: string;
    icon: string;
    protected _provider: IBloctoAptos | undefined;
    protected _network: Exclude<WalletAdapterNetwork, WalletAdapterNetwork.Devnet>;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: any | null;
    constructor({ network, timeout, bloctoAppId }?: BloctoWalletAdapterConfig);
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
    signMessage(message: SignMessagePayload): Promise<SignMessageResponse>;
    onAccountChange(): Promise<void>;
    onNetworkChange(): Promise<void>;
}
//# sourceMappingURL=BloctoWallet.d.ts.map