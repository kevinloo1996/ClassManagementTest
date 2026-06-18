"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataImportHandler = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../config/logger"));
const multer_1 = __importDefault(require("../config/multer"));
const DataImportService_1 = require("../services/DataImportService");
const utils_1 = require("../utils");
const DataImportController = express_1.default.Router();
const LOG = new logger_1.default('DataImportController.js');
// TODO: Please implement Question 1 requirement here
const dataImportHandler = async (req, res, next) => {
    try {
        const { file } = req;
        const data = await utils_1.convertCsvToJson(file.path);
        LOG.info(JSON.stringify(data, null, 2));
        //Go in to DataImportService
        await DataImportService_1.importTeachingRecords(data);
        return res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
    catch (e) {
        return next(e);
    }
};
exports.dataImportHandler = dataImportHandler;
DataImportController.post('/upload', multer_1.default.single('data'), exports.dataImportHandler);
exports.default = DataImportController;
//# sourceMappingURL=DataImportController.js.map