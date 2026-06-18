"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importTeachingRecords = void 0;
const http_status_codes_1 = require("http-status-codes");
const ErrorCodes_1 = __importDefault(require("../const/ErrorCodes"));
const ErrorBase_1 = __importDefault(require("../errors/ErrorBase"));
const TeachingRecord_1 = __importDefault(require("../models/TeachingRecord"));
const requiredFields = [
    'teacherEmail',
    'teacherName',
    'studentEmail',
    'studentName',
    'classCode',
    'className',
    'subjectCode',
    'subjectName',
    'toDelete',
];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailFields = ['teacherEmail', 'studentEmail'];
const validateCsvItem = (item) => {
    requiredFields.forEach((field) => {
        if (!item[field] || !item[field].trim()) {
            throw new ErrorBase_1.default(`Missing required field: ${field}`, ErrorCodes_1.default.CSV_VALIDATION_ERROR_CODE, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    });
    emailFields.forEach((field) => {
        if (!emailPattern.test(item[field])) {
            throw new ErrorBase_1.default(`Invalid email field: ${field}`, ErrorCodes_1.default.CSV_VALIDATION_ERROR_CODE, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    });
    if (item.toDelete !== '0' && item.toDelete !== '1') {
        throw new ErrorBase_1.default('toDelete must be 0 or 1', ErrorCodes_1.default.CSV_VALIDATION_ERROR_CODE, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
};
const buildLatestDisplayNames = (items) => {
    const latestDisplayNames = {
        teacherNamesByEmail: new Map(),
        studentNamesByEmail: new Map(),
        classNamesByCode: new Map(),
        subjectNamesByCode: new Map(),
    };
    items.forEach((item) => {
        if (item.toDelete === '1') {
            return;
        }
        latestDisplayNames.teacherNamesByEmail.set(item.teacherEmail, item.teacherName);
        latestDisplayNames.studentNamesByEmail.set(item.studentEmail, item.studentName);
        latestDisplayNames.classNamesByCode.set(item.classCode, item.className);
        latestDisplayNames.subjectNamesByCode.set(item.subjectCode, item.subjectName);
    });
    return latestDisplayNames;
};
const getLatestTeachingRecord = (item, latestDisplayNames) => ({
    teacherEmail: item.teacherEmail,
    teacherName: latestDisplayNames.teacherNamesByEmail.get(item.teacherEmail),
    studentEmail: item.studentEmail,
    studentName: latestDisplayNames.studentNamesByEmail.get(item.studentEmail),
    classCode: item.classCode,
    className: latestDisplayNames.classNamesByCode.get(item.classCode),
    subjectCode: item.subjectCode,
    subjectName: latestDisplayNames.subjectNamesByCode.get(item.subjectCode),
});
const updateLatestDisplayNames = async (latestDisplayNames) => {
    for (const [teacherEmail, teacherName] of latestDisplayNames.teacherNamesByEmail) {
        await TeachingRecord_1.default.update({ teacherName }, { where: { teacherEmail } });
    }
    for (const [studentEmail, studentName] of latestDisplayNames.studentNamesByEmail) {
        await TeachingRecord_1.default.update({ studentName }, { where: { studentEmail } });
    }
    for (const [classCode, className] of latestDisplayNames.classNamesByCode) {
        await TeachingRecord_1.default.update({ className }, { where: { classCode } });
    }
    for (const [subjectCode, subjectName] of latestDisplayNames.subjectNamesByCode) {
        await TeachingRecord_1.default.update({ subjectName }, { where: { subjectCode } });
    }
};
const importTeachingRecords = async (items) => {
    //Validate neccessary data checking before saving the list
    items.forEach(validateCsvItem);
    //Create a map to store the latest data for Teacher, Student, Classcode, SubjectCode
    const latestDisplayNames = buildLatestDisplayNames(items);
    //Update DB base on the Map that contain latest Teacher, Student, Classcode, SubjectCode 's name
    await updateLatestDisplayNames(latestDisplayNames);
    //Loop the list, if delete = 1, delete from db, else will do upsert
    for (const item of items) {
        const teachingRecordKey = {
            teacherEmail: item.teacherEmail,
            studentEmail: item.studentEmail,
            classCode: item.classCode,
            subjectCode: item.subjectCode,
        };
        if (item.toDelete === '1') {
            await TeachingRecord_1.default.destroy({ where: teachingRecordKey });
            continue;
        }
        await TeachingRecord_1.default.upsert(Object.assign({}, getLatestTeachingRecord(item, latestDisplayNames)));
    }
};
exports.importTeachingRecords = importTeachingRecords;
//# sourceMappingURL=DataImportService.js.map