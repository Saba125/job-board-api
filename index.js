import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import sequelize from "./db/connect.js"
import User from "./models/User.js"
import Listing from "./models/Listing.js"
import Application from "./models/Application.js" // No need to dynamically require here
import Category from "./models/Category.js"
import usersRouter from "./routes/usersRouter.js"
import listingRouter from "./routes/listingsRouter.js"
import categoryRouter from "./routes/categoryController.js"
import applicationRouter from "./routes/applicationsController.js"
import helmet from "helmet"
import morgan from "morgan"
import xss from "xss-clean"
import rateLimiter from "express-rate-limit"
import { authMiddleware } from "./middlewares/auth.js"
import createAssociation from "./associations/index.js"
import cookieParser from "cookie-parser"
// Load environment variables from .env file

const app = express()
dotenv.config()
const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
}
// Middlewares
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(cors(corsOptions))
app.use(morgan("dev"))
app.use(helmet())
app.use(xss())
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
)
// Associations
createAssociation()
// Db Connect
sequelize
  .sync()
  .then(() => {
    console.log("Database connected")
  })
  .catch((error) => {
    console.log(error)
  })

// Routes
const PORT = process.env.PORT || 3000
// Run app
app.use("/api/auth", usersRouter)
app.use("/api/listing", listingRouter)
app.use("/api/category", categoryRouter)
app.use("/api/application", applicationRouter)
app.get("/", authMiddleware, (req, res) => {
  res.send("Hello world")
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
