"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSSR = void 0;
const react_1 = require("react");
const useSSR = () => {
    const [isClient, setIsClient] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (typeof window !== 'undefined') {
            setIsClient(true);
        }
    }, []);
    return {
        isClient
    };
};
exports.useSSR = useSSR;
//# sourceMappingURL=useSSR.js.map