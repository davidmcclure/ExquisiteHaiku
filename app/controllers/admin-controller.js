/*
 * Admin controller
 */

// Module dependencies.
var forms = require('../../helpers/forms')
var auth = require('../../helpers/auth')

// Models.
// var User = mongoose.model('User');

// Controller actions.
module.exports = function(app) {

    /*
     * GET /admin
     */
    app.get('/admin', auth.loadUser, function(req, res) {
        res.render('admin/index', {
            title: '',
            user: req.user,
            layout: '_layouts/admin'
        });
    });

}
