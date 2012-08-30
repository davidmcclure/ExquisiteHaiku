/*
 * Poem form.
 */

 // Module dependencies.
var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;
var customValidators = require('../validators');
var _ = require('underscore');

// Models.
var Poem = mongoose.model('Poem');


/*
 * -----------
 * Poem forms.
 * -----------
 */


exports.form = function(poem) {

  return forms.create({

    // Word round length.
    roundLength: fields.string({
      name: 'roundLength',
      label: 'Round Length',
      required: 'Enter a round length.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Minimum submssions.
    minSubmissions: fields.string({
      name: 'minSubmissions',
      label: 'Minimum Submissions',
      required: 'Enter a minimum number of submissions.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Submission value.
    submissionVal: fields.string({
      name: 'submissionVal',
      label: 'Submission Value',
      required: 'Enter a point value for blind submissions.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Decay lifetime.
    decayLifetime: fields.string({
      name: 'decayLifetime',
      label: 'Decay Lifetime',
      required: 'Enter a decay lifetime.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Seed capital.
    seedCapital: fields.string({
      name: 'seedCapital',
      label: 'Seed Capital',
      required: 'Enter a seed capital amount.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    })

  });

};
