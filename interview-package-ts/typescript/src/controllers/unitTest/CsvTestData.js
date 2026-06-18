const path = require('path');
const { convertCsvToJson } = require('../../utils');

const sampleCsvPath = path.resolve(__dirname, '../../../../data.sample.csv');

const loadSampleRecords = () => convertCsvToJson(sampleCsvPath);

module.exports = {
  loadSampleRecords,
  sampleCsvPath,
};

