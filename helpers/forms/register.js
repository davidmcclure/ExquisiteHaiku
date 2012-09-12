/*
 * Register form.
 */

 // Module dependencies.
var forms = require('forms');
var mongoose = require('mongoose');
var fields = forms.fields;
var validators = forms.validators;
var custom = require('../validators');

// Models.
var User = mongoose.model('User');


/*
 * --------------
 * Register form.
 * --------------
 */


exports.form = function() {

  return forms.create({

    // Username.
    username: fields.string({
      name: 'username',
      label: 'Username',
      required: 'Enter a username.',
      validators: [
        validators.rangeLength(4, 20, '4-20 characters.'),
        custom.uniqueField(User, 'username', 'Username taken.')
      ]
    }),

    // Email.
    email: fields.email({
      name: 'email',
      label: 'Email',
      required: 'Enter an email address.',
      validators: [
        custom.uniqueField(User, 'email', 'Email taken.')
      ]
    }),

    // Password.
    password: fields.password({
      name: 'password',
      label: 'Password',
      required: 'Enter a password.',
      validators: [
        validators.minLength(6, 'At least 6 characters.')
      ]
    }),

    // Password confirmation.
    confirm: fields.password({
      name: 'confirm',
      label: 'Retype Password',
      required: 'Confirm your password.',
      validators: [
        validators.matchField('password', 'Does not match.')
      ]
    })

  });

};
