/*
 * Login form.
 */

 // Module dependencies.
var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;
var customValidators = require('../validators');


/*
 * ----------------------
 * Installation form.
 * ----------------------
 */


exports.form = function() {

  return forms.create({

    // Username.
    username: fields.string({
      name: 'username',
      label: 'Username',
      required: 'Enter a username.',
      validators: [
        customValidators.usernameExists('Does not exist.'),
        customValidators.usernameAdmin('Unauthorized.')
      ]
    }),

    // Password.
    password: fields.password({
      name: 'password',
      label: 'Password',
      required: 'Enter a password.',
      validators: [
        customValidators.passwordCorrect('Incorrect.')
      ]
    })

  });

};
