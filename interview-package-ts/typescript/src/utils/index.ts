import fs from 'fs';
import csv from 'csv-parser';
import { CsvItem } from 'CsvItem';

export const convertCsvToJson = (filePath: string): Promise<CsvItem[]> => {
  const results: CsvItem[] = [];
  const fileStream = fs.createReadStream(filePath);
  const csvStream = fileStream.pipe(csv());

  return new Promise((resolve, reject) => {
    fileStream.on('error', reject);
    csvStream.on('data', (data: CsvItem) => results.push(data));
    csvStream.on('end', () => resolve(results));
    csvStream.on('error', reject);
  });
}
