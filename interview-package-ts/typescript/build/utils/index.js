"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCsvToJson = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const convertCsvToJson = (filePath) => {
    const results = [];
    const fileStream = fs_1.default.createReadStream(filePath);
    const csvStream = fileStream.pipe(csv_parser_1.default());
    return new Promise((resolve, reject) => {
        fileStream.on('error', reject);
        csvStream.on('data', (data) => results.push(data));
        csvStream.on('end', () => resolve(results));
        csvStream.on('error', reject);
    });
};
exports.convertCsvToJson = convertCsvToJson;
//# sourceMappingURL=index.js.map