import { FC, ReactNode } from 'react';
import { WalletError } from './errors';
import { WalletAdapter } from '../WalletAdapters/BaseAdapter';
export interface WalletProviderProps {
    children: ReactNode;
    wallets: WalletAdapter[];
    autoConnect?: boolean;
    onError?: (error: WalletError) => void;
    localStorageKey?: string;
}
export declare const WalletProvider: FC<WalletProviderProps>;
//# sourceMappingURL=WalletProvider.d.ts.map