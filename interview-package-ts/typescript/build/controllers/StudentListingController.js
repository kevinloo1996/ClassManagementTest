"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentListingHandler = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const ErrorCodes_1 = __importDefault(require("../const/ErrorCodes"));
const ErrorBase_1 = __importDefault(require("../errors/ErrorBase"));
const StudentListingService_1 = require("../services/StudentListingService");
const StudentListingController = express_1.default.Router();
const parseNumberQuery = (value, field) => {
    const numberValue = Number(value);
    if (value === undefined || !Number.isInteger(numberValue) || numberValue < 0) {
        throw new ErrorBase_1.default(`${field} must be a non-negative integer`, ErrorCodes_1.default.STUDENT_LISTING_VALIDATION_ERROR_CODE, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    return numberValue;
};
const studentListingHandler = async (req, res, next) => {
    try {
        const { classCode } = req.params;
        const offset = parseNumberQuery(req.query.offset, 'offset');
        const limit = parseNumberQuery(req.query.limit, 'limit');
        if (!classCode || !classCode.trim()) {
            throw new ErrorBase_1.default('classCode is required', ErrorCodes_1.default.STUDENT_LISTING_VALIDATION_ERROR_CODE, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const result = await StudentListingService_1.getStudentsByClass(classCode, offset, limit);
        return res.status(http_status_codes_1.StatusCodes.OK).send(result);
    }
    catch (e) {
        return next(e);
    }
};
exports.studentListingHandler = studentListingHandler;
StudentListingController.get('/class/:classCode/students', exports.studentListingHandler);
exports.default = StudentListingController;
//# sourceMappingURL=StudentListingController.js.map