import Express, { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import ErrorCodes from '../const/ErrorCodes';
import ErrorBase from '../errors/ErrorBase';
import { getStudentsByClass } from '../services/StudentListingService';

const StudentListingController = Express.Router();

const parseNumberQuery = (value: unknown, field: string): number => {
  const numberValue = Number(value);

  if (value === undefined || !Number.isInteger(numberValue) || numberValue < 0) {
    throw new ErrorBase(`${field} must be a non-negative integer`, ErrorCodes.STUDENT_LISTING_VALIDATION_ERROR_CODE, StatusCodes.BAD_REQUEST);
  }

  return numberValue;
};

export const studentListingHandler: RequestHandler = async (req, res, next) => {
  try {
    const { classCode } = req.params;
    const offset = parseNumberQuery(req.query.offset, 'offset');
    const limit = parseNumberQuery(req.query.limit, 'limit');

    if (!classCode || !classCode.trim()) {
      throw new ErrorBase('classCode is required', ErrorCodes.STUDENT_LISTING_VALIDATION_ERROR_CODE, StatusCodes.BAD_REQUEST);
    }

    const result = await getStudentsByClass(classCode, offset, limit);
    return res.status(StatusCodes.OK).send(result);
  } catch (e) {
    return next(e);
  }
};

StudentListingController.get('/class/:classCode/students', studentListingHandler);

export default StudentListingController;
