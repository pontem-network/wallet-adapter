import { Types } from 'aptos';
import { WalletError } from '../WalletProviders';
import { SignMessagePayload, WalletAdapter, WalletName, WalletReadyState } from '../WalletAdapters';
interface IUseVueWalletProvider {
    wallets: WalletAdapter[];
    onError?: (error: WalletError) => void;
    localStorageKey?: string;
    autoConnect: boolean;
}
export declare const useWalletProviderStore: import("pinia").StoreDefinition<"walletProviderStore", import("pinia")._UnwrapAll<Pick<{
    init: ({ wallets, onError: onHandleError, localStorageKey: lsKey, autoConnect: autoConnection }: IUseVueWalletProvider) => void;
    wallets: import("vue").Ref<{
        adapter: {
            name: WalletName<string>;
            url: string;
            icon: string;
            readyState: WalletReadyState;
            connecting: boolean;
            connected: boolean;
            publicAccount: {
                publicKey: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                } | (string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                })[];
                address: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                };
                authKey: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                };
                minKeysRequired?: number;
            };
            network: {
                api?: string;
                chainId?: string;
                name: import("../WalletAdapters").WalletAdapterNetwork;
            };
            onAccountChange: () => Promise<void>;
            onNetworkChange: () => Promise<void>;
            connect: () => Promise<void>;
            disconnect: () => Promise<void>;
            signAndSubmitTransaction: (transaction: Types.TransactionPayload, options?: any) => Promise<{
                hash: string;
            }>;
            signTransaction: (transaction: Types.TransactionPayload, options?: any) => Promise<Uint8Array>;
            signMessage: (message: string | Uint8Array | SignMessagePayload) => Promise<string | import("../WalletAdapters").SignMessageResponse>;
            eventNames: () => (keyof import("../WalletAdapters").WalletAdapterEvents)[];
            listeners: <T extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T) => ((...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void)[];
            listenerCount: (event: keyof import("../WalletAdapters").WalletAdapterEvents) => number;
            emit: <T_1 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_1, ...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_1, keyof import("../WalletAdapters").WalletAdapterEvents>]) => boolean;
            on: <T_2 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_2, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_2, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            addListener: <T_3 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_3, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_3, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            once: <T_4 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_4, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_4, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            removeListener: <T_5 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_5, fn?: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_5, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any, once?: boolean) => WalletAdapter<string>;
            off: <T_6 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_6, fn?: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_6, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any, once?: boolean) => WalletAdapter<string>;
            removeAllListeners: (event?: keyof import("../WalletAdapters").WalletAdapterEvents) => WalletAdapter<string>;
        };
        readyState: WalletReadyState;
    }[]>;
    wallet: import("vue").Ref<{
        adapter: {
            name: WalletName<string>;
            url: string;
            icon: string;
            readyState: WalletReadyState;
            connecting: boolean;
            connected: boolean;
            publicAccount: {
                publicKey: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                } | (string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                })[];
                address: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                };
                authKey: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                };
                minKeysRequired?: number;
            };
            network: {
                api?: string;
                chainId?: string;
                name: import("../WalletAdapters").WalletAdapterNetwork;
            };
            onAccountChange: () => Promise<void>;
            onNetworkChange: () => Promise<void>;
            connect: () => Promise<void>;
            disconnect: () => Promise<void>;
            signAndSubmitTransaction: (transaction: Types.TransactionPayload, options?: any) => Promise<{
                hash: string;
            }>;
            signTransaction: (transaction: Types.TransactionPayload, options?: any) => Promise<Uint8Array>;
            signMessage: (message: string | Uint8Array | SignMessagePayload) => Promise<string | import("../WalletAdapters").SignMessageResponse>;
            eventNames: () => (keyof import("../WalletAdapters").WalletAdapterEvents)[];
            listeners: <T extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T) => ((...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void)[];
            listenerCount: (event: keyof import("../WalletAdapters").WalletAdapterEvents) => number;
            emit: <T_1 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_1, ...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_1, keyof import("../WalletAdapters").WalletAdapterEvents>]) => boolean;
            on: <T_2 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_2, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_2, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            addListener: <T_3 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_3, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_3, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            once: <T_4 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_4, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_4, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            removeListener: <T_5 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_5, fn?: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_5, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any, once?: boolean) => WalletAdapter<string>;
            off: <T_6 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_6, fn?: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_6, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any, once?: boolean) => WalletAdapter<string>;
            removeAllListeners: (event?: keyof import("../WalletAdapters").WalletAdapterEvents) => WalletAdapter<string>;
        };
        readyState: WalletReadyState;
    }>;
    account: import("vue").Ref<{
        publicKey: string | {
            hex: () => string;
            noPrefix: () => string;
            toString: () => string;
            toShortString: () => string;
            toUint8Array: () => Uint8Array;
        } | (string | {
            hex: () => string;
            noPrefix: () => string;
            toString: () => string;
            toShortString: () => string;
            toUint8Array: () => Uint8Array;
        })[];
        address: string | {
            hex: () => string;
            noPrefix: () => string;
            toString: () => string;
            toShortString: () => string;
            toUint8Array: () => Uint8Array;
        };
        authKey: string | {
            hex: () => string;
            noPrefix: () => string;
            toString: () => string;
            toShortString: () => string;
            toUint8Array: () => Uint8Array;
        };
        minKeysRequired?: number;
    }>;
    connected: import("vue").Ref<boolean>;
    connecting: import("vue").Ref<boolean>;
    disconnecting: import("vue").Ref<boolean>;
    autoConnect: import("vue").Ref<boolean>;
    network: import("vue").Ref<{
        api?: string;
        chainId?: string;
        name: import("../WalletAdapters").WalletAdapterNetwork;
    }>;
    select: (name: WalletName | null) => void;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    signAndSubmitTransaction: (transaction: Types.TransactionPayload, option?: any) => Promise<{
        hash: string;
    }>;
    signTransaction: (transaction: Types.TransactionPayload, option?: any) => Promise<Uint8Array>;
    signMessage: (msgPayload: string | SignMessagePayload | Uint8Array) => Promise<string | import("../WalletAdapters").SignMessageResponse>;
}, "wallets" | "autoConnect" | "wallet" | "account" | "connected" | "network" | "connecting" | "disconnecting">>, Pick<{
    init: ({ wallets, onError: onHandleError, localStorageKey: lsKey, autoConnect: autoConnection }: IUseVueWalletProvider) => void;
    wallets: import("vue").Ref<{
        adapter: {
            name: WalletName<string>;
            url: string;
            icon: string;
            readyState: WalletReadyState;
            connecting: boolean;
            connected: boolean;
            publicAccount: {
                publicKey: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                } | (string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                })[];
                address: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                };
                authKey: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                };
                minKeysRequired?: number;
            };
            network: {
                api?: string;
                chainId?: string;
                name: import("../WalletAdapters").WalletAdapterNetwork;
            };
            onAccountChange: () => Promise<void>;
            onNetworkChange: () => Promise<void>;
            connect: () => Promise<void>;
            disconnect: () => Promise<void>;
            signAndSubmitTransaction: (transaction: Types.TransactionPayload, options?: any) => Promise<{
                hash: string;
            }>;
            signTransaction: (transaction: Types.TransactionPayload, options?: any) => Promise<Uint8Array>;
            signMessage: (message: string | Uint8Array | SignMessagePayload) => Promise<string | import("../WalletAdapters").SignMessageResponse>;
            eventNames: () => (keyof import("../WalletAdapters").WalletAdapterEvents)[];
            listeners: <T extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T) => ((...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void)[];
            listenerCount: (event: keyof import("../WalletAdapters").WalletAdapterEvents) => number;
            emit: <T_1 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_1, ...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_1, keyof import("../WalletAdapters").WalletAdapterEvents>]) => boolean;
            on: <T_2 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_2, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_2, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            addListener: <T_3 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_3, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_3, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            once: <T_4 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_4, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_4, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            removeListener: <T_5 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_5, fn?: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_5, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any, once?: boolean) => WalletAdapter<string>;
            off: <T_6 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_6, fn?: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_6, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any, once?: boolean) => WalletAdapter<string>;
            removeAllListeners: (event?: keyof import("../WalletAdapters").WalletAdapterEvents) => WalletAdapter<string>;
        };
        readyState: WalletReadyState;
    }[]>;
    wallet: import("vue").Ref<{
        adapter: {
            name: WalletName<string>;
            url: string;
            icon: string;
            readyState: WalletReadyState;
            connecting: boolean;
            connected: boolean;
            publicAccount: {
                publicKey: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                } | (string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                })[];
                address: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                };
                authKey: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                };
                minKeysRequired?: number;
            };
            network: {
                api?: string;
                chainId?: string;
                name: import("../WalletAdapters").WalletAdapterNetwork;
            };
            onAccountChange: () => Promise<void>;
            onNetworkChange: () => Promise<void>;
            connect: () => Promise<void>;
            disconnect: () => Promise<void>;
            signAndSubmitTransaction: (transaction: Types.TransactionPayload, options?: any) => Promise<{
                hash: string;
            }>;
            signTransaction: (transaction: Types.TransactionPayload, options?: any) => Promise<Uint8Array>;
            signMessage: (message: string | Uint8Array | SignMessagePayload) => Promise<string | import("../WalletAdapters").SignMessageResponse>;
            eventNames: () => (keyof import("../WalletAdapters").WalletAdapterEvents)[];
            listeners: <T extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T) => ((...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void)[];
            listenerCount: (event: keyof import("../WalletAdapters").WalletAdapterEvents) => number;
            emit: <T_1 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_1, ...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_1, keyof import("../WalletAdapters").WalletAdapterEvents>]) => boolean;
            on: <T_2 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_2, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_2, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            addListener: <T_3 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_3, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_3, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            once: <T_4 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_4, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_4, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            removeListener: <T_5 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_5, fn?: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_5, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any, once?: boolean) => WalletAdapter<string>;
            off: <T_6 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_6, fn?: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_6, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any, once?: boolean) => WalletAdapter<string>;
            removeAllListeners: (event?: keyof import("../WalletAdapters").WalletAdapterEvents) => WalletAdapter<string>;
        };
        readyState: WalletReadyState;
    }>;
    account: import("vue").Ref<{
        publicKey: string | {
            hex: () => string;
            noPrefix: () => string;
            toString: () => string;
            toShortString: () => string;
            toUint8Array: () => Uint8Array;
        } | (string | {
            hex: () => string;
            noPrefix: () => string;
            toString: () => string;
            toShortString: () => string;
            toUint8Array: () => Uint8Array;
        })[];
        address: string | {
            hex: () => string;
            noPrefix: () => string;
            toString: () => string;
            toShortString: () => string;
            toUint8Array: () => Uint8Array;
        };
        authKey: string | {
            hex: () => string;
            noPrefix: () => string;
            toString: () => string;
            toShortString: () => string;
            toUint8Array: () => Uint8Array;
        };
        minKeysRequired?: number;
    }>;
    connected: import("vue").Ref<boolean>;
    connecting: import("vue").Ref<boolean>;
    disconnecting: import("vue").Ref<boolean>;
    autoConnect: import("vue").Ref<boolean>;
    network: import("vue").Ref<{
        api?: string;
        chainId?: string;
        name: import("../WalletAdapters").WalletAdapterNetwork;
    }>;
    select: (name: WalletName | null) => void;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    signAndSubmitTransaction: (transaction: Types.TransactionPayload, option?: any) => Promise<{
        hash: string;
    }>;
    signTransaction: (transaction: Types.TransactionPayload, option?: any) => Promise<Uint8Array>;
    signMessage: (msgPayload: string | SignMessagePayload | Uint8Array) => Promise<string | import("../WalletAdapters").SignMessageResponse>;
}, never>, Pick<{
    init: ({ wallets, onError: onHandleError, localStorageKey: lsKey, autoConnect: autoConnection }: IUseVueWalletProvider) => void;
    wallets: import("vue").Ref<{
        adapter: {
            name: WalletName<string>;
            url: string;
            icon: string;
            readyState: WalletReadyState;
            connecting: boolean;
            connected: boolean;
            publicAccount: {
                publicKey: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                } | (string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                })[];
                address: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                };
                authKey: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                };
                minKeysRequired?: number;
            };
            network: {
                api?: string;
                chainId?: string;
                name: import("../WalletAdapters").WalletAdapterNetwork;
            };
            onAccountChange: () => Promise<void>;
            onNetworkChange: () => Promise<void>;
            connect: () => Promise<void>;
            disconnect: () => Promise<void>;
            signAndSubmitTransaction: (transaction: Types.TransactionPayload, options?: any) => Promise<{
                hash: string;
            }>;
            signTransaction: (transaction: Types.TransactionPayload, options?: any) => Promise<Uint8Array>;
            signMessage: (message: string | Uint8Array | SignMessagePayload) => Promise<string | import("../WalletAdapters").SignMessageResponse>;
            eventNames: () => (keyof import("../WalletAdapters").WalletAdapterEvents)[];
            listeners: <T extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T) => ((...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void)[];
            listenerCount: (event: keyof import("../WalletAdapters").WalletAdapterEvents) => number;
            emit: <T_1 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_1, ...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_1, keyof import("../WalletAdapters").WalletAdapterEvents>]) => boolean;
            on: <T_2 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_2, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_2, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            addListener: <T_3 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_3, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_3, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            once: <T_4 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_4, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_4, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            removeListener: <T_5 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_5, fn?: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_5, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any, once?: boolean) => WalletAdapter<string>;
            off: <T_6 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_6, fn?: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_6, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any, once?: boolean) => WalletAdapter<string>;
            removeAllListeners: (event?: keyof import("../WalletAdapters").WalletAdapterEvents) => WalletAdapter<string>;
        };
        readyState: WalletReadyState;
    }[]>;
    wallet: import("vue").Ref<{
        adapter: {
            name: WalletName<string>;
            url: string;
            icon: string;
            readyState: WalletReadyState;
            connecting: boolean;
            connected: boolean;
            publicAccount: {
                publicKey: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                } | (string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                })[];
                address: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                };
                authKey: string | {
                    hex: () => string;
                    noPrefix: () => string;
                    toString: () => string;
                    toShortString: () => string;
                    toUint8Array: () => Uint8Array;
                };
                minKeysRequired?: number;
            };
            network: {
                api?: string;
                chainId?: string;
                name: import("../WalletAdapters").WalletAdapterNetwork;
            };
            onAccountChange: () => Promise<void>;
            onNetworkChange: () => Promise<void>;
            connect: () => Promise<void>;
            disconnect: () => Promise<void>;
            signAndSubmitTransaction: (transaction: Types.TransactionPayload, options?: any) => Promise<{
                hash: string;
            }>;
            signTransaction: (transaction: Types.TransactionPayload, options?: any) => Promise<Uint8Array>;
            signMessage: (message: string | Uint8Array | SignMessagePayload) => Promise<string | import("../WalletAdapters").SignMessageResponse>;
            eventNames: () => (keyof import("../WalletAdapters").WalletAdapterEvents)[];
            listeners: <T extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T) => ((...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void)[];
            listenerCount: (event: keyof import("../WalletAdapters").WalletAdapterEvents) => number;
            emit: <T_1 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_1, ...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_1, keyof import("../WalletAdapters").WalletAdapterEvents>]) => boolean;
            on: <T_2 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_2, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_2, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            addListener: <T_3 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_3, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_3, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            once: <T_4 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_4, fn: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_4, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any) => WalletAdapter<string>;
            removeListener: <T_5 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_5, fn?: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_5, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any, once?: boolean) => WalletAdapter<string>;
            off: <T_6 extends keyof import("../WalletAdapters").WalletAdapterEvents>(event: T_6, fn?: (...args: import("eventemitter3").ArgumentMap<import("../WalletAdapters").WalletAdapterEvents>[Extract<T_6, keyof import("../WalletAdapters").WalletAdapterEvents>]) => void, context?: any, once?: boolean) => WalletAdapter<string>;
            removeAllListeners: (event?: keyof import("../WalletAdapters").WalletAdapterEvents) => WalletAdapter<string>;
        };
        readyState: WalletReadyState;
    }>;
    account: import("vue").Ref<{
        publicKey: string | {
            hex: () => string;
            noPrefix: () => string;
            toString: () => string;
            toShortString: () => string;
            toUint8Array: () => Uint8Array;
        } | (string | {
            hex: () => string;
            noPrefix: () => string;
            toString: () => string;
            toShortString: () => string;
            toUint8Array: () => Uint8Array;
        })[];
        address: string | {
            hex: () => string;
            noPrefix: () => string;
            toString: () => string;
            toShortString: () => string;
            toUint8Array: () => Uint8Array;
        };
        authKey: string | {
            hex: () => string;
            noPrefix: () => string;
            toString: () => string;
            toShortString: () => string;
            toUint8Array: () => Uint8Array;
        };
        minKeysRequired?: number;
    }>;
    connected: import("vue").Ref<boolean>;
    connecting: import("vue").Ref<boolean>;
    disconnecting: import("vue").Ref<boolean>;
    autoConnect: import("vue").Ref<boolean>;
    network: import("vue").Ref<{
        api?: string;
        chainId?: string;
        name: import("../WalletAdapters").WalletAdapterNetwork;
    }>;
    select: (name: WalletName | null) => void;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    signAndSubmitTransaction: (transaction: Types.TransactionPayload, option?: any) => Promise<{
        hash: string;
    }>;
    signTransaction: (transaction: Types.TransactionPayload, option?: any) => Promise<Uint8Array>;
    signMessage: (msgPayload: string | SignMessagePayload | Uint8Array) => Promise<string | import("../WalletAdapters").SignMessageResponse>;
}, "select" | "connect" | "disconnect" | "signTransaction" | "signMessage" | "init" | "signAndSubmitTransaction">>;
export {};
//# sourceMappingURL=useVueWalletProvider.d.ts.map