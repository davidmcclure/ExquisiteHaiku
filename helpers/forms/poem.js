
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
      label: 'Word Length',
      name: 'roundLengthValue',
      value: 3,
      required: forms.validators.required('Enter a round length.'),
      validators: [
        forms.validators.integer('Must be an integer.'),
        forms.validators.min(0, 'Must be greater than 0.')
      ]
    }),

    // Word round unit.
    roundLengthUnit: forms.fields.string({
      name: 'roundLengthUnit',
      value: 'minutes',
      required: forms.validators.required('Enter a round length unit.')
    }),

    // Seed capital.
    seedCapital: forms.fields.string({
      label: 'Points per Word',
      name: 'seedCapital',
      value: 18000,
      required: forms.validators.required('Enter a seed capital amount.'),
      validators: [
        forms.validators.integer('Must be an integer.'),
        forms.validators.min(0, 'Must be greater than 0.')
      ]
    }),

    // Submission value.
    submissionVal: forms.fields.string({
      label: 'Submission Value',
      name: 'submissionVal',
      value: 100,
      required: forms.validators.required('Enter a submission value.'),
      validators: [
        forms.validators.integer('Must be an integer.'),
        forms.validators.min(0, 'Must be greater than 0.')
      ]
    }),

    // Decay halflife.
    decayHalflife: forms.fields.string({
      label: 'Decay Halflife',
      name: 'decayHalflife',
      value: 10,
      required: forms.validators.required('Enter a decay halflife.'),
      validators: [
        forms.validators.integer('Must be an integer.'),
        forms.validators.min(0, 'Must be greater than 0.')
      ]
    })

  }, opts);

};
