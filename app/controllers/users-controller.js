/*
 * Installation routes.
 */

// Module dependencies.
var forms = require('../../helpers/forms')
  , auth = require('../../helpers/auth');

// Models.
var User = mongoose.model('User');

// Controller actions.
module.exports = function(app) {

    /*
     * GET /admin/users
     */
    app.get('/admin/users', auth.isUser, auth.isSuper, function(req, res) {

        // Get users.
        User.find(function(err, users) {
            res.render('admin/users/index', {
                title:      'Users',
                layout:     '_layouts/users',
                user:       req.user,
                users:      users
            });
        });

    });

}
