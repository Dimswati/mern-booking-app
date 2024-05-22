import { useAppContext } from "../contexts/AppContext"
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm"
import { useMutation } from "react-query"

import * as apiClient from "../api-client"

const AddHotel = () => {

    const { showToast } = useAppContext()

    const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
        onSuccess: () => {
            showToast({
                message: "Hotel Saved",
                type: "SUCCESS"
            })
        },
        onError: () => {
            showToast({
                message: "Failed to Save",
                type: "ERROR"
            })
        }
    })

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData)
    }

    return (
        <ManageHotelForm onSave={handleSave} isLoading={isLoading}/>
    )
}

export default AddHotel