/*
 * Poem form.
 */

 // Module dependencies.
var forms = require('forms');
var mongoose = require('mongoose');
var customValidators = require('../validators');
var validators = forms.validators;
var fields = forms.fields;
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
      value: 3,
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
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
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Published.
    published: fields.boolean({
      value: true
    })

  });

};
