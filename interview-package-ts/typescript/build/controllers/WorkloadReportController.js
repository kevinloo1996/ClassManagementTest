"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workloadReportHandler = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const WorkloadReportService_1 = require("../services/WorkloadReportService");
const WorkloadReportController = express_1.default.Router();
const workloadReportHandler = async (req, res, next) => {
    try {
        const report = await WorkloadReportService_1.getWorkloadReport();
        return res.status(http_status_codes_1.StatusCodes.OK).send(report);
    }
    catch (error) {
        return next(error);
    }
};
exports.workloadReportHandler = workloadReportHandler;
WorkloadReportController.get('/reports/workload', exports.workloadReportHandler);
exports.default = WorkloadReportController;
//# sourceMappingURL=WorkloadReportController.js.map