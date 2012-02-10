/*
 * College administration routes.
 */

// Module dependencies.
var forms = require('../../helpers/forms')
  , auth = require('../../helpers/auth');

// Models.
var College = mongoose.model('College');


// Controller actions.
module.exports = function(app) {


    /*
     * Browse colleges.
     *
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.get('/admin/colleges',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get colleges.
        College.find().sort('rank', 1).execFind(function(err, colleges) {

            // Render the list.
            res.render('admin/colleges/index', {
                title:      'Colleges',
                layout:     '_layouts/colleges',
                user:       req.user,
                colleges:   colleges,
                nav:        { main: 'colleges', sub: 'browse' }
            });

        });

    });


    /*
     * New college form.
     *
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.get('/admin/colleges/new',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Render form.
        res.render('admin/colleges/new', {
            title:      'New College',
            layout:     '_layouts/colleges',
            user:       req.user,
            form:       forms.collegeForms.college({}),
            nav:        { main: 'colleges', sub: 'new' }
        });

    });


    /*
     * Process new college form submission. Rerender the form if validations
     * fail; create new college and redirect to colleges index if valid.
     *
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.post('/admin/colleges/new',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Pass control to form.
        forms.collegeForms.college({}).handle(req, {

            // If field validations pass.
            success: function(form) {

                // Create the college.
                var college = new College(form.data);

                // Save and redirect.
                college.save(function(err) {
                    res.redirect('/admin/colleges');
                });

            },

            // If field validations fail.
            other: function(form) {

                // Render the form.
                res.render('admin/colleges/new', {
                    title:      'New College',
                    layout:     '_layouts/colleges',
                    user:       req.user,
                    form:       form,
                    nav:        { main: 'colleges', sub: 'new' }
                });

            }

        });

    });


    /*
     * Edit a college.
     *
     * - param string slug: The slug of the college being edited.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.get('/admin/colleges/edit/:slug',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the college.
        College.findOne({ slug: req.params.slug }, function(err, college) {

            // Edit form.
            var form = forms.collegeForms.college(college).bind(college);

            // Render form.
            res.render('admin/colleges/edit', {
                title:          'Edit College',
                layout:         '_layouts/colleges',
                user:           req.user,
                college:        college,
                form:           form,
                nav:            { main: 'colleges', sub: '' }
            });

        });

    });


    /*
     * Process the edit college form on the edit college page.
     *
     * - param string username: The slug of the college being edited.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.post('/admin/colleges/edit/:slug',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the college.
        College.findOne({ slug: req.params.slug }, function(err, college) {

            // College form.
            var form = forms.collegeForms.college(college);

            // Pass control to form.
            form.handle(req, {

                // If field validations pass.
                success: function(form) {

                    // Update the college.
                    college.name =             form.data.name;
                    college.slug =             form.data.slug;
                    college.url =              form.data.url;
                    college.city =             form.data.city;
                    college.state =            form.data.state;
                    college.numUndergrads =    form.data.numUndergrads;
                    college.numGrads =         form.data.numGrads;
                    college.admitRate =        form.data.admitRate;
                    college.rank =             form.data.rank;
                    college.satCR25 =          form.data.satCR25;
                    college.satCR75 =          form.data.satCR75;
                    college.satM25 =           form.data.satM25;
                    college.satM75 =           form.data.satM75;
                    college.satW25 =           form.data.satW25;
                    college.satW75 =           form.data.satW75;
                    college.act25 =            form.data.act25;
                    college.act75 =            form.data.act75;

                    // Save and redirect.
                    college.save(function() {
                        res.redirect('/admin/colleges');
                    });

                },

                // If field validations fail.
                other: function(form) {

                    // Render form.
                    res.render('admin/colleges/edit', {
                        title:          'Edit College',
                        layout:         '_layouts/colleges',
                        user:           req.user,
                        college:        college,
                        form:           form,
                        nav:            { main: 'colleges', sub: '' }
                    });

                }

            });

        });

    });


    /*
     * Show delete college confirmation form.
     *
     * - param string username: The slug of the college being deleted.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.get('/admin/colleges/delete/:slug',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the college.
        College.findOne({ slug: req.params.slug }, function(err, college) {

            // Render the form.
            res.render('admin/colleges/delete', {
                title:          'Delete College',
                layout:         '_layouts/colleges',
                user:           req.user,
                college:        college,
                nav:            { main: 'colleges', sub: '' }
            });

        });

    });


    /*
     * Delete a college.
     *
     * - param string username: The name of the college being deleted.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.post('/admin/colleges/delete/:slug',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the college and delete.
        College.findOne({ slug: req.params.slug }, function(err, college) {
          college.remove(function(err) {
              res.redirect('/admin/colleges');
          });
        });

    });


}
