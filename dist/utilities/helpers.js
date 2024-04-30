"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRedirectable = exports.isInAppBrowser = exports.isMobile = void 0;
function isMobile() {
    return /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(navigator.userAgent);
}
exports.isMobile = isMobile;
function isInAppBrowser() {
    const isIphone = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
    const isAndroid = /(Android).*Version\/[\d.]+.*Chrome\/[^\s]+ Mobile/i.test(navigator.userAgent);
    return isIphone || isAndroid;
}
exports.isInAppBrowser = isInAppBrowser;
function isRedirectable() {
    // SSR: return false
    if (!navigator)
        return false;
    // if we are on mobile and NOT in a in-app browser we will redirect to a wallet app
    return isMobile() && !isInAppBrowser();
}
exports.isRedirectable = isRedirectable;
//# sourceMappingURL=helpers.js.map