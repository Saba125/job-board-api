import { StatusCodes } from "http-status-codes"
import applicationSchema from "./schema.js"
import Application from "../../models/Application.js"
import User from "../../models/User.js"
import Listing from "../../models/Listing.js"
import { Op } from "sequelize"
export const createApplication = async (req, res) => {
  const user = req.user
  const { status, listing_id, resume_url } = req.body

  const { error } = applicationSchema.validate(req.body)
  if (error) {
    return res.status(StatusCodes.EXPECTATION_FAILED).json({
      status: "error",
      message: "Validation failed",
      details: error.details.map((err) => err.message),
    })
  }
  if (user.role !== "seeker") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Only the job seekers can apply to the application",
    })
  }
  try {
    const application = new Application({
      status,
      listing_id,
      user_id: user.userId,
      resume_url,
    })
    await application.save()
    res.status(StatusCodes.CREATED).json({
      application,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
export const getApplications = async (req, res) => {
  const user = req.user
  
  try {
    const applications = await Application.findAll({
      where: { user_id: user.userId },
      include: [
        {
          model: User,
          attributes: ["email", "username"],
        },
        {
          model: Listing,
          attributes: ["title"],
        },
      ],
    })
    res.status(StatusCodes.OK).json({ applications })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
export const editApplication = async (req, res) => {
  const user = req.user
  const { id } = req.params
  const { status, resume_url } = req.body
  if (!status || !resume_url) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Status and resume url is required",
    })
  }
  if (user.role !== "employer") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Only employers can edit the application",
    })
  }
  try {
    const application = await Application.findOne({ where: { id } })
    if (!application || application.user_id !== user.userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Application with id ${id} does not exist`,
      })
    }
    application.status = status
    application.resume_url = resume_url
    await application.save()
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
export const deleteApplication = async (req, res) => {
  const { id } = req.params
  const user = req.user
  try {
    const application = await Application.findOne({ where: { id } })
    if (!application) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Application with id ${id} does not exist`,
      })
    }
    if (application.user_id !== user.userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "You can only delete your own application",
      })
    }
    await application.destroy()
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
