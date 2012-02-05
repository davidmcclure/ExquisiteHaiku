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
    app.get('/admin', auth.isUser, function(req, res) {
        res.render('admin/index', {
            title:      'CollegeSypder',
            layout:     '_layouts/admin',
            user:       req.user,
            nav:        { main: '', sub: '' }
        });
    });

}
