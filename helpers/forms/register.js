
/**
 * Register form.
 */

var mongoose = require('mongoose');
var forms = require('forms');
var customValidators = require('../validators');
var User = mongoose.model('User');


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
        forms.validators.rangelength(4, 20, '4-20 characters.'),
        customValidators.uniqueField(User, 'username', 'Username taken.')
      ]
    }),

    // Email.
    email: forms.fields.email({
      label: 'Email',
      name: 'email',
      required: forms.validators.required('Enter an email address.'),
      validators: [
        customValidators.uniqueField(User, 'email', 'Email taken.')
      ]
    }),

    // Password.
    password: forms.fields.password({
      label: 'Password',
      name: 'password',
      required: forms.validators.required('Enter a password.'),
      validators: [
        forms.validators.minlength(6, 'At least 6 characters.')
      ]
    }),

    // Password confirmation.
    confirm: forms.fields.password({
      label: 'Confirm',
      name: 'confirm',
      required: forms.validators.required('Retype the password.'),
      validators: [
        forms.validators.matchField('password', 'Does not match.')
      ]
    })

  }, opts);

};
