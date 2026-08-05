const InvariantError = require('../../utils/InvariantError');
const { ApplicationPayloadSchema, UpdateApplicationStatusSchema } = require('./schema');

const ApplicationsValidator = {
  validateApplicationPayload: (payload) => {
    const validationResult = ApplicationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateUpdateStatusPayload: (payload) => {
    const validationResult = UpdateApplicationStatusSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ApplicationsValidator;
