/*
 * User forms.
 */

 // Module dependencies.
var forms = require('forms'),
  fields = forms.fields,
  validators = forms.validators,
  customValidators = require('../validators');

// Models.
var User = mongoose.model('User');


/*
 * ----------------------
 * User forms.
 * ----------------------
 */


exports.newUser = function() {

  return forms.create({

    // Username.
    username: fields.string({
      name: 'username',
      label: 'Username: *',
      required: 'Enter a username.',
      validators: [
        validators.rangeLength(4, 20, '4-20 characters.'),
        customValidators.uniqueField(User, 'username', 'Username taken.')
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
      required: 'Confirm the password.',
      validators: [
        validators.matchField('password', 'Does not match.')
      ]
    }),

    // Email.
    email: fields.email({
      name: 'email',
      label: 'Email: *',
      required: 'Enter an email address.',
      validators: [
        customValidators.uniqueField(User, 'email', 'Email taken.')
      ]
    }),

    // Super/regular.
    superUser: fields.boolean({
        label: 'Super User:'
    }),

    // Active/inactive.
    active: fields.boolean({
        label: 'Active:'
    })

  });

};


exports.editInfo = function(user) {

  return forms.create({

    // Username.
    username: fields.string({
      name: 'username',
      label: 'Username: *',
      required: 'Enter a username.',
      validators: [
        validators.rangeLength(4, 20, '4-20 characters.'),
        customValidators.uniqueNonSelfField(
          User,
          'username',
          user,
          'Username taken.'
        )
      ]
    }),

    // Email.
    email: fields.email({
      name: 'email',
      label: 'Email: *',
      required: 'Enter an email address.',
      validators: [
        customValidators.uniqueNonSelfField(
          User,
          'email',
          user,
          'Email taken.'
        )
      ]
    }),

    // Super/regular.
    superUser: fields.boolean({
        label: 'Super User:'
    }),

    // Active/inactive.
    active: fields.boolean({
        label: 'Active:'
    })

  });

};


exports.editPassword = function() {

  return forms.create({

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
      required: 'Confirm the password.',
      validators: [
        validators.matchField('password', 'Does not match.')
      ]
    })

  });

};
