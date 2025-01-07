import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes"
export const authMiddleware = async (req, res, next) => {
  const authHeaders = req.headers.authorization
  if (!authHeaders || !authHeaders.startsWith("Bearer")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: "error",
      msg: "Authorization header is missing or invalid. Please provide a valid token.",
    })
  }
  const token = authHeaders.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        msg: "Token is invalid. Please log in again.",
      })
    }
    req.user = decoded
    next()
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" })
  }
}
