import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class TeachingRecord extends Model {
  public id!: number;
  public teacherEmail!: string;
  public teacherName!: string;
  public studentEmail!: string;
  public studentName!: string;
  public classCode!: string;
  public className!: string;
  public subjectCode!: string;
  public subjectName!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

TeachingRecord.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    teacherEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teacherName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    className: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subjectCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subjectName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'teaching_records',
    indexes: [
      {
        unique: true,
        fields: ['teacherEmail', 'studentEmail', 'classCode', 'subjectCode'],
      },
    ],
  },
);

export default TeachingRecord;
