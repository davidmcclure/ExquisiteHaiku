

module.exports = {

  livereload: {
    files: [
      'app/views/**/*.jade',
      'public/javascripts/src/**/*.js',
      'stylus/**/*.styl'
    ],
    options: { livereload: true }
  },

  dist: {
    files: 'public/javascripts/src/**/*.js',
    tasks: 'concat'
  }

};
