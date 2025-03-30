import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const HealtInfoList = () => {

  const { healtInfo, aToken, getAllHealtInfo, deleteHealtInfo } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllHealtInfo()
    }
  }, [aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All HealtInfo</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {healtInfo.map((item, index) => (
          <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <img className='bg-[#EAEFFF] h-[250px] object-contine transition-all duration-500' src={item.image} alt="" />
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              {/* Delete Button */}
              <button
                className='mt-2 text-white hover:text-red-700 bg-primary p-1'
                onClick={() => deleteHealtInfo(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HealtInfoList
