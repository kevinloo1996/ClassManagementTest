"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentsByClass = void 0;
const axios_1 = __importDefault(require("axios"));
const TeachingRecord_1 = __importDefault(require("../models/TeachingRecord"));
const EXTERNAL_STUDENT_API_URL = 'http://localhost:5000/students';
const EXTERNAL_STUDENT_FETCH_LIMIT = 1000;
//sorting by using student name
const studentComparator = (student1, student2) => {
    return student1.name.localeCompare(student2.name, undefined, {
        numeric: true,
        sensitivity: 'base',
    });
};
const getLocalStudents = async (classCode) => {
    const records = await TeachingRecord_1.default.findAll({
        attributes: ['id', 'studentEmail', 'studentName'],
        where: { classCode },
        order: [['studentName', 'ASC']],
    });
    const studentsByEmail = new Map();
    records.forEach((record) => {
        studentsByEmail.set(record.studentEmail, {
            id: record.id,
            name: record.studentName,
            email: record.studentEmail,
            isExternal: false,
        });
    });
    return Array.from(studentsByEmail.values());
};
const getExternalStudents = async (classCode) => {
    const response = await axios_1.default.get(EXTERNAL_STUDENT_API_URL, {
        params: {
            class: classCode,
            offset: 0,
            limit: EXTERNAL_STUDENT_FETCH_LIMIT,
        },
    });
    return response.data.students.map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        isExternal: true,
    }));
};
const getStudentsByClass = async (classCode, offset, limit) => {
    const [localStudents, externalStudents] = await Promise.all([
        getLocalStudents(classCode),
        getExternalStudents(classCode),
    ]);
    const students = [...localStudents, ...externalStudents].sort(studentComparator);
    return {
        count: students.length,
        students: students.slice(offset, offset + limit),
    };
};
exports.getStudentsByClass = getStudentsByClass;
//# sourceMappingURL=StudentListingService.js.map