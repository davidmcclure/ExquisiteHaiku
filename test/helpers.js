
/**
 * Testing helpers.
 */

/**
 * Save a document.
 *
 * @param {Object} document: The Mongoose document.
 * @param {Function} callback: Completion callback.
 */
exports.save = function(document, callback) {
  document.save(function(err) {
    callback(err, document);
  });
};

/**
 * Truncate a collection.
 *
 * @param {Object} model: The Mongoose collection.
 * @param {Function} callback: Completion callback.
 */
exports.remove = function(model, callback) {
  model.collection.remove(function(err) {
    callback(err, model);
  });
};
