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

    }

};
