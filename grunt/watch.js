

module.exports = {

  livereload: {
    files: [
      'app/views/**/*.jade',
      'public/**/src/**/*'
    ],
    options: { livereload: true }
  },

  dist: {
    files: 'public/**/src/**/*',
    tasks: 'compile'
  }

};
