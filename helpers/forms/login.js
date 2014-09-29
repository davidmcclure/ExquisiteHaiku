
/**
 * Login form.
 */

var forms = require('forms');
var fields = forms.fields;
var validators = require('../validators');


exports.form = function() {

  return forms.create({

    // Username.
    username: fields.string({
      name: 'username',
      label: 'Username',
      required: 'Enter a username.',
      validators: [
        validators.usernameExists('Does not exist.')
      ]
    }),

    // Password.
    password: fields.password({
      name: 'password',
      label: 'Password',
      required: 'Enter a password.',
      validators: [
        validators.passwordCorrect('Incorrect.')
      ]
    })

  });

};
