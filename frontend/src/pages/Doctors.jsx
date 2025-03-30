import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {

  const { speciality } = useParams()
  const navigate = useNavigate();

  const [filterDoc, setFilterDoc] = useState([])
  const [filterHI, setFilterHI] = useState([])
  const [showFilter, setShowFilter] = useState(false)

  const { doctors, healtInfo } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
      setFilterHI(healtInfo.filter(hi => hi.speciality === speciality))
    } else {
      setFilterDoc(doctors)
      setFilterHI(healtInfo)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality, healtInfo])

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist"
  ];

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}
        >
          Filters
        </button>

        {/* Speciality Filter */}
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {specialities.map((spec) => (
            <p
              key={spec}
              onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === spec ? 'bg-[#E2E5FF] text-black ' : ''}`}
            >
              {spec}
            </p>
          ))}
        </div>

        <div className='w-full'>
          {(speciality ? [speciality] : specialities).map((spec) => (
            <div key={spec} className='w-full grid grid-cols-auto gap-4 gap-y-6'>
              {(filterDoc.some(doc => doc.speciality === spec) || filterHI.some(hi => hi.speciality === spec)) && (
                <h2 className="text-xl font-bold text-[#262626] mb-4 col-span-full">{spec}</h2>
              )}

              {filterHI.filter(hi => hi.speciality === spec).map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 mb-4 col-span-full flex flex-col items-center justify-center w-full">

                  <img className='bg-[#EAEFFF] w-[200px] h-[200px] object-contine' src={item.image} alt="" />
                  <div className="p-4">
                    <p className="text-[#262626] text-lg font-medium">{item.name}</p>
                    <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
                    <p className="text-[#5C5C5C] text-sm">{item.about}</p>
                  </div>
                </div>
              ))}

              {filterDoc.filter(doc => doc.speciality === spec).map((item) => (
                <div
                  key={item._id}
                  onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0); }}
                  className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 mb-4"
                >
                  <img className='bg-[#EAEFFF] w-full' src={item.image} alt="" />
                  <div className="p-4">
                    <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                      <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></p>
                      <p>{item.available ? 'Available' : 'Not Available'}</p>
                    </div>
                    <p className="text-[#262626] text-lg font-medium">{item.name}</p>
                    <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}

export default Doctors
