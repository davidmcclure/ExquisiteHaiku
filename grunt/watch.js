

module.exports = {

  livereload: {
    files: [
      'app/views/**/*.jade',
      'public/**/src/**/*.js'
    ],
    options: { livereload: true }
  },

  dist: {
    files: 'public/javascripts/src/**/*.js',
    tasks: 'compile'
  }

};
