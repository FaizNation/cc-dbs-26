const Joi = require('joi');

const ApplicationPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  status: Joi.string().valid('pending', 'reviewing', 'accepted', 'rejected').default('pending'),
});

const UpdateApplicationStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'reviewing', 'accepted', 'rejected').required(),
});

module.exports = { ApplicationPayloadSchema, UpdateApplicationStatusSchema };
