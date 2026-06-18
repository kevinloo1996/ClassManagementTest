"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const HealthcheckController = express_1.default.Router();
const healthcheckHandler = async (req, res) => {
    return res.sendStatus(http_status_codes_1.StatusCodes.OK);
};
HealthcheckController.get('/healthcheck', healthcheckHandler);
exports.default = HealthcheckController;
//# sourceMappingURL=HealthcheckController.js.map