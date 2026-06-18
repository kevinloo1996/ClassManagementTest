jest.mock('../../services/UpdateClassNameService', () => ({
  updateClassName: jest.fn(),
}));

const { StatusCodes } = require('http-status-codes');
const { updateClassName } = require('../../services/UpdateClassNameService');
const { updateClassNameHandler } = require('../UpdateClassNameController');
const { loadSampleRecords } = require('./CsvTestData');

const createResponse = () => {
  const response = {};
  response.status = jest.fn().mockReturnValue(response);
  response.send = jest.fn().mockReturnValue(response);
  return response;
};

describe('UpdateClassNameController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates a class from data.sample.csv and returns 204', async () => {
    const [record] = await loadSampleRecords();
    const request = {
      params: { classCode: record.classCode },
      body: { className: `${record.className} Updated` },
    };
    const response = createResponse();
    const next = jest.fn();

    await updateClassNameHandler(request, response, next);

    expect(updateClassName).toHaveBeenCalledWith(
      record.classCode,
      `${record.className} Updated`,
    );
    expect(response.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
    expect(response.send).toHaveBeenCalledWith();
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects an empty class name', async () => {
    const [record] = await loadSampleRecords();
    const request = {
      params: { classCode: record.classCode },
      body: { className: '   ' },
    };
    const response = createResponse();
    const next = jest.fn();

    await updateClassNameHandler(request, response, next);

    const error = next.mock.calls[0][0];
    expect(error.getHttpStatusCode()).toBe(StatusCodes.BAD_REQUEST);
    expect(updateClassName).not.toHaveBeenCalled();
  });
});

