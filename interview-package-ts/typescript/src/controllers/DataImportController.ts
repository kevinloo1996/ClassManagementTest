import Express, { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import Logger from '../config/logger';
import upload from '../config/multer';
import { importTeachingRecords } from '../services/DataImportService';
import { convertCsvToJson } from '../utils';

const DataImportController = Express.Router();
const LOG = new Logger('DataImportController.js');

// TODO: Please implement Question 1 requirement here
export const dataImportHandler: RequestHandler = async (req, res, next) => {
  try {
    const { file } = req;

    const data = await convertCsvToJson(file.path);
    LOG.info(JSON.stringify(data, null, 2));

    //Go in to DataImportService
    await importTeachingRecords(data);

    return res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (e) {
    return next(e);
  }
}

DataImportController.post('/upload', upload.single('data'), dataImportHandler);

export default DataImportController;
