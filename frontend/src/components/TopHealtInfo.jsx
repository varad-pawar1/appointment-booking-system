import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'


const TopHealtInfo = () => {

    const navigate = useNavigate()

    const { healtInfo } = useContext(AppContext)

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10'>
            <h1 className='text-3xl font-medium'>HealtInfo</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted HealtInfo.</p>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {healtInfo.slice(0, 10).map((item, index) => (
                    <div
                        className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
                        key={index}>
                        <img className="bg-[#EAEFFF] w-full object-cover" src={item.image} alt="" />
                        <div className='p-4'>
                            <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                            <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
                            <p className='text-[#5C5C5C] text-sm line-clamp-5 overflow-hidden text-ellipsis'>
                                {item.about}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
                className='bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10'
            >
                more
            </button>
        </div>
    )
}

export default TopHealtInfo
