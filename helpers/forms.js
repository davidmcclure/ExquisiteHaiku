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
                label: 'username',
                required: 'Enter a username.',
                validators: [
                  customValidators.usernameExists('Does not exist.')
                ]
            }),

            password: fields.password({
                label: 'password',
                required: 'Enter a password.',
                validators: [
                  customValidators.passwordCorrectness('Incorrect.')
                ]
            })

        });

    }

};
