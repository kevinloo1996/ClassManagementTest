import Express, { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import ErrorCodes from '../const/ErrorCodes';
import ErrorBase from '../errors/ErrorBase';
import { updateClassName } from '../services/UpdateClassNameService';

const UpdateClassNameController = Express.Router();

export const updateClassNameHandler: RequestHandler = async (req, res, next) => {
  try {
    const classCode = req.params.classCode && req.params.classCode.trim();
    const className = typeof req.body.className === 'string'
      ? req.body.className.trim()
      : '';

    if (!classCode) {
      throw new ErrorBase(
        'classCode is required',
        ErrorCodes.UPDATE_CLASS_NAME_VALIDATION_ERROR_CODE,
        StatusCodes.BAD_REQUEST,
      );
    }

    if (!className) {
      throw new ErrorBase(
        'className is required',
        ErrorCodes.UPDATE_CLASS_NAME_VALIDATION_ERROR_CODE,
        StatusCodes.BAD_REQUEST,
      );
    }

    await updateClassName(classCode, className);
    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    return next(error);
  }
};

UpdateClassNameController.put('/class/:classCode', updateClassNameHandler);

export default UpdateClassNameController;
