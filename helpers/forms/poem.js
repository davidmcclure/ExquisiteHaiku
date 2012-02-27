/*
 * Poem form.
 */

 // Module dependencies.
var forms = require('forms'),
  fields = forms.fields,
  validators = forms.validators,
  customValidators = require('../validators');

// Models.
var Poem = mongoose.model('Poem');


/*
 * ----------
 * Poem form.
 * ----------
 */


exports.newPoem = function(user) {

  return forms.create({

    // Slug.
    username: fields.string({
      name: 'slug',
      label: 'Slug: *',
      required: 'Enter a slug.',
      validators: [
        customValidators.validSlug('Lowercase letters, numbers, hyphens.'),
        customValidators.uniqueSlug(user, 'Slug taken.')
      ]
    })

  });

};
