"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClassName = void 0;
const http_status_codes_1 = require("http-status-codes");
const ErrorCodes_1 = __importDefault(require("../const/ErrorCodes"));
const ErrorBase_1 = __importDefault(require("../errors/ErrorBase"));
const TeachingRecord_1 = __importDefault(require("../models/TeachingRecord"));
const updateClassName = async (classCode, className) => {
    const [updatedCount] = await TeachingRecord_1.default.update({ className }, { where: { classCode } });
    if (updatedCount === 0) {
        throw new ErrorBase_1.default('Class not found', ErrorCodes_1.default.UPDATE_CLASS_NAME_VALIDATION_ERROR_CODE, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
};
exports.updateClassName = updateClassName;
//# sourceMappingURL=UpdateClassNameService.js.map