import Joi from "joi"

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username must be a string.",
    "string.empty": "Username is required.",
    "string.min": "Username must be at least 3 characters.",
    "string.max": "Username cannot exceed 30 characters.",
    "any.required": "Username is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string.",
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(8).max(50).required().messages({
    "string.base": "Password must be a string.",
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters.",
    "string.max": "Password cannot exceed 50 characters.",
    "any.required": "Password is required.",
  }),
  role: Joi.string().valid("seeker", "employer").optional().messages({
    "any.only": "Role must be one of ['seeker', 'employer'].",
  }),
})
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string.",
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(8).max(50).required().messages({
    "string.base": "Password must be a string.",
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters.",
    "string.max": "Password cannot exceed 50 characters.",
    "any.required": "Password is required.",
  }),
})

export default {
  registerSchema,
  loginSchema,
}
