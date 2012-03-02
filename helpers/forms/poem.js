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

// Reserved slugs.
var _slugs = require('./_slugs');


/*
 * ----------
 * Poem form.
 * ----------
 */


exports.form = function(user) {

  return forms.create({

    // Slug.
    slug: fields.string({
      name: 'slug',
      label: 'URL Slug:',
      required: 'Enter a slug.',
      validators: [
        customValidators.validSlug('Lowercase letters, numbers, hyphens.'),
        customValidators.uniqueSlug(user, 'Slug taken.'),
        customValidators.fieldAllowed(_slugs.blacklist, 'Reserved.')
      ]
    }),

    // Word round length.
    roundLength: fields.string({
      name: 'roundLength',
      label: 'Round Length:',
      required: 'Enter a round length.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Slice interval.
    sliceInterval: fields.string({
      name: 'sliceInterval',
      label: 'Slicing Interval:',
      required: 'Enter a slice interval.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Minimum submssions.
    minSubmissions: fields.string({
      name: 'minSubmissions',
      label: 'Minimum Submissions:',
      required: 'Enter a minimum number of submissions.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Submission value.
    submissionVal: fields.string({
      name: 'submissionVal',
      label: 'Submission Value:',
      required: 'Enter a point value for blind submissions.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Decay lifetime.
    decayLifetime: fields.string({
      name: 'decayLifetime',
      label: 'Decay Lifetime:',
      required: 'Enter a decay lifetime.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Seed capital.
    seedCapital: fields.string({
      name: 'seedCapital',
      label: 'Seed Capital:',
      required: 'Enter a seed capital amount.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    })

  });

};
