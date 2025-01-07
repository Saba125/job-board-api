import { StatusCodes } from "http-status-codes"
import Category from "../../models/Category.js"
import categorySchema from "./schema.js"
export const createCategory = async (req, res) => {
  const { name, description } = req.body
  const { error } = categorySchema.validate(req.body)
  if (error) {
    return res.status(StatusCodes.EXPECTATION_FAILED).json({
      status: "error",
      message: "Validation failed",
      details: error.details.map((err) => err.message),
    })
  }
  try {
    const category = new Category({
      name,
      description,
    })
    await category.save()
    res.status(StatusCodes.CREATED).json({
      category,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
export const getAllCategories = async (req, res) => {
  try {
    const category = await Category.findAll({})
    res.status(StatusCodes.OK).json({
      category,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
