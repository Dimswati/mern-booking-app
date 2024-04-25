import * as apiClient from "../api-client"
import { useMutation, useQueryClient } from 'react-query'
import { useAppContext } from "../contexts/AppContext"
import { useNavigate } from "react-router-dom";

const SignOutButton = () => {

    const queryClient = useQueryClient()

    const { showToast } = useAppContext()
    const navigate = useNavigate()

    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async() => {
            // invalidate query
            await queryClient.invalidateQueries("validateToken")
            showToast({
                message: "Signed Out!",
                type: "SUCCESS"
            }),
            navigate("/login")
        },
        // I catch the error that I throw from apiClient.signOut
        onError: (error: Error) => {
            showToast({
                message: error.message,
                type: "ERROR"
            })
        }
    })

    const handleClick = () => mutation.mutate()

    return (
        <button className='text-blue-600 px-2 font-bold bg-white hover:bg-gray-100' onClick={handleClick}>
            Sign out
        </button>
    )
}

export default SignOutButton