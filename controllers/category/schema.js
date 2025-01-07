import Joi from "joi"

const categorySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(3).max(100).optional(),
})

export default categorySchema
