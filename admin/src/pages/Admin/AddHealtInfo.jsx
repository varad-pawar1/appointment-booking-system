import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const AddHealthInfo = () => {
    const location = useLocation();
    const existingData = location.state?.healthData || null; // Get data if updating

    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [speciality, setSpeciality] = useState('General physician');
    const { backendUrl } = useContext(AppContext);
    const { aToken } = useContext(AdminContext);

    const updateMode = !!existingData; // Check if we are updating

    // Pre-fill form if updating
    useEffect(() => {
        if (updateMode) {
            setName(existingData.name);
            setAbout(existingData.about);
            setSpeciality(existingData.speciality);
            setDocImg(existingData.image);
        }
    }, [existingData]);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (!docImg) {
                return toast.error('Image Not Selected');
            }

            const formData = new FormData();
            formData.append('image', docImg);
            formData.append('name', name);
            formData.append('about', about);
            formData.append('speciality', speciality);

            let response;
            if (updateMode) {
                // Updating existing health info
                formData.append('_id', existingData._id);
                response = await axios.put(`${backendUrl}/api/admin/update-healtInfo/${existingData._id}`, formData, {
                    headers: { aToken }
                });
            } else {
                // Adding new health info
                response = await axios.post(`${backendUrl}/api/admin/add-healtInfo`, formData, {
                    headers: { aToken }
                });
            }

            if (response.data.success) {
                toast.success(response.data.message);
                setDocImg(false)
                setName('')
                setAbout('')
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>{updateMode ? 'Update' : 'Add'} Health Info</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer'
                            src={docImg ? (typeof docImg === 'string' ? docImg : URL.createObjectURL(docImg)) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                    <p>Upload Disease<br /> Picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" required />
                        </div>
                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='border rounded px-2 py-2'>
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <p className='mt-4 mb-2'>About Disease</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='Write about HealthInfo'></textarea>
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>
                    {updateMode ? 'Update' : 'Add'} Disease
                </button>
            </div>
        </form>
    );
};

export default AddHealthInfo;
