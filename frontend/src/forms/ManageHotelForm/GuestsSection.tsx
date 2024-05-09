
import { useFormContext } from 'react-hook-form'
import { HotelFormData } from './ManageHotelForm'

const GuestsSection = () => {

    const { register, formState: { errors } } = useFormContext<HotelFormData>()

    return (
        <div>
            <h2 className='text-2xl font-bold mb-3'>Guests</h2>
            <div className='grid grid-cols-2 gap-5 bg-gray-300 p-6'>
                <label htmlFor="adults" className='text-gray-700 text-sm font-semibold'>
                    Adults
                    <input id="adults" type="number" {...register("adultCount", { required: "Atleast one adult"})} min={1} className='border rounded w-full py-2 px-3 font-normal'/>
                    {errors.adultCount?.message && (
                        <span className='text-red-500 text-sm font-bold'>
                            {errors.adultCount.message}
                        </span>
                    )}
                </label>

                
                <label htmlFor="children" className='text-gray-700 text-sm font-semibold'>
                    Children
                    <input id="children" type="number" {...register("childCount", { required: "This field is required"})} min={0} className='border rounded w-full py-2 px-3 font-normal'/>
                    {errors.childCount?.message && (
                        <span className='text-red-500 text-sm font-bold'>
                            {errors.childCount.message}
                        </span>
                    )}
                </label>
            </div>
        </div>
    )
}

export default GuestsSection