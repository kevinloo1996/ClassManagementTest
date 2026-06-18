"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DataImportController_1 = __importDefault(require("./controllers/DataImportController"));
const HealthcheckController_1 = __importDefault(require("./controllers/HealthcheckController"));
const StudentListingController_1 = __importDefault(require("./controllers/StudentListingController"));
const UpdateClassNameController_1 = __importDefault(require("./controllers/UpdateClassNameController"));
const WorkloadReportController_1 = __importDefault(require("./controllers/WorkloadReportController"));
const router = express_1.default.Router();
router.use('/', DataImportController_1.default);
router.use('/', StudentListingController_1.default);
router.use('/', UpdateClassNameController_1.default);
router.use('/', WorkloadReportController_1.default);
router.use('/', HealthcheckController_1.default);
exports.default = router;
//# sourceMappingURL=router.js.map