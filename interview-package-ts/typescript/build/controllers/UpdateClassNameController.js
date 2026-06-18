"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClassNameHandler = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const ErrorCodes_1 = __importDefault(require("../const/ErrorCodes"));
const ErrorBase_1 = __importDefault(require("../errors/ErrorBase"));
const UpdateClassNameService_1 = require("../services/UpdateClassNameService");
const UpdateClassNameController = express_1.default.Router();
const updateClassNameHandler = async (req, res, next) => {
    try {
        const classCode = req.params.classCode && req.params.classCode.trim();
        const className = typeof req.body.className === 'string'
            ? req.body.className.trim()
            : '';
        if (!classCode) {
            throw new ErrorBase_1.default('classCode is required', ErrorCodes_1.default.UPDATE_CLASS_NAME_VALIDATION_ERROR_CODE, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        if (!className) {
            throw new ErrorBase_1.default('className is required', ErrorCodes_1.default.UPDATE_CLASS_NAME_VALIDATION_ERROR_CODE, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        await UpdateClassNameService_1.updateClassName(classCode, className);
        return res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
    }
    catch (error) {
        return next(error);
    }
};
exports.updateClassNameHandler = updateClassNameHandler;
UpdateClassNameController.put('/class/:classCode', exports.updateClassNameHandler);
exports.default = UpdateClassNameController;
//# sourceMappingURL=UpdateClassNameController.js.map