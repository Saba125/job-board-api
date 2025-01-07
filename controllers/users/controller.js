import { StatusCodes } from "http-status-codes"
import User from "../../models/User.js"
import bcrpyt from "bcryptjs"
import crypto from "crypto"
import createJwtToken from "../../utils/createJWT.js"
import sendRegisterEmail from "../../utils/sendRegisterEmail.js"
import comparePassword from "../../utils/comparePassword.js"
import sendLoginEmail from "../../utils/sendLoginEmail.js"
import authSchema from "./schema.js"
export const register = async (req, res) => {
  const { error } = authSchema.registerSchema.validate(req.body)
  if (error) {
    return res.status(StatusCodes.EXPECTATION_FAILED).json({
      status: "error",
      message: "Validation failed",
      details: error.details.map((err) => err.message),
    })
  }
  const { username, email, password, role } = req.body
  const rounds = 10
  const oneDay = 1000 * 60 * 60 * 24
  const origin = "http://localhost:3000"
  const hashedPassword = await bcrpyt.hash(password, rounds)
  const verificationCode = crypto.randomBytes(40).toString("hex")

  try {
    const currentUser = await User.findOne({ where: { email } })
    if (currentUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User with that email already exists" })
    }
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      verificationCode,
    })
    const verifyEmail = `${origin}/user/verify-email?token=${user.verificationCode}&email=${email}`
    const token = createJwtToken(user)
    await user.save()
    await sendRegisterEmail(user.email, verifyEmail)
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
      expires: new Date(Date.now() + oneDay),
    })
    res.status(StatusCodes.CREATED).json({
      user,
      token,
    })
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
export const login = async (req, res) => {
  const { error } = authSchema.loginSchema.validate(req.body)
  if (error) {
    return res.status(StatusCodes.EXPECTATION_FAILED).json({
      status: "error",
      message: "Validation failed",
      details: error.details.map((err) => err.message),
    })
  }
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Email or password is missing",
    })
  }
  try {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: `User with email ${email} does not exist`,
      })
    }
    const isPassCorrect = await comparePassword(password, user.password)
    if (!isPassCorrect) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Password is incorrect",
      })
    }
    const token = createJwtToken(user)
    await sendLoginEmail(user.email)
    res.status(StatusCodes.OK).json({
      user,
      token,
    })
  } catch (error) {
    console.log(err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
export const showMe = async (req, res) => {
  try {
    const user = req.user
    const currentUser = await User.findOne({ where: { id: user.userId } })
    res.status(StatusCodes.OK).json({
      currentUser,
    })
  } catch (error) {
    console.log(err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
