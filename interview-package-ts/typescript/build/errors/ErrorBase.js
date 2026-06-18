"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorBase extends Error {
    constructor(message, errorCode, httpStatusCode) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatusCode = httpStatusCode;
    }
    getMessage() {
        return this.message;
    }
    getErrorCode() {
        return this.errorCode;
    }
    getHttpStatusCode() {
        return this.httpStatusCode;
    }
}
exports.default = ErrorBase;
//# sourceMappingURL=ErrorBase.js.map