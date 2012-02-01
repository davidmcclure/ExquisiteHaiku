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
                    customValidators.usernameExists('Does not exist.')
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
                    validators.rangeLength(5, 20, '5-20 characters.')
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
