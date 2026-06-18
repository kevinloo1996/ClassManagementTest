import { StatusCodes } from 'http-status-codes';
import ErrorCodes from '../const/ErrorCodes';
import ErrorBase from '../errors/ErrorBase';
import TeachingRecord from '../models/TeachingRecord';

export const updateClassName = async (classCode: string, className: string): Promise<void> => {
  const [updatedCount] = await TeachingRecord.update(
    { className },
    { where: { classCode } },
  );

  if (updatedCount === 0) {
    throw new ErrorBase(
      'Class not found',
      ErrorCodes.UPDATE_CLASS_NAME_VALIDATION_ERROR_CODE,
      StatusCodes.BAD_REQUEST,
    );
  }
};
