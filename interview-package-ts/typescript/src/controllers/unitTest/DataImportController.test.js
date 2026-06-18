jest.mock('../../models/TeachingRecord', () => ({
  update: jest.fn(),
  upsert: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock('../../utils', () => ({
  convertCsvToJson: jest.fn(),
}));

jest.mock('../../config/logger', () => jest.fn().mockImplementation(() => ({
  info: jest.fn(),
})));

const { StatusCodes } = require('http-status-codes');
const TeachingRecord = require('../../models/TeachingRecord');
const { convertCsvToJson } = require('../../utils');
const actualCsvUtils = jest.requireActual('../../utils');
const { dataImportHandler } = require('../DataImportController');
const { sampleCsvPath } = require('./CsvTestData');

describe('DataImportController create, update and delete', () => {
  let sampleRecord;

  beforeAll(async () => {
    const records = await actualCsvUtils.convertCsvToJson(sampleCsvPath);
    [sampleRecord] = records;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    TeachingRecord.update.mockResolvedValue([0]);
    TeachingRecord.upsert.mockResolvedValue(undefined);
    TeachingRecord.destroy.mockResolvedValue(1);
  });

  const createResponse = () => ({
    sendStatus: jest.fn(),
  });

  it('creates a record successfully and returns 204', async () => {
    const createRecord = { ...sampleRecord, toDelete: '0' };
    convertCsvToJson.mockResolvedValue([createRecord]);
    const response = createResponse();
    const next = jest.fn();

    await dataImportHandler(
      { file: { path: sampleCsvPath } },
      response,
      next,
    );

    expect(TeachingRecord.upsert).toHaveBeenCalledWith({
      teacherEmail: createRecord.teacherEmail,
      teacherName: createRecord.teacherName,
      studentEmail: createRecord.studentEmail,
      studentName: createRecord.studentName,
      classCode: createRecord.classCode,
      className: createRecord.className,
      subjectCode: createRecord.subjectCode,
      subjectName: createRecord.subjectName,
    });
    expect(response.sendStatus).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
    expect(next).not.toHaveBeenCalled();
  });

  it('passes a create error to next', async () => {
    const createError = new Error('Create failed');
    convertCsvToJson.mockResolvedValue([{ ...sampleRecord, toDelete: '0' }]);
    TeachingRecord.upsert.mockRejectedValue(createError);
    const response = createResponse();
    const next = jest.fn();

    await dataImportHandler(
      { file: { path: sampleCsvPath } },
      response,
      next,
    );

    expect(next).toHaveBeenCalledWith(createError);
    expect(response.sendStatus).not.toHaveBeenCalled();
  });

  it('updates records with the latest display name and returns 204', async () => {
    const originalRecord = {
      ...sampleRecord,
      teacherName: 'Teacher Original',
      toDelete: '0',
    };
    const latestRecord = {
      ...sampleRecord,
      teacherName: 'Teacher Updated',
      studentEmail: 'updated-student@gmail.com',
      studentName: 'Updated Student',
      toDelete: '0',
    };
    convertCsvToJson.mockResolvedValue([originalRecord, latestRecord]);
    const response = createResponse();
    const next = jest.fn();

    await dataImportHandler(
      { file: { path: sampleCsvPath } },
      response,
      next,
    );

    expect(TeachingRecord.update).toHaveBeenCalledWith(
      { teacherName: 'Teacher Updated' },
      { where: { teacherEmail: sampleRecord.teacherEmail } },
    );
    expect(TeachingRecord.upsert).toHaveBeenCalledTimes(2);
    expect(response.sendStatus).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
    expect(next).not.toHaveBeenCalled();
  });

  it('passes an update error to next', async () => {
    const updateError = new Error('Update failed');
    convertCsvToJson.mockResolvedValue([{ ...sampleRecord, toDelete: '0' }]);
    TeachingRecord.update.mockRejectedValueOnce(updateError);
    const response = createResponse();
    const next = jest.fn();

    await dataImportHandler(
      { file: { path: sampleCsvPath } },
      response,
      next,
    );

    expect(next).toHaveBeenCalledWith(updateError);
    expect(TeachingRecord.upsert).not.toHaveBeenCalled();
    expect(response.sendStatus).not.toHaveBeenCalled();
  });

  it('deletes a record successfully and returns 204', async () => {
    const deleteRecord = { ...sampleRecord, toDelete: '1' };
    convertCsvToJson.mockResolvedValue([deleteRecord]);
    const response = createResponse();
    const next = jest.fn();

    await dataImportHandler(
      { file: { path: sampleCsvPath } },
      response,
      next,
    );

    expect(TeachingRecord.destroy).toHaveBeenCalledWith({
      where: {
        teacherEmail: deleteRecord.teacherEmail,
        studentEmail: deleteRecord.studentEmail,
        classCode: deleteRecord.classCode,
        subjectCode: deleteRecord.subjectCode,
      },
    });
    expect(TeachingRecord.upsert).not.toHaveBeenCalled();
    expect(response.sendStatus).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
    expect(next).not.toHaveBeenCalled();
  });

  it('passes a delete error to next', async () => {
    const deleteError = new Error('Delete failed');
    convertCsvToJson.mockResolvedValue([{ ...sampleRecord, toDelete: '1' }]);
    TeachingRecord.destroy.mockRejectedValue(deleteError);
    const response = createResponse();
    const next = jest.fn();

    await dataImportHandler(
      { file: { path: sampleCsvPath } },
      response,
      next,
    );

    expect(next).toHaveBeenCalledWith(deleteError);
    expect(response.sendStatus).not.toHaveBeenCalled();
  });

  it('passes an error to next when no file is uploaded', async () => {
    const response = createResponse();
    const next = jest.fn();

    await dataImportHandler({}, response, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(TeachingRecord.upsert).not.toHaveBeenCalled();
    expect(response.sendStatus).not.toHaveBeenCalled();
  });

  it('passes a CSV parsing error to next', async () => {
    const csvError = new Error('CSV parsing failed');
    convertCsvToJson.mockRejectedValue(csvError);
    const response = createResponse();
    const next = jest.fn();

    await dataImportHandler(
      { file: { path: sampleCsvPath } },
      response,
      next,
    );

    expect(next).toHaveBeenCalledWith(csvError);
    expect(TeachingRecord.upsert).not.toHaveBeenCalled();
    expect(response.sendStatus).not.toHaveBeenCalled();
  });
});
