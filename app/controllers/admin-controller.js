/*
 * Admin controller
 */

// Module dependencies.
var auth = require('../../helpers/auth')

// Controller actions.
module.exports = function(app) {

    /*
     * GET /admin
     */
    app.get('/admin', auth.loadUser, function(req, res) {
        res.render('admin/index', {
            title: '',
            user: req.user,
            active: '',
            layout: '_layouts/admin'
        });
    });

}
