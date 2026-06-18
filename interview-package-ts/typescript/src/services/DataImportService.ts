import { StatusCodes } from 'http-status-codes';
import ErrorCodes from '../const/ErrorCodes';
import ErrorBase from '../errors/ErrorBase';
import TeachingRecord from '../models/TeachingRecord';
import { CsvItem } from '../types/CsvItem';

const requiredFields: Array<keyof CsvItem> = [
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
const emailFields: Array<keyof Pick<CsvItem, 'teacherEmail' | 'studentEmail'>> = ['teacherEmail', 'studentEmail'];

const validateCsvItem = (item: CsvItem): void => {
  requiredFields.forEach((field) => {
    if (!item[field] || !item[field].trim()) {
      throw new ErrorBase(`Missing required field: ${field}`, ErrorCodes.CSV_VALIDATION_ERROR_CODE, StatusCodes.BAD_REQUEST);
    }
  });

  emailFields.forEach((field) => {
    if (!emailPattern.test(item[field])) {
      throw new ErrorBase(`Invalid email field: ${field}`, ErrorCodes.CSV_VALIDATION_ERROR_CODE, StatusCodes.BAD_REQUEST);
    }
  });

  if (item.toDelete !== '0' && item.toDelete !== '1') {
    throw new ErrorBase('toDelete must be 0 or 1', ErrorCodes.CSV_VALIDATION_ERROR_CODE, StatusCodes.BAD_REQUEST);
  }
};

interface LatestDisplayNames {
  teacherNamesByEmail: Map<string, string>;
  studentNamesByEmail: Map<string, string>;
  classNamesByCode: Map<string, string>;
  subjectNamesByCode: Map<string, string>;
}

const buildLatestDisplayNames = (items: CsvItem[]): LatestDisplayNames => {
  const latestDisplayNames: LatestDisplayNames = {
    teacherNamesByEmail: new Map<string, string>(),
    studentNamesByEmail: new Map<string, string>(),
    classNamesByCode: new Map<string, string>(),
    subjectNamesByCode: new Map<string, string>(),
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

const getLatestTeachingRecord = (item: CsvItem, latestDisplayNames: LatestDisplayNames) => ({
  teacherEmail: item.teacherEmail,
  teacherName: latestDisplayNames.teacherNamesByEmail.get(item.teacherEmail),
  studentEmail: item.studentEmail,
  studentName: latestDisplayNames.studentNamesByEmail.get(item.studentEmail),
  classCode: item.classCode,
  className: latestDisplayNames.classNamesByCode.get(item.classCode),
  subjectCode: item.subjectCode,
  subjectName: latestDisplayNames.subjectNamesByCode.get(item.subjectCode),
});

const updateLatestDisplayNames = async (latestDisplayNames: LatestDisplayNames): Promise<void> => {
  for (const [teacherEmail, teacherName] of latestDisplayNames.teacherNamesByEmail) {
    await TeachingRecord.update({ teacherName }, { where: { teacherEmail } });
  }

  for (const [studentEmail, studentName] of latestDisplayNames.studentNamesByEmail) {
    await TeachingRecord.update({ studentName }, { where: { studentEmail } });
  }

  for (const [classCode, className] of latestDisplayNames.classNamesByCode) {
    await TeachingRecord.update({ className }, { where: { classCode } });
  }

  for (const [subjectCode, subjectName] of latestDisplayNames.subjectNamesByCode) {
    await TeachingRecord.update({ subjectName }, { where: { subjectCode } });
  }
};

export const importTeachingRecords = async (items: CsvItem[]): Promise<void> => {

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
      await TeachingRecord.destroy({ where: teachingRecordKey });
      continue;
    }

    await TeachingRecord.upsert({
      //upsert the data with the latest name value
      ...getLatestTeachingRecord(item, latestDisplayNames),
    });
  }
};
