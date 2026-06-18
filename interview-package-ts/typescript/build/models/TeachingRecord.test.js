"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TeachingRecord_1 = __importDefault(require("./TeachingRecord"));
describe('TeachingRecord model', () => {
    it('maps to the teaching_records table', () => {
        expect(TeachingRecord_1.default.getTableName()).toBe('teaching_records');
    });
    it('defines the teaching assignment fields', () => {
        expect(Object.keys(TeachingRecord_1.default.rawAttributes)).toEqual(expect.arrayContaining([
            'id',
            'teacherEmail',
            'teacherName',
            'studentEmail',
            'studentName',
            'classCode',
            'className',
            'subjectCode',
            'subjectName',
        ]));
    });
    it('uses teacher student class and subject as the unique teaching relationship', () => {
        expect(TeachingRecord_1.default.options.indexes).toEqual(expect.arrayContaining([
            expect.objectContaining({
                unique: true,
                fields: ['teacherEmail', 'studentEmail', 'classCode', 'subjectCode'],
            }),
        ]));
    });
});
//# sourceMappingURL=TeachingRecord.test.js.map