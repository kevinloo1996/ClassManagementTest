"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkloadReport = void 0;
const sequelize_1 = require("sequelize");
const TeachingRecord_1 = __importDefault(require("../models/TeachingRecord"));
const getWorkloadReport = async () => {
    const rows = await TeachingRecord_1.default.findAll({
        attributes: [
            'teacherEmail',
            'teacherName',
            'subjectCode',
            'subjectName',
            [sequelize_1.fn('COUNT', sequelize_1.fn('DISTINCT', sequelize_1.col('classCode'))), 'numberOfClasses'],
        ],
        group: ['teacherEmail', 'teacherName', 'subjectCode', 'subjectName'],
        raw: true,
    });
    rows.sort((row1, row2) => {
        const nameComparison = row1.teacherName.localeCompare(row2.teacherName, undefined, {
            numeric: true,
            sensitivity: 'base',
        });
        //If do not have same name, return list
        if (nameComparison !== 0) {
            return nameComparison;
        }
        //if have same name, we use email
        if (row1.teacherEmail !== row2.teacherEmail) {
            return row1.teacherEmail.localeCompare(row2.teacherEmail);
        }
        //if both name and email same, remain the ori position
        return 0;
    });
    return rows.reduce((report, row) => {
        if (!report[row.teacherEmail]) {
            report[row.teacherEmail] = {
                teacherName: row.teacherName,
                subjects: [],
            };
        }
        report[row.teacherEmail].subjects.push({
            subjectCode: row.subjectCode,
            subjectName: row.subjectName,
            numberOfClasses: Number(row.numberOfClasses),
        });
        return report;
    }, {});
};
exports.getWorkloadReport = getWorkloadReport;
//# sourceMappingURL=WorkloadReportService.js.map