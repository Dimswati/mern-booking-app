import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import * as apiClient from "../api-client"
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm"


const EditHotel = () => {

    const { hotelId } = useParams()

    const { data: hotel, isLoading } = useQuery("fetchMyHotelById", () => apiClient.fetchMyHotelById(hotelId || ''), {
        enabled: !!hotelId
    })

    return (
        <ManageHotelForm hotel={hotel} onSave={() =>{}} isLoading={isLoading}/>
    )
}

export default EditHotel