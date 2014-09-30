

module.exports = {

  options: {
    separator: ';'
  },

  admin: {
    src: '<%= concat.admin.src %>',
    dest: '<%= concat.admin.dest %>'
  },

  poem: {
    src: '<%= concat.poem.src %>',
    dest: '<%= concat.poem.dest %>'
  }

};
