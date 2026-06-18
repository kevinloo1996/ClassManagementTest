import { col, fn } from 'sequelize';
import TeachingRecord from '../models/TeachingRecord';

//So I dont need to create two interface
export type WorkloadReport = Record<string, {
  teacherName: string;
  subjects: Array<{
    subjectCode: string;
    subjectName: string;
    numberOfClasses: number;
  }>;
}>;

export const getWorkloadReport = async (): Promise<WorkloadReport> => {
  const rows: any[] = await TeachingRecord.findAll({
    attributes: [
      'teacherEmail',
      'teacherName',
      'subjectCode',
      'subjectName',
      [fn('COUNT', fn('DISTINCT', col('classCode'))), 'numberOfClasses'],
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

  return rows.reduce<WorkloadReport>((report, row) => {
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
