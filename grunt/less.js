

module.exports = {

  options: {
    paths: 'node_modules',
    cleancss: true
  },

  admin: {
    src: 'public/stylesheets/src/admin/index.less',
    dest: 'public/stylesheets/dist/admin.css'
  },

  poem: {
    src: 'public/stylesheets/src/poem/index.less',
    dest: 'public/stylesheets/dist/poem.css'
  }

};
