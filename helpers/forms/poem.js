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
      default: 3,
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Word round unit.
    roundLengthUnit: fields.string({
      required: 'Enter a round length unit.',
      default: 'minutes'
    }),

    // Seed capital.
    seedCapital: fields.string({
      required: 'Enter a seed capital amount.',
      default: 18000,
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Minimum submssions.
    minSubmissions: fields.string({
      required: 'Enter a minimum number of submissions.',
      default: 5,
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Submission value.
    submissionVal: fields.string({
      required: 'Enter a point value for blind submissions.',
      default: 100,
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Decay lifetime.
    decayLifetime: fields.string({
      required: 'Enter a decay lifetime.',
      default: 20,
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Published.
    published: fields.boolean({
      default: true
    })

  });

};
