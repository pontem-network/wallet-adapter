"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payloadV1ToV0 = void 0;
const payloadV1ToV0 = (payload) => {
    const v1 = payload;
    return {
        type: 'script_function_payload',
        function: v1.function,
        type_arguments: v1.type_arguments,
        arguments: v1.arguments
    };
};
exports.payloadV1ToV0 = payloadV1ToV0;
//# sourceMappingURL=util.js.map