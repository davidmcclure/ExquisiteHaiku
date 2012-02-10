/*
 * Form builders.
 */

 // Module dependencies.
var forms = require('forms')
  , fields = forms.fields
  , validators = forms.validators
  , customValidators = require('./validators');


// Authorization forms.
exports.authForms = {


    /*
     * Login form.
     *
     * - return object form: The form.
     */
    login: function() {

        return forms.create({

            // Username.
            username: fields.string({
                label: 'Username: *',
                required: 'Enter a username.',
                validators: [
                    customValidators.usernameExists('Does not exist.'),
                    customValidators.usernameActive('Inactive account.')
                ]
            }),

            // Password.
            password: fields.password({
                label: 'Password: *',
                required: 'Enter a password.',
                validators: [
                    customValidators.passwordCorrectness('Incorrect.')
                ]
            })

        });

    },


    /*
     * Installation form. Used to set starting admin account.
     *
     * - return object form: The form.
     */
    install: function() {

        return forms.create({

            // Username.
            username: fields.string({
                label: 'Username: *',
                required: 'Enter a username.',
                validators: [
                    validators.rangeLength(4, 20, '4-20 characters.')
                ]
            }),

            // Password.
            password: fields.password({
                label: 'Password: *',
                required: 'Enter a password.',
                validators: [
                    validators.minLength(6, 'At least 6 characters')
                ]
            }),

            // Password confirmation.
            confirm: fields.password({
                label: 'Retype Password: *',
                required: 'Confirm your password.',
                validators: [
                    validators.matchField('password', 'Does not match.')
                ]
            }),

            // Email.
            email: fields.email({
                label: 'Email: *',
                required: 'Enter an email address.'
            })

        });

    }


};


// User administration forms.
exports.userForms = {


    /*
     * New user form.
     *
     * - return object form: The form.
     */
    newUser: function() {

        return forms.create({

            // Username.
            username: fields.string({
                label: 'Username: *',
                required: 'Enter a username.',
                validators: [
                    validators.rangeLength(4, 20, '4-20 characters.'),
                    customValidators.uniqueUsername('Username taken.')
                ]
            }),

            // Password.
            password: fields.password({
                label: 'Password: *',
                required: 'Enter a password.',
                validators: [
                    validators.minLength(6, 'At least 6 characters')
                ]
            }),

            // Password confirmation.
            confirm: fields.password({
                label: 'Retype Password: *',
                required: 'Confirm your password.',
                validators: [
                    validators.matchField('password', 'Does not match.')
                ]
            }),

            // Email.
            email: fields.email({
                label: 'Email: *',
                required: 'Enter an email address.',
                validators: [
                    customValidators.uniqueEmail('Email taken.')
                ]
            }),

            // Super/regular.
            superUser: fields.boolean({
                label: 'Super User:'
            }),

            // Active/inactive.
            active: fields.boolean({
                label: 'Active:'
            })

        });

    },


    /*
     * Edit user form.
     *
     * - param object user: The user that is being edited.
     *
     * - return object form: The form.
     */
    editInformation: function(user) {

        return forms.create({

            // Username.
            username: fields.string({
                label: 'Username: *',
                required: 'Enter a username.',
                validators: [
                    validators.rangeLength(4, 20, '4-20 characters.'),
                    customValidators.uniqueNonSelfUsername(user, 'Username taken.')
                ]
            }),

            // Email.
            email: fields.email({
                label: 'Email: *',
                required: 'Enter an email address.',
                validators: [
                    customValidators.uniqueNonSelfEmail(user, 'Email taken.')
                ]
            }),

            // Super/regular.
            superUser: fields.boolean({
                label: 'Super User:'
            }),

            // Active/inactive.
            active: fields.boolean({
                label: 'Active:'
            })

        });

    },


    /*
     * Change password form.
     *
     * - return object form: The form.
     */
    changePassword: function() {

        return forms.create({

            // Password.
            password: fields.password({
                label: 'Password: *',
                required: 'Enter a password.',
                validators: [
                    validators.minLength(6, 'At least 6 characters')
                ]
            }),

            // Password confirmation.
            confirm: fields.password({
                label: 'Retype Password: *',
                required: 'Confirm password.',
                validators: [
                    validators.matchField('password', 'Does not match.')
                ]
            })

        });

    }


};


