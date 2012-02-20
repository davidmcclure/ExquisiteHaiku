/*
 * Login form.
 */

 // Module dependencies.
var forms = require('forms'),
  fields = forms.fields,
  validators = forms.validators,
  customValidators = require('../validators');


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
      label: 'Username: *',
      required: 'Enter a username.',
      validators: [
        customValidators.usernameExists('Does not exist.'),
        customValidators.usernameActive('Inactive account.')
      ]
    }),

    // Password.
    password: fields.password({
      name: 'password',
      label: 'Password: *',
      required: 'Enter a password.',
      validators: [
        customValidators.passwordCorrect('Incorrect.')
      ]
    })

  });

};
