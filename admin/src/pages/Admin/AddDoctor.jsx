import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AddDoctor = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const existingDoctor = location.state?.doctor || null;

    const [docImg, setDocImg] = useState(null);
    const [name, setName] = useState(existingDoctor?.name || '');
    const [email, setEmail] = useState(existingDoctor?.email || '');
    const [password, setPassword] = useState('');
    const [experience, setExperience] = useState(existingDoctor?.experience || '1 Year');
    const [fees, setFees] = useState(existingDoctor?.fees || '');
    const [about, setAbout] = useState(existingDoctor?.about || '');
    const [speciality, setSpeciality] = useState(existingDoctor?.speciality || 'General physician');
    const [degree, setDegree] = useState(existingDoctor?.degree || '');
    const [address1, setAddress1] = useState(existingDoctor?.address?.line1 || '');
    const [address2, setAddress2] = useState(existingDoctor?.address?.line2 || '');

    const { backendUrl } = useContext(AppContext);
    const { aToken } = useContext(AdminContext);

    useEffect(() => {
        if (existingDoctor) {
            setName(existingDoctor.name);
            setEmail(existingDoctor.email);
            setExperience(existingDoctor.experience);
            setFees(existingDoctor.fees);
            setAbout(existingDoctor.about);
            setSpeciality(existingDoctor.speciality);
            setDegree(existingDoctor.degree);
            setAddress1(existingDoctor.address?.line1 || '');
            setAddress2(existingDoctor.address?.line2 || '');
        }
    }, [existingDoctor]);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (!docImg && !existingDoctor) {
                return toast.error('Image Not Selected');
            }

            const formData = new FormData();
            if (docImg) formData.append('image', docImg);
            formData.append('name', name);
            formData.append('email', email);
            if (!existingDoctor) formData.append('password', password);
            formData.append('experience', experience);
            formData.append('fees', Number(fees));
            formData.append('about', about);
            formData.append('speciality', speciality);
            formData.append('degree', degree);
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

            let response;
            if (existingDoctor) {
                response = await axios.put(`${backendUrl}/api/admin/update-doctor/${existingDoctor._id}`, formData, {
                    headers: { aToken },
                });
            } else {
                response = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
                    headers: { aToken },
                });
            }

            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/doctor-list');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>{existingDoctor ? 'Update Doctor' : 'Add Doctor'}</p>
            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor='doc-img'>
                        <img
                            className='w-16 bg-gray-100 rounded-full cursor-pointer'
                            src={docImg ? URL.createObjectURL(docImg) : existingDoctor?.image || assets.upload_area}
                            alt='Doctor'
                        />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type='file' id='doc-img' hidden />
                    <p>Upload doctor picture</p>
                </div>
                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <input value={name} onChange={(e) => setName(e.target.value)} className='border rounded px-3 py-2' type='text' placeholder='Name' required />
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className='border rounded px-3 py-2' type='email' placeholder='Email' required />
                        {!existingDoctor && (
                            <input value={password} onChange={(e) => setPassword(e.target.value)} className='border rounded px-3 py-2' type='password' placeholder='Password' required />
                        )}
                        <select value={experience} onChange={(e) => setExperience(e.target.value)} className='border rounded px-2 py-2'>
                            {[...Array(10).keys()].map(year => <option key={year} value={`${year + 1} Year`}>{year + 1} Year</option>)}
                        </select>
                        <input value={fees} onChange={(e) => setFees(e.target.value)} className='border rounded px-3 py-2' type='number' placeholder='Doctor fees' required />
                    </div>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <select value={speciality} onChange={(e) => setSpeciality(e.target.value)} className='border rounded px-2 py-2'>
                            {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'].map(spec => <option key={spec} value={spec}>{spec}</option>)}
                        </select>
                        <input value={degree} onChange={(e) => setDegree(e.target.value)} className='border rounded px-3 py-2' type='text' placeholder='Degree' required />
                        <input value={address1} onChange={(e) => setAddress1(e.target.value)} className='border rounded px-3 py-2' type='text' placeholder='Address 1' required />
                        <input value={address2} onChange={(e) => setAddress2(e.target.value)} className='border rounded px-3 py-2' type='text' placeholder='Address 2' required />
                    </div>
                </div>
                <textarea value={about} onChange={(e) => setAbout(e.target.value)} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='Write about doctor'></textarea>
                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>{existingDoctor ? 'Update' : 'Add'} Doctor</button>
            </div>
        </form>
    );
};

export default AddDoctor;

