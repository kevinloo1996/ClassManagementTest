jest.mock('../../services/StudentListingService', () => ({
  getStudentsByClass: jest.fn(),
}));

const { StatusCodes } = require('http-status-codes');
const { getStudentsByClass } = require('../../services/StudentListingService');
const { studentListingHandler } = require('../StudentListingController');
const { loadSampleRecords } = require('./CsvTestData');

const createResponse = () => {
  const response = {};
  response.status = jest.fn().mockReturnValue(response);
  response.send = jest.fn().mockReturnValue(response);
  return response;
};

describe('StudentListingController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns students for a class from data.sample.csv', async () => {
    const [record] = await loadSampleRecords();
    const result = {
      count: 1,
      students: [{
        id: 1,
        name: record.studentName,
        email: record.studentEmail,
        isExternal: false,
      }],
    };
    getStudentsByClass.mockResolvedValue(result);
    const request = {
      params: { classCode: record.classCode },
      query: { offset: '0', limit: '10' },
    };
    const response = createResponse();
    const next = jest.fn();

    await studentListingHandler(request, response, next);

    expect(getStudentsByClass).toHaveBeenCalledWith(record.classCode, 0, 10);
    expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(response.send).toHaveBeenCalledWith(result);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects an invalid offset', async () => {
    const [record] = await loadSampleRecords();
    const request = {
      params: { classCode: record.classCode },
      query: { offset: '-1', limit: '10' },
    };
    const response = createResponse();
    const next = jest.fn();

    await studentListingHandler(request, response, next);

    const error = next.mock.calls[0][0];
    expect(error.getHttpStatusCode()).toBe(StatusCodes.BAD_REQUEST);
    expect(getStudentsByClass).not.toHaveBeenCalled();
  });
});

