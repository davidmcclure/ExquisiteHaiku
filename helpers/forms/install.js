/*
 * Installation form.
 */

 // Module dependencies.
var forms = require('forms'),
  fields = forms.fields,
  validators = forms.validators;


/*
 * ------------------
 * Installation form.
 * ------------------
 */


exports.form = function() {

  return forms.create({

    // Username.
    username: fields.string({
      name: 'username',
      label: 'Username: *',
      required: 'Enter a username.',
      validators: [
        validators.rangeLength(4, 20, '4-20 characters.')
      ]
    }),

    // Password.
    password: fields.password({
      name: 'password',
      label: 'Password: *',
      required: 'Enter a password.',
      validators: [
        validators.minLength(6, 'At least 6 characters.')
      ]
    }),

    // Password confirmation.
    confirm: fields.password({
      name: 'confirm',
      label: 'Retype Password: *',
      required: 'Confirm your password.',
      validators: [
        validators.matchField('password', 'Does not match.')
      ]
    }),

    // Email.
    email: fields.email({
      name: 'email',
      label: 'Email: *',
      required: 'Enter an email address.'
    })

  });

};
