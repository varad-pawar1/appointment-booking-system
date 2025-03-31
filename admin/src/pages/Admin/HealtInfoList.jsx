import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const HealthInfoList = () => {
  const { healtInfo, aToken, getAllHealtInfo, deleteHealtInfo } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (aToken) {
      getAllHealtInfo();
    }
  }, [aToken]);

  const handleUpdate = (item) => {
    navigate('/add-health-info', { state: { healthData: item } });
  };

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Health Info</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {healtInfo.map((item, index) => (
          <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <img className='bg-[#EAEFFF] h-[250px] object-contain transition-all duration-500' src={item.image} alt="" />
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              <button
                className='mt-2 mr-2 text-white hover:text-blue-700 bg-primary p-1'
                onClick={() => handleUpdate(item)}
              >
                Update
              </button>
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
  );
};

export default HealthInfoList;
