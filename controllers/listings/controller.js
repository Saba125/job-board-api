import listingSchema from "./schema.js"
import { StatusCodes } from "http-status-codes"
import Listing from "../../models/Listing.js"
import User from "../../models/User.js"
import Category from "../../models/Category.js"
import { Op } from "sequelize"
export const createListing = async (req, res) => {
  const user = req.user
  const {
    title,
    location,
    salary_range,
    job_type,
    application_deadline,
    category_id,
  } = req.body
  const { error } = listingSchema.validate(req.body)
  if (error) {
    return res.status(StatusCodes.EXPECTATION_FAILED).json({
      status: "error",
      message: "Validation failed",
      details: error.details.map((err) => err.message),
    })
  }
  if (user.role === "seeker") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "You need to be employer to create the listing",
    })
  }
  try {
    const listing = new Listing({
      title,
      location,
      salary_range,
      job_type,
      application_deadline,
      user_id: user.userId,
      category_id,
    })
    await listing.save()
    res.status(StatusCodes.CREATED).json({
      listing,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
export const getAllListings = async (req, res) => {
  const { title, location } = req.query
  const filters = {}
  if (title) {
    filters.title = { [Op.like]: `%${title}%` }
  }
  if (location) {
    filters.location = location
  }
  try {
    const listings = await Listing.findAll({
      where: filters,
      include: [
        {
          model: User,
          attributes: ["email"],
        },
        {
          model: Category,
          attributes: ["name"],
        },
      ],
    })
    if (listings.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "No listings found",
      })
    }
    return res.status(StatusCodes.OK).json({
      listings,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
export const getSingleListing = async (req, res) => {
  const { id } = req.params
  try {
    const listing = await Listing.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["email"],
        },
      ],
    })
    return res.status(StatusCodes.OK).json({
      listing,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
export const deleteListing = async (req, res) => {
  const { id } = req.params
  const user = req.user
  try {
    const listing = await Listing.findOne({ where: { id } })
    if (!listing) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Listing with id ${id} not found`,
      })
    }
    if (listing.user_id !== user.userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Only the listing create can delete the listing",
      })
    }
    await listing.destroy()
    res.status(StatusCodes.OK).json({
      msg: `Listing with id ${listing.id} has been successfully deleted`,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
export const editListing = async (req, res) => {
  const user = req.user
  const { title, location, salary_range, job_type, application_deadline } =
    req.body
  const { error } = listingSchema.validate(req.body)
  if (error) {
    return res.status(StatusCodes.EXPECTATION_FAILED).json({
      status: "error",
      message: "Validation failed",
      details: error.details.map((err) => err.message),
    })
  }
  const { id } = req.params
  try {
    const listing = await Listing.findOne({ where: { id } })
    if (!listing) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Listing with id ${id} not found`,
      })
    }
    if (listing.user_id !== user.userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "You can only edit your listing" })
    }
    listing.title = title || listing.title
    listing.location = location || listing.location
    listing.salary_range = salary_range || listing.salary_range
    listing.job_type = job_type || listing.job_type
    listing.application_deadline =
      application_deadline || listing.application_deadline
    await listing.save()
    res.status(StatusCodes.OK).json({
      msg: `Listing with id ${id} has been successfully updated!`,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
