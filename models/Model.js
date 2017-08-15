const mongoose = require('mongoose');
const { mongodb } = require('../config');

mongoose.connect(mongodb);

const modelCache = {};

module.exports = class Model {
  constructor(table, schema) {
    this.model = modelCache[table] || (modelCache[table] = mongoose.model(table, schema));
  }
};
