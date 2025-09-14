const Joi = require('joi');

// User validation schemas
const userRegistrationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
});

const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Pet validation schemas
const petCreateSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Pet name is required',
      'string.max': 'Pet name must be less than 100 characters',
      'any.required': 'Pet name is required'
    }),
  breed: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Pet breed is required',
      'string.max': 'Pet breed must be less than 100 characters',
      'any.required': 'Pet breed is required'
    }),
  owner_name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Owner name is required',
      'string.max': 'Owner name must be less than 100 characters',
      'any.required': 'Owner name is required'
    }),
  phone: Joi.string()
    .pattern(/^[\+]?[0-9][\d\s\-\(\)]{0,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
      'any.required': 'Phone number is required'
    })
});

const petUpdateSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .allow('')
    .messages({
      'string.min': 'Pet name cannot be empty',
      'string.max': 'Pet name must be less than 100 characters'
    }),
  breed: Joi.string()
    .min(1)
    .max(100)
    .allow('')
    .messages({
      'string.min': 'Pet breed cannot be empty',
      'string.max': 'Pet breed must be less than 100 characters'
    }),
  owner_name: Joi.string()
    .min(1)
    .max(100)
    .allow('')
    .messages({
      'string.min': 'Owner name cannot be empty',
      'string.max': 'Owner name must be less than 100 characters'
    }),
  phone: Joi.string()
    .pattern(/^[\+]?[0-9][\d\s\-\(\)]{0,15}$/)
    .allow('')
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  photo_url: Joi.string()
    .allow('')
    .messages({
      'string.base': 'Photo URL must be a string'
    })
});

// Validation middleware
const validateSchema = (schema) => {
  return (req, res, next) => {
    console.log('🔍 Validation - Request body:', req.body);
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      console.log('❌ Validation - Error details:', error.details);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    console.log('✅ Validation - Passed');
    next();
  };
};

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
  petCreateSchema,
  petUpdateSchema,
  validateSchema
};
