/*
 * Database connector.
 */

exports = mongoose = require('mongoose');
exports = db = mongoose.connect(config.db.uri);
exports = Schema = mongoose.Schema;
