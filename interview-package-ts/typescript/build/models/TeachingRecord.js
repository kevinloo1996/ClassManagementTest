"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class TeachingRecord extends sequelize_1.Model {
}
TeachingRecord.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    teacherEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    teacherName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    studentEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    studentName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    classCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    className: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    subjectCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    subjectName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    tableName: 'teaching_records',
    indexes: [
        {
            unique: true,
            fields: ['teacherEmail', 'studentEmail', 'classCode', 'subjectCode'],
        },
    ],
});
exports.default = TeachingRecord;
//# sourceMappingURL=TeachingRecord.js.map