"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const diskStorage = multer_1.default.diskStorage({
    destination: '/tmp/school-administration-system-uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
const upload = multer_1.default({ storage: diskStorage });
exports.default = upload;
//# sourceMappingURL=multer.js.map