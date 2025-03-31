import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const DoctorsList = () => {
  const { doctors, changeAvailability, deleteDoctor, aToken, getAllDoctors } = useContext(AdminContext);
  const navigate = useNavigate();

  console.log(doctors);
  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const handleUpdate = (doctor) => {
    navigate('/add-doctor', { state: { doctor } }); // Send doctor data to AddDoctor
  };

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((doctor, index) => (
          <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500' src={doctor.image} alt={doctor.name} />
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{doctor.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{doctor.speciality}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input onChange={() => changeAvailability(doctor._id)} type="checkbox" checked={doctor.available} />
                <p>Available</p>
              </div>
              <button
                className='mt-2 mr-2 text-white hover:text-blue-700 bg-primary p-1'
                onClick={() => handleUpdate(doctor)}
              >
                Update
              </button>
              <button
                onClick={() => deleteDoctor(doctor._id)}
                className='mt-2 text-white hover:text-red-700 bg-primary p-1'
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

export default DoctorsList;
