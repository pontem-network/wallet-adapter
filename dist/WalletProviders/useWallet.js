"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWallet = exports.WalletContext = void 0;
const react_1 = require("react");
const DEFAULT_CONTEXT = {
    autoConnect: false,
    connecting: false,
    connected: false,
    disconnecting: false
};
exports.WalletContext = (0, react_1.createContext)(DEFAULT_CONTEXT);
function useWallet() {
    return (0, react_1.useContext)(exports.WalletContext);
}
exports.useWallet = useWallet;
//# sourceMappingURL=useWallet.js.map