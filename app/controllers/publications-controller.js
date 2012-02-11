/*
 * Publications administration routes.
 */

// Module dependencies.
var forms = require('../../helpers/forms'),
    auth = require('../../helpers/auth');

// Models.
var College = mongoose.model('College');
var Publication = mongoose.model('Publication');


// Controller actions.
module.exports = function(app) {


    /*
     * Browse publications.
     *
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.get('/admin/publications',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get colleges.
        Publication.find().sort('name', 1).execFind(function(err, pubs) {

            // Render the list.
            res.render('admin/publications/index', {
                title:      'Publications',
                layout:     '_layouts/publications',
                user:       req.user,
                pubs:       pubs,
                nav:        { main: 'publications', sub: 'browse' }
            });

        });

    });


    /*
     * New publication form.
     *
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.get('/admin/publications/new',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get colleges.
        College.find().sort('name', 1).execFind(function(err, colleges) {

            // Render form.
            res.render('admin/publications/new', {
                title:      'New Publication',
                layout:     '_layouts/publications',
                user:       req.user,
                form:       forms.publicationForms.publication({}),
                colleges:   colleges,
                nav:        { main: 'publications', sub: 'new' }
            });

        });

    });


    /*
     * Process new publication form submission. Rerender the form if validations
     * fail; create new publication and redirect to publications index if valid.
     *
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.post('/admin/publications/new',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Pass control to form.
        forms.publicationForms.publication({}).handle(req, {

            // If field validations pass.
            success: function(form) {

                // Get the parent college.
                College.findOne({
                    slug: form.data.college
                }, function(err, college) {

                    // Create the publication.
                    var publication = new Publication({
                        name:           form.data.name,
                        slug:           form.data.slug,
                        url:            form.data.url,
                        college_id:     college.id
                    });

                    // Save and redirect.
                    publication.save(function(err) {
                        res.redirect('/admin/publications');
                    });

                });

            },

            // If field validations fail.
            other: function(form) {

                // Get colleges.
                College.find().sort('name', 1).execFind(function(err, colleges) {

                    // Render form.
                    res.render('admin/publications/new', {
                        title:      'New Publication',
                        layout:     '_layouts/publications',
                        user:       req.user,
                        form:       form,
                        colleges:   colleges,
                        nav:        { main: 'publications', sub: 'new' }
                    });

                });

            }

        });

    });


    /*
     * Edit a publication.
     *
     * - param string slug: The slug of the publication being edited.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.get('/admin/publications/edit/:slug',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the publication.
        Publication.findOne({ slug: req.params.slug }, function(err, pub) {

            // Edit form.
            var form = forms.publicationForms.publication(pub).bind(pub);

            // Get colleges.
            College.find().sort('name', 1).execFind(function(err, colleges) {

                // Render form.
                res.render('admin/publications/edit', {
                    title:          'Edit Publication',
                    layout:         '_layouts/publications',
                    user:           req.user,
                    colleges:       colleges,
                    pub:            pub,
                    form:           form,
                    nav:            { main: 'colleges', sub: '' }
                });

            });

        });

    });


    /*
     * Process the edit publication form.
     *
     * - param string slug: The slug of the publication being edited.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.post('/admin/publications/edit/:slug',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the publication.
        Publication.findOne({ slug: req.params.slug }, function(err, pub) {

            // Publication form.
            var form = forms.publicationForms.publication(pub);

            // Pass control to form.
            form.handle(req, {

                // If field validations pass.
                success: function(form) {

                    // Get the parent college.
                    College.findOne({
                        slug: form.data.college
                    }, function(err, college) {

                        // Update the publication.
                        pub.name =          form.data.name;
                        pub.slug =          form.data.slug;
                        pub.url =           form.data.url;
                        pub.college_id =    college.id;

                        // Save and redirect.
                        pub.save(function(err) {
                            res.redirect('/admin/publications');
                        });

                    });

                },

                // If field validations fail.
                other: function(form) {

                    // Get colleges.
                    College.find().sort('name', 1).execFind(function(err, colleges) {

                        // Render form.
                        res.render('admin/publications/edit', {
                            title:      'Edit Publication',
                            layout:     '_layouts/publications',
                            user:       req.user,
                            form:       form,
                            pub:        pub,
                            colleges:   colleges,
                            nav:        { main: 'publications', sub: '' }
                        });

                    });

                }

            });

        });

    });


    /*
     * Show delete publication confirmation form.
     *
     * - param string slug: The slug of the publication being deleted.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.get('/admin/publications/delete/:slug',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the publication.
        Publication.findOne({ slug: req.params.slug }, function(err, pub) {

            // Render the form.
            res.render('admin/publications/delete', {
                title:          'Delete Publication',
                layout:         '_layouts/publications',
                user:           req.user,
                pub:            pub,
                nav:            { main: 'publications', sub: '' }
            });

        });

    });


    /*
     * Delete a publication.
     *
     * - param string slug: The slug of the college being deleted.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.post('/admin/publications/delete/:slug',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the publication and delete.
        Publication.findOne({ slug: req.params.slug }, function(err, pub) {
            pub.remove(function(err) {
                res.redirect('/admin/publications');
            });
        });

    });


};
