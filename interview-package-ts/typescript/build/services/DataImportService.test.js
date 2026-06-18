"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TeachingRecord_1 = __importDefault(require("../models/TeachingRecord"));
const DataImportService_1 = require("./DataImportService");
jest.mock('../models/TeachingRecord', () => ({
    update: jest.fn(),
    upsert: jest.fn(),
    destroy: jest.fn(),
}));
const mockTeachingRecord = TeachingRecord_1.default;
describe('DataImportService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockTeachingRecord.update.mockResolvedValue([0, []]);
        mockTeachingRecord.upsert.mockResolvedValue([{}, true]);
        mockTeachingRecord.destroy.mockResolvedValue(0);
    });
    it('upserts teaching records when toDelete is 0', async () => {
        await DataImportService_1.importTeachingRecords([
            {
                teacherEmail: 'teacher1@gmail.com',
                teacherName: 'Teacher 1',
                studentEmail: 'student1@gmail.com',
                studentName: 'Student 1',
                classCode: 'P1-1',
                className: 'P1 Integrity',
                subjectCode: 'MATHS',
                subjectName: 'Mathematics',
                toDelete: '0',
            },
        ]);
        expect(mockTeachingRecord.upsert).toHaveBeenCalledWith({
            teacherEmail: 'teacher1@gmail.com',
            teacherName: 'Teacher 1',
            studentEmail: 'student1@gmail.com',
            studentName: 'Student 1',
            classCode: 'P1-1',
            className: 'P1 Integrity',
            subjectCode: 'MATHS',
            subjectName: 'Mathematics',
        });
    });
    it('deletes the teaching relationship when toDelete is 1', async () => {
        await DataImportService_1.importTeachingRecords([
            {
                teacherEmail: 'teacher1@gmail.com',
                teacherName: 'Teacher 1',
                studentEmail: 'student1@gmail.com',
                studentName: 'Student 1',
                classCode: 'P1-1',
                className: 'P1 Integrity',
                subjectCode: 'MATHS',
                subjectName: 'Mathematics',
                toDelete: '1',
            },
        ]);
        expect(mockTeachingRecord.destroy).toHaveBeenCalledWith({
            where: {
                teacherEmail: 'teacher1@gmail.com',
                studentEmail: 'student1@gmail.com',
                classCode: 'P1-1',
                subjectCode: 'MATHS',
            },
        });
        expect(mockTeachingRecord.upsert).not.toHaveBeenCalled();
    });
    it('updates display names for existing rows using latest csv values', async () => {
        await DataImportService_1.importTeachingRecords([
            {
                teacherEmail: 'teacher1@gmail.com',
                teacherName: 'Updated Teacher',
                studentEmail: 'student1@gmail.com',
                studentName: 'Updated Student',
                classCode: 'P1-1',
                className: 'Updated Class',
                subjectCode: 'MATHS',
                subjectName: 'Updated Subject',
                toDelete: '0',
            },
        ]);
        expect(mockTeachingRecord.update).toHaveBeenCalledWith({ teacherName: 'Updated Teacher' }, { where: { teacherEmail: 'teacher1@gmail.com' } });
        expect(mockTeachingRecord.update).toHaveBeenCalledWith({ studentName: 'Updated Student' }, { where: { studentEmail: 'student1@gmail.com' } });
        expect(mockTeachingRecord.update).toHaveBeenCalledWith({ className: 'Updated Class' }, { where: { classCode: 'P1-1' } });
        expect(mockTeachingRecord.update).toHaveBeenCalledWith({ subjectName: 'Updated Subject' }, { where: { subjectCode: 'MATHS' } });
    });
    it('rejects invalid toDelete values', async () => {
        await expect(DataImportService_1.importTeachingRecords([
            {
                teacherEmail: 'teacher1@gmail.com',
                teacherName: 'Teacher 1',
                studentEmail: 'student1@gmail.com',
                studentName: 'Student 1',
                classCode: 'P1-1',
                className: 'P1 Integrity',
                subjectCode: 'MATHS',
                subjectName: 'Mathematics',
                toDelete: 'yes',
            },
        ])).rejects.toThrow('toDelete must be 0 or 1');
    });
});
//# sourceMappingURL=DataImportService.test.js.map