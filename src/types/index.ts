import { TransactionPayload_EntryFunctionPayload } from 'aptos/src/generated/models/TransactionPayload_EntryFunctionPayload';
import { TransactionPayload_ScriptPayload } from 'aptos/src/generated/models/TransactionPayload_ScriptPayload';
import { TransactionPayload_ModuleBundlePayload } from 'aptos/src/generated/models/TransactionPayload_ModuleBundlePayload';

export { PendingTransaction } from 'aptos/src/generated/models/PendingTransaction';
export { EntryFunctionPayload } from 'aptos/src/generated/models/EntryFunctionPayload';

export type TransactionPayload =
  | TransactionPayload_EntryFunctionPayload
  | TransactionPayload_ScriptPayload
  | TransactionPayload_ModuleBundlePayload;

export type HexEncodedBytes = string;

export interface INetworkResponse {
  name: string;
  chainId?: string;
  api?: string;
}
