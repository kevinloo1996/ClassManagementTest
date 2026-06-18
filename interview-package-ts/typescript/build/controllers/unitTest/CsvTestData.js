"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSampleRecords = exports.sampleCsvPath = void 0;
const path_1 = __importDefault(require("path"));
const utils_1 = require("../../utils");
exports.sampleCsvPath = path_1.default.resolve(__dirname, '../../../../data.sample.csv');
const loadSampleRecords = () => utils_1.convertCsvToJson(exports.sampleCsvPath);
exports.loadSampleRecords = loadSampleRecords;
//# sourceMappingURL=CsvTestData.js.map