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
    }),

    // Word round length.
    username: fields.string({
      name: 'roundLength',
      label: 'Round Length: *',
      required: 'Enter a round length.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Slice interval.
    username: fields.string({
      name: 'sliceInterval',
      label: 'Slice Interval: *',
      required: 'Enter a slice interval.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Minimum submssions.
    username: fields.string({
      name: 'minSubmissions',
      label: 'Minimum Submissions: *',
      required: 'Enter a minimum number of submissions.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Submission value.
    username: fields.string({
      name: 'submissionVal',
      label: 'Blind Submission Value: *',
      required: 'Enter a point value for blind submissions.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Decay lifetime.
    username: fields.string({
      name: 'decayLifetime',
      label: 'Decay Lifetime: *',
      required: 'Enter a decay lifetime.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Seed capital.
    username: fields.string({
      name: 'seedCapital',
      label: 'Seed Capital: *',
      required: 'Enter a seed capital amount.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    })

  });

};
