import Joi from "joi"

const applicationSchema = Joi.object({
  status: Joi.string()
    .valid(
      "Pending",
      "Under Review",
      "Interview Scheduled",
      "Accepted",
      "Rejected"
    )
    .required(),
  listing_id: Joi.number().required(),
  resume_url: Joi.string().required(),
})

export default applicationSchema
