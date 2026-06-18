"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const router_1 = __importDefault(require("./router"));
const globalErrorHandler_1 = __importDefault(require("./config/globalErrorHandler"));
const App = express_1.default();
App.use(compression_1.default());
App.use(cors_1.default());
App.use(body_parser_1.default.json());
App.use(body_parser_1.default.urlencoded({ extended: true }));
App.use('/api', router_1.default);
App.use(globalErrorHandler_1.default);
exports.default = App;
//# sourceMappingURL=app.js.map