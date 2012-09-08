/*
 * Poem form.
 */

 // Module dependencies.
var forms = require('forms');
var mongoose = require('mongoose');
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

    // Word round value.
    roundLengthValue: fields.string({
      required: 'Enter a round length.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Word round unit.
    roundLengthUnit: fields.string({
      required: 'Enter a round length unit.'
    }),

    // Minimum submssions.
    minSubmissions: fields.string({
      required: 'Enter a minimum number of submissions.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Submission value.
    submissionVal: fields.string({
      required: 'Enter a point value for blind submissions.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Decay lifetime.
    decayLifetime: fields.string({
      required: 'Enter a decay lifetime.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Seed capital.
    seedCapital: fields.string({
      required: 'Enter a seed capital amount.',
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    })

  });

};
