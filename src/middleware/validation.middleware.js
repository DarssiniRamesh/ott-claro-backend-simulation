const { validate } = require('class-validator');
const { plainToClass } = require('class-transformer');
const { ApiError } = require('./error.middleware');

/**
 * Validates request body against a DTO class
 * @param {any} dtoClass - The DTO class to validate against
 */
const validateRequest = (dtoClass) => {
  return async (req, res, next) => {
    try {
      const dtoObject = plainToClass(dtoClass, req.body);
      const errors = await validate(dtoObject);

      if (errors.length > 0) {
        const validationErrors = errors.map(error => 
          Object.values(error.constraints).join(', ')
        );

        throw new ApiError(400, 'Validation failed', {
          validationErrors
        });
      }

      req.body = dtoObject;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  validateRequest
};
