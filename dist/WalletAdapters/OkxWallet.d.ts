import { AccountKeys, BaseWalletAdapter, NetworkInfo, SignMessagePayload, SignMessageResponse, WalletAdapterNetwork, WalletName, WalletReadyState } from './BaseAdapter';
import { Types } from "aptos";
import { PontemWalletAdapterConfig } from "./PontemWallet";
interface OKXProvider extends Omit<BaseWalletAdapter, "signAndSubmitTransaction" | "connect" | "network" | "onNetworkChange" | "onAccountChange"> {
    signTransaction(transaction: any, options?: any): Promise<Uint8Array>;
    signAndSubmitTransaction: (transaction: Types.TransactionPayload, options?: any) => Promise<Types.HexEncodedBytes>;
    getNetwork: () => Promise<NetworkInfo>;
    connect: () => Promise<AccountInfo>;
    network: () => Promise<WalletAdapterNetwork>;
    onNetworkChange(listener: (newNetwork: {
        networkName: NetworkInfo;
    }) => void): Promise<void>;
    onAccountChange(listener: (newAccount: AccountInfo) => void): Promise<void>;
}
export declare const OKXWalletName: WalletName<"OKX Wallet">;
interface OKXWalletInterface {
    aptos?: OKXProvider;
}
declare type AccountInfo = {
    address: string;
    publicKey: string | string[];
    minKeysRequired?: number;
    isConnected: boolean;
};
export interface OkxWalletAdapterConfig {
    provider?: OKXWalletInterface;
    timeout?: number;
}
export declare class OkxWalletAdapter extends BaseWalletAdapter {
    private networkToChainId;
    readonly name: WalletName<"OKX Wallet">;
    readonly url = "https://okx.com/web3/";
    readonly icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJDSURBVHgB7Zq9jtpAEMfHlhEgQLiioXEkoAGECwoKxMcTRHmC5E3IoyRPkPAEkI7unJYmTgEFTYwA8a3NTKScLnCHN6c9r1e3P2llWQy7M/s1Gv1twCP0ej37dDq9x+Zut1t3t9vZjDEHIiSRSPg4ZpDL5fxkMvn1cDh8m0wmfugfO53OoFQq/crn8wxfY9EymQyrVCqMfHvScZx1p9ls3pFxXBy/bKlUipGPrVbLuQqAfsCliq3zl0H84zwtjQrOw4Mt1W63P5LvBm2d+Xz+YzqdgkqUy+WgWCy+Mc/nc282m4FqLBYL+3g8fjDxenq72WxANZbLJeA13zDX67UDioL5ybXwafMYu64Ltn3bdDweQ5R97fd7GyhBQMipx4POeEDHIu2LfDdBIGGz+hJ9CQ1ABjoA2egAZPM6AgiCAEQhsi/C4jHyPA/6/f5NG3Ks2+3CYDC4aTccDrn6ojG54MnEvG00GoVmWLIRNZ7wTCwDHYBsdACy0QHIhiuRETxlICWpMMhGZHmqS8qH6JLyGegAZKMDkI0uKf8X4SWlaZo+Pp1bRrwlJU8ZKLIvUjKh0WiQ3sRUbNVq9c5Ebew7KEo2m/1p4jJ4qAmDaqDQBzj5XyiAT4VCQezJigAU+IDU+z8vJFnGWeC+bKQV/5VZ71FV6L7PA3gg3tXrdQ+DgLhC+75Wq3no69P3MC0NFQpx2lL04Ql9gHK1bRDjsSBIvScBnDTk1WrlGIZBorIDEYJj+rhdgnQ67VmWRe0zlplXl81vcyEt0rSoYDUAAAAASUVORK5CYII=";
    protected _provider: OKXWalletInterface | undefined;
    protected _network: WalletAdapterNetwork;
    protected _chainId: string;
    protected _api: string;
    protected _timeout: number;
    protected _readyState: WalletReadyState;
    protected _connecting: boolean;
    protected _wallet: AccountInfo | null;
    constructor({ timeout }?: PontemWalletAdapterConfig);
    get publicAccount(): AccountKeys;
    get network(): NetworkInfo;
    get connecting(): boolean;
    get connected(): boolean;
    get readyState(): WalletReadyState;
    connect(): Promise<void>;
    getNetwork(): Promise<NetworkInfo>;
    disconnect(): Promise<void>;
    signAndSubmitTransaction(transaction: Types.TransactionPayload, options?: any): Promise<{
        hash: Types.HexEncodedBytes;
    }>;
    signTransaction(transaction: Types.TransactionPayload, options?: any): Promise<Uint8Array>;
    signMessage(message: SignMessagePayload): Promise<string | SignMessageResponse>;
    onNetworkChange(): Promise<void>;
    onAccountChange(): Promise<void>;
}
export {};
//# sourceMappingURL=OkxWallet.d.ts.map