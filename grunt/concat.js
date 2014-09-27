
var vendor = [
  'node_modules/jquery/dist/jquery.js',
  'node_modules/lodash/dist/lodash.js',
  'node_modules/backbone/backbone.js',
  'node_modules/backbone.marionette/lib/backbone.marionette.js',
  'node_modules/bootstrap/dist/bootstrap.js',
  'node_modules/backbone.localstorage/backbone.localStorage.js',
  'node_modules/d3/d3.js'
];

var adminSource = [
  'public/javascripts/src/add/app.js',
  'public/javascripts/src/add/views/*.js',
  'public/javascripts/src/add/controllers/*.js'
];

var poemSource = [
  'public/javascripts/src/poem/app.js',
  'public/javascripts/src/poem/views/*.js',
  'public/javascripts/src/poem/collections/*.js',
  'public/javascripts/src/poem/controllers/*.js'
];

module.exports = {

  poem: {
    src: [].concat(vendor, poemSource),
    dest: 'public/javascripts/dist/poem.js',
    separator: ';'
  },

  admin: {
    src: [].concat(vendor, adminSource),
    dest: 'public/javascripts/dist/admin.js',
    separator: ';'
  },

  test: {
    src: [].concat(vendor, adminSource, poemSource),
    dest: 'public/javascripts/dist/test.js',
    separator: ';'
  }

};
