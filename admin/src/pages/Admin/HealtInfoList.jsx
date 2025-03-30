import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const HealtInfoList = () => {

  const { healtInfo, aToken, getAllHealtInfo } = useContext(AdminContext)

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
            <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              {/* <p className='text-[#5C5C5C] text-sm'>{item.about}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HealtInfoList