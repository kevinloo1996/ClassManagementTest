jest.mock('../../services/WorkloadReportService', () => ({
  getWorkloadReport: jest.fn(),
}));

const { StatusCodes } = require('http-status-codes');
const { getWorkloadReport } = require('../../services/WorkloadReportService');
const { workloadReportHandler } = require('../WorkloadReportController');
const { loadSampleRecords } = require('./CsvTestData');

const createResponse = () => {
  const response = {};
  response.status = jest.fn().mockReturnValue(response);
  response.send = jest.fn().mockReturnValue(response);
  return response;
};

describe('WorkloadReportController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a workload report based on data.sample.csv', async () => {
    const [record] = await loadSampleRecords();
    const report = {
      [record.teacherEmail]: {
        teacherName: record.teacherName,
        subjects: [{
          subjectCode: record.subjectCode,
          subjectName: record.subjectName,
          numberOfClasses: 1,
        }],
      },
    };
    getWorkloadReport.mockResolvedValue(report);
    const response = createResponse();
    const next = jest.fn();

    await workloadReportHandler({}, response, next);

    expect(response.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(response.send).toHaveBeenCalledWith(report);
    expect(next).not.toHaveBeenCalled();
  });

  it('passes report errors to the global error handler', async () => {
    const reportError = new Error('Report failed');
    getWorkloadReport.mockRejectedValue(reportError);
    const response = createResponse();
    const next = jest.fn();

    await workloadReportHandler({}, response, next);

    expect(next).toHaveBeenCalledWith(reportError);
    expect(response.send).not.toHaveBeenCalled();
  });
});
