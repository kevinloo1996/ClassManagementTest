"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const ErrorCodes_1 = __importDefault(require("../const/ErrorCodes"));
const ErrorBase_1 = __importDefault(require("../errors/ErrorBase"));
const globalErrorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    // Handling of body-parser content malformed error
    if (err.type === 'entity.parse.failed') {
        return res.status(http_status_codes_1.BAD_REQUEST).send({
            errorCode: ErrorCodes_1.default.MALFORMED_JSON_ERROR_CODE,
            message: 'Malformed json'
        });
    }
    if (err instanceof ErrorBase_1.default) {
        const error = err;
        return res.status(error.getHttpStatusCode()).send({
            errorCode: error.getErrorCode(),
            message: error.getMessage()
        });
    }
    else {
        return res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).send({
            errorCode: ErrorCodes_1.default.RUNTIME_ERROR_CODE,
            message: 'Internal Server Error'
        });
    }
};
exports.default = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map