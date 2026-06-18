import Express, { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getWorkloadReport } from '../services/WorkloadReportService';

const WorkloadReportController = Express.Router();

export const workloadReportHandler: RequestHandler = async (req, res, next) => {
  try {
    const report = await getWorkloadReport();
    return res.status(StatusCodes.OK).send(report);
  } catch (error) {
    return next(error);
  }
};

WorkloadReportController.get('/reports/workload', workloadReportHandler);

export default WorkloadReportController;
