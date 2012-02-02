/*
 * Users administration controller.
 */

// Module dependencies.
var forms = require('../../helpers/forms')
var auth = require('../../helpers/auth')

// Models.
var User = mongoose.model('User');

// Controller actions.
module.exports = function(app) {

    /*
     * GET /admin/users
     */
    app.get('/admin/users', auth.loadUser, auth.isSuper, function(req, res) {
        res.render('admin/users/index', {
            title: 'Users',
            user: req.user,
            layout: '_layouts/admin'
        });
    });

}
