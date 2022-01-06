const joi = require("joi");

module.exports.salonValidatorSchema = joi.object({
  salon: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
    })
    .required(),
});
