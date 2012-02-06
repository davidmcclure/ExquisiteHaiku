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

    // Login.
    login: function() {

        return forms.create({

            username: fields.string({
                label: 'Username: *',
                required: 'Enter a username.',
                validators: [
                    customValidators.usernameExists('Does not exist.'),
                    customValidators.usernameActive('Inactive account.')
                ]
            }),

            password: fields.password({
                label: 'Password: *',
                required: 'Enter a password.',
                validators: [
                    customValidators.passwordCorrectness('Incorrect.')
                ]
            })

        });

    },

    // Installation.
    install: function() {

        return forms.create({

            username: fields.string({
                label: 'Username: *',
                required: 'Enter a username.',
                validators: [
                    validators.rangeLength(4, 20, '4-20 characters.')
                ]
            }),

            password: fields.password({
                label: 'Password: *',
                required: 'Enter a password.',
                validators: [validators.minLength(6, 'At least 6 characters')]
            }),

            confirm: fields.password({
                label: 'Retype Password: *',
                required: 'Confirm your password.',
                validators: [validators.matchField('password', 'Does not match.')]
            }),

            email: fields.email({
                label: 'Email: *',
                required: 'Enter an email address.'
            })

        });

    }

};

// User administration forms.
exports.userForms = {

    // New user.
    new: function() {

        return forms.create({

            username: fields.string({
                label: 'Username: *',
                required: 'Enter a username.',
                validators: [
                    validators.rangeLength(4, 20, '4-20 characters.'),
                    customValidators.uniqueUsername('Username taken.')
                ]
            }),

            password: fields.password({
                label: 'Password: *',
                required: 'Enter a password.',
                validators: [validators.minLength(6, 'At least 6 characters')]
            }),

            confirm: fields.password({
                label: 'Retype Password: *',
                required: 'Confirm your password.',
                validators: [validators.matchField('password', 'Does not match.')]
            }),

            email: fields.email({
                label: 'Email: *',
                required: 'Enter an email address.',
                validators: [
                    customValidators.uniqueEmail('Email taken.')
                ]
            }),

            superUser: fields.boolean({
                label: 'Super User:'
            }),

            active: fields.boolean({
                label: 'Active:'
            })

        });

    },

    // Edit user information.
    editInformation: function(user) {

        return forms.create({

            username: fields.string({
                label: 'Username: *',
                required: 'Enter a username.',
                validators: [
                    validators.rangeLength(4, 20, '4-20 characters.'),
                    customValidators.uniqueUsernameOnEdit(user, 'Username taken.')
                ]
            }),

            email: fields.email({
                label: 'Email: *',
                required: 'Enter an email address.',
                validators: [
                    customValidators.uniqueEmailOnEdit(user, 'Email taken.')
                ]
            }),

            superUser: fields.boolean({
                label: 'Super User:'
            }),

            active: fields.boolean({
                label: 'Active:'
            })

        });

    },

    // Change password.
    changePassword: function() {

        return forms.create({

            password: fields.password({
                label: 'Password: *',
                required: 'Enter a password.',
                validators: [validators.minLength(6, 'At least 6 characters')]
            }),

            confirm: fields.password({
                label: 'Retype Password: *',
                required: 'Confirm password.',
                validators: [validators.matchField('password', 'Does not match.')]
            })

        });

    }

};
