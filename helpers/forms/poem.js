
/**
 * Poem form.
 */

var forms = require('forms');
var mongoose = require('mongoose');
var validators = require('../validators');
var fields = forms.fields;
var _ = require('underscore');
var Poem = mongoose.model('Poem');


exports.form = function(poem) {

  return forms.create({

    // Word round value.
    roundLengthValue: fields.string({
      required: 'Enter a round length.',
      value: 3,
      validators: [
        validators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Word round unit.
    roundLengthUnit: fields.string({
      required: 'Enter a round length unit.',
      value: 'minutes'
    }),

    // Seed capital.
    seedCapital: fields.string({
      required: 'Enter a seed capital amount.',
      value: 18000,
      validators: [
        validators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Submission value.
    submissionVal: fields.string({
      required: 'Enter a point value for blind submissions.',
      value: 100,
      validators: [
        validators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Decay halflife.
    decayHalflife: fields.string({
      required: 'Enter a decay halflife.',
      value: 10,
      validators: [
        validators.positiveInteger('Must be a positive integer.')
      ]
    })

  });

};
