
module.exports = {

  poem: {
    src: '<%= concat.poem.src %>',
    dest: '<%= concat.poem.dest %>',
    separator: ';'
  },

  admin: {
    src: '<%= concat.admin.src %>',
    dest: '<%= concat.admin.dest %>',
    separator: ';'
  },

  test: {
    src: '<%= concat.test.src %>',
    dest: '<%= concat.test.dest %>',
    separator: ';'
  }

};
