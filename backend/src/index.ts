import express, { Request, Response } from "express"
import cors from 'cors'
import "dotenv/config"
import mongoose from "mongoose"
import userRoutes from "./routes/users"
import authRoutes from "./routes/auth"
import myHotelRoutes from "./routes/my-hotels"
import cookieParser from "cookie-parser"
import path from "path"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)

const app = express()

app.use(cookieParser())
app.use(express.json())

// parsing url
app.use(express.urlencoded({
    extended: true
})) 

// ONLY ALLOWS REQUESTS FROM THIS FRONTEND URL 
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(express.static(path.join(__dirname, "../../frontend/dist")))

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/my-hotels", myHotelRoutes)

// catch-all route -> pass all requests that are not api routes the index.html for the frontend
app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
})

app.listen(7000, () => {
    console.log("Server running on localhost: 7000")
})