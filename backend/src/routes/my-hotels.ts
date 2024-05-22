import express, { Request, Response } from "express";
import multer from "multer"
import cloudinary from "cloudinary"
import Hotel from "../models/hotels";
import { HotelType } from "../../shared/types";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router()

const storage = multer.memoryStorage()

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})

router.post(
    "/",
    verifyToken,
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("city").notEmpty().withMessage("City is required"),
        body("country").notEmpty().withMessage("Country is required"),
        body("description").notEmpty().withMessage("Description"),
        body("type").notEmpty().withMessage("Hotel type is required"),
        body("pricePerNight").notEmpty().isNumeric().withMessage("Price per night is required and must be a number"),
        body("facilities").notEmpty().isArray().withMessage("Facilities are required")
    ],
    // multer will expect a form property called imageFiles which will be an array with 6 images
    // multer will then handle the files and attach a files object to the request which will then use in our function
    upload.array("imageFiles", 6),
    async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[]
            const newHotel: HotelType = req.body;

            // console.log(newHotel)

            // 1. upload the images to cloudinary

            // these images will be uploaded at the same time
            const imageUrls = await uploadImages(imageFiles);
            // 2. if upload was succesful, add the URLS to the new hotel
            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date(); // best do it on server programmatically
            newHotel.userId = req.userId // browser will send the http auth token cookie which will be decoded by our middleware and set the userId to our request    

            // 3. save the new hotel in our database
            const hotel = new Hotel(newHotel)

            await hotel.save(); // any errors that occur will by catched by the try catch block

            // 4. return 201 status
            res.status(201).send(hotel) // good practice to return what was created
        } catch (error) {
            console.log("Error creating hotel: ", error)
            res.status(500).json({
                message: "Something went wrong"
            })
        }
    })

router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({
            userId: req.userId
        })

        res.json(hotels)
    } catch (error) {
        console.log("")
        res.status(500).json({
            message: "Error fetching Hotels"
        })
    }
})

router.get("/:hotelId", verifyToken, async (req: Request, res: Response) => {
    const id = req.params.hotelId.toString()

    try {
        const hotel = await Hotel.findOne({
            _id: id,
            userId: req.userId
        })
        res.json(hotel)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error Fetching hotels" })
    }
})

router.put("/:hotelId",
    verifyToken,
    upload.array("imageFiles"), // LEARN : how is imageFiles read from formData that I created in the ManageHotelForm
    async (req: Request, res: Response) => {
        try {
            const updatedHotel: HotelType = req.body

            updatedHotel.lastUpdated = new Date()

            const hotel = await Hotel.findOneAndUpdate({
                _id: req.params.hotelId,
                userId: req.userId
            }, updatedHotel, { new: true })

            if(!hotel) {
                return res.status(404).json({
                    message: "Hotel not found"
                })
            }

            // new files that user has decided to upload
            const files = req.files as Express.Multer.File[] // learn how multer works

            const updatedImageUrls = await uploadImages(files)

            hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])]

            await hotel.save()

            res.status(201).json(hotel)

        } catch (error) {
            console.log("Something went wrong", error)
            res.status(500).json({
                message: "Something went wrong"
            })
        }
    })

export default router

async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;

        const res = await cloudinary.v2.uploader.upload(dataURI);

        return res.url;
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}
 