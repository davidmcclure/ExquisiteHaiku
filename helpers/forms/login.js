
/**
 * Login form.
 */

var forms = require('forms');
var customValidators = require('../validators');


module.exports = function() {

  var opts = {
    validatePastFirstError: true
  };

  return forms.create({

    // Username.
    username: forms.fields.string({
      name: 'username',
      label: 'Username',
      required: forms.validators.required('Enter a username.'),
      validators: [
        customValidators.usernameExists('Does not exist.')
      ]
    }),

    // Password.
    password: forms.fields.password({
      name: 'password',
      label: 'Password',
      required: forms.validators.required('Enter a password.'),
      validators: [
        customValidators.passwordCorrect('Incorrect.')
      ]
    })

  }, opts);

};
