import Joi from "joi"

const listingSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  location: Joi.string().min(3).max(100).required(),
  salary_range: Joi.string().required(),
  job_type: Joi.string().valid("Full-time", "Part-time").required(),
  application_deadline: Joi.date().greater("now").required(),
  category_id: Joi.number().required(),
})

export default listingSchema
