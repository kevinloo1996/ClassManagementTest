"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("./logger"));
const LOG = new logger_1.default('database.js');
const { DB_HOST = 'localhost', DB_PORT = '33306', DB_SCHEMA = 'school-administration-system', DB_USER = 'root', DB_PW = 'password', DB_POOL_ACQUIRE = '30000', DB_POOL_IDLE = '10000', DB_POOL_MAX_CONN = '10', DB_POOL_MIN_CONN = '1', DB_LOG_LEVEL = 'info', } = process.env;
const sequelize = new sequelize_1.Sequelize(DB_SCHEMA, DB_USER, DB_PW, {
    dialect: 'mysql',
    host: DB_HOST,
    port: parseInt(DB_PORT),
    pool: {
        acquire: parseInt(DB_POOL_ACQUIRE),
        idle: parseInt(DB_POOL_IDLE),
        max: parseInt(DB_POOL_MAX_CONN),
        min: parseInt(DB_POOL_MIN_CONN)
    },
    timezone: '+08:00',
    logging: (msg) => {
        LOG.log(DB_LOG_LEVEL, msg);
    }
});
exports.default = sequelize;
//# sourceMappingURL=database.js.map