// College administration forms.
exports.collegeForms = {


    /*
     * Add/edit college form.
     *
     * - param object college: The college being edited.
     *
     * - return object form: The form.
     */
    college: function(college) {

        return forms.create({

            // Name.
            name: fields.string({
                label: 'Name: *',
                required: 'Enter a name.',
                validators: [
                    validators.maxLength(50, 'Less than 50 characters.'),
                    customValidators.uniqueNonSelfCollegeName(college, 'Name taken.')
                ]
            }),

            // Slug.
            slug: fields.string({
                label: 'Slug: *',
                required: 'Enter a slug.',
                validators: [
                    validators.maxLength(50, 'Less than 50 characters.'),
                    customValidators.uniqueNonSelfCollegeSlug(college, 'Slug taken.')
                ]
            }),

            // Url.
            url: fields.url({
                label: 'Url:'
            }),

            // City.
            city: fields.string({
                label: 'City:'
            }),

            // State.
            state: fields.string({
                label: 'State:',
                validators: [
                    customValidators.validState('Enter a valid state code.')
                ]
            }),

            // Number of undergraduates.
            numUndergrads: fields.number({
                label: '# Undergrads:',
                validators: [
                    customValidators.positiveInteger('Enter a positive integer.')
                ]
            }),

            // Number of graduate students.
            numGrads: fields.number({
                label: '# Grads:',
                validators: [
                    customValidators.positiveInteger('Enter a positive integer.')
                ]
            }),

            // Acceptance rate.
            admitRate: fields.number({
                label: 'Acceptance Rate:',
                validators: [
                    validators.max(100, '0-100.'),
                    customValidators.positive('Enter a positive number.')
                ]
            }),

            // Rank.
            rank: fields.number({
                label: 'Rank:',
                validators: [
                    customValidators.positiveInteger('Enter a positive integer.')
                ]
            }),

            // SAT CR 25.
            satCR25: fields.number({
                label: 'SAT CR 25%:',
                validators: [
                    validators.range(200, 800, '200-800.'),
                    customValidators.positiveInteger('Enter a positive integer.')
                ]
            }),

            // SAT CR 75.
            satCR75: fields.number({
                label: 'SAT CR 75%:',
                validators: [
                    validators.range(200, 800, '200-800.'),
                    customValidators.positiveInteger('Enter a positive integer.')
                ]
            }),

            // SAT M 25.
            satM25: fields.number({
                label: 'SAT M 25%:',
                validators: [
                    validators.range(200, 800, '200-800.'),
                    customValidators.positiveInteger('Enter a positive integer.')
                ]
            }),

            // SAT M 75.
            satM75: fields.number({
                label: 'SAT M 75%:',
                validators: [
                    validators.range(200, 800, '200-800.'),
                    customValidators.positiveInteger('Enter a positive integer.')
                ]
            }),

            // SAT W 25.
            satW25: fields.number({
                label: 'SAT W 25%:',
                validators: [
                    validators.range(200, 800, '200-800.'),
                    customValidators.positiveInteger('Enter a positive integer.')
                ]
            }),

            // SAT W 75.
            satW75: fields.number({
                label: 'SAT W 75%:',
                validators: [
                    validators.range(200, 800, '200-800.'),
                    customValidators.positiveInteger('Enter a positive integer.')
                ]
            }),

            // ACT 25.
            act25: fields.number({
                label: 'ACT 25%:',
                validators: [
                    validators.range(1, 36, '1-36.'),
                    customValidators.positiveInteger('Enter a positive integer.')
                ]
            }),

            // ACT 75.
            act75: fields.number({
                label: 'ACT 75%:',
                validators: [
                    validators.range(1, 36, '1-36.'),
                    customValidators.positiveInteger('Enter a positive integer.')
                ]
            })

        });

    }


};


// Publication administration forms.
exports.publicationForms = {


    /*
     * Add/edit publication form.
     *
     * - param object pub: The publication being edited.
     *
     * - return object form: The form.
     */
    publication: function(pub) {

        return forms.create({

            // Name.
            name: fields.string({
                label: 'Name: *',
                required: 'Enter a name.',
                validators: [
                    validators.maxLength(50, 'Less than 50 characters.')
                    // customValidators.uniqueNonSelfPublicationName(pub, 'Name taken.')
                ]
            }),

            // Url.
            url: fields.url({
                label: 'Url: *',
                required: 'Enter a url.',
                validators: [
                    // customValidators.uniqueNonSelfPublicationUrl(pub, 'Name taken.')
                ]
            }),

            // College.
            college: fields.array({
                label: 'College: *'
            })

        });

    }


};
