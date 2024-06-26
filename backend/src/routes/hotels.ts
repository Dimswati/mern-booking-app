import express, { Request, Response } from "express"
import Hotel from "../models/hotels"

const router = express.Router()

router.get("/search", async (req: Request, res: Response) => {
    try {

        const query = constructSearchQuery(req.query)

        let sortOptions = {}

        switch (req.query.sortOption) {
            case 'starRating':
                sortOptions = { starRating: -1 }
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 }
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 }
                break;
        }

        const pageSize = 5
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : '1')
        const skip = (pageNumber - 1) * pageSize

        const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize)

        const total = await Hotel.countDocuments()
        // console.log(total)

        const response = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize)
            }
        }

        return res.status(200).json(response)

    } catch (error) {
        console.log("Error: ", error)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }

    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }

    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }

    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities],
        };
    }

    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types],
        };
    }

    if (queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars)
            ? queryParams.stars.map((star: string) => parseInt(star))
            : parseInt(queryParams.stars);

        constructedQuery.starRating = { $in: starRatings };
    }

    if (queryParams.maxPrice) {
        console.log(Number(queryParams.maxPrice))

        constructedQuery.pricePerNight = {
            $lte: Number(queryParams.maxPrice) > 0 ? Number(queryParams.maxPrice) : 10000,
        };
    }

    return constructedQuery;
};

export default router