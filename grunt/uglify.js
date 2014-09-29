

module.exports = {

  options: {
    separator: ';'
  },

  poem: {
    src: '<%= concat.poem.src %>',
    dest: '<%= concat.poem.dest %>'
  },

  admin: {
    src: '<%= concat.admin.src %>',
    dest: '<%= concat.admin.dest %>'
  },

  test: {
    src: '<%= concat.test.src %>',
    dest: '<%= concat.test.dest %>'
  }

};
