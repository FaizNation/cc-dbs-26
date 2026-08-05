const InvariantError = require('../../utils/InvariantError');
const { CategoryPayloadSchema } = require('./schema');

const CategoriesValidator = {
  validateCategoryPayload: (payload) => {
    const validationResult = CategoryPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CategoriesValidator;
