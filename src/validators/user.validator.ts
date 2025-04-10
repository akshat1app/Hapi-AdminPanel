import Joi from 'joi';

const baseUserSchema = {
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('superadmin', 'subadmin'),
};

export const createSubAdminSchema = Joi.object({
  ...baseUserSchema,
  role: Joi.string().valid('subadmin').default('subadmin'),
});

export const createSuperAdminSchema = Joi.object({
  ...baseUserSchema,
  role: Joi.string().valid('superadmin').default('superadmin'),
});

export const updateSubAdminSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string().min(6),
});
