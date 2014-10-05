
/**
 * Poem form.
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var forms = require('forms');
var customValidators = require('../validators');
var Poem = mongoose.model('Poem');


module.exports = function(poem) {

  var opts = {
    validatePastFirstError: true
  };

  return forms.create({

    // Word round value.
    roundLengthValue: forms.fields.string({
      value: 3,
      required: forms.validators.required('Enter a round length.'),
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Word round unit.
    roundLengthUnit: forms.fields.string({
      value: 'minutes',
      required: forms.validators.required('Enter a round length unit.')
    }),

    // Seed capital.
    seedCapital: forms.fields.string({
      value: 18000,
      required: forms.validators.required('Enter a seed capital amount.'),
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Submission value.
    submissionVal: forms.fields.string({
      value: 100,
      required: forms.validators.required('Enter a submission value.'),
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    }),

    // Decay halflife.
    decayHalflife: forms.fields.string({
      value: 10,
      required: forms.validators.required('Enter a decay halflife.'),
      validators: [
        customValidators.positiveInteger('Must be a positive integer.')
      ]
    })

  }, opts);

};
