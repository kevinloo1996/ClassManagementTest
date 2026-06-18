"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const database_1 = __importDefault(require("./config/database"));
const logger_1 = __importDefault(require("./config/logger"));
const app_1 = __importDefault(require("./app"));
const MAX_RETRY = 20;
const LOG = new logger_1.default('server.js');
const { PORT = 3000 } = process.env;
const startApplication = async (retryCount) => {
    try {
        await database_1.default.authenticate();
        app_1.default.listen(PORT, () => {
            LOG.info(`Application started at http://localhost:${PORT}`);
        });
    }
    catch (e) {
        LOG.error(e);
        const nextRetryCount = retryCount - 1;
        if (nextRetryCount > 0) {
            setTimeout(async () => await startApplication(nextRetryCount), 3000);
            return;
        }
        LOG.error('Unable to start application');
    }
};
startApplication(MAX_RETRY);
//# sourceMappingURL=server.js.map