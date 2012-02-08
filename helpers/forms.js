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
    new: function() {

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
