
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
      label: 'Username',
      name: 'username',
      required: forms.validators.required('Enter a username.'),
      validators: [
        customValidators.usernameExists('Does not exist.')
      ]
    }),

    // Password.
    password: forms.fields.password({
      label: 'Password',
      name: 'password',
      required: forms.validators.required('Enter a password.'),
      validators: [
        customValidators.passwordCorrect('Incorrect.')
      ]
    })

  }, opts);

};
