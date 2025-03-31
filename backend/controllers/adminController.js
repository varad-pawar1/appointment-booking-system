import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import healtInfoModel from "../models/healtInfoModels.js";

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addDoctor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: 'Doctor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


const deleteDoctor = async (req, res) => {
    const { id } = req.params;

    try {
        // Assuming your model is named DoctorModel
        const result = await doctorModel.findByIdAndDelete(id);

        if (result) {
            res.json({ success: true, message: "Doctor deleted successfully." });
        } else {
            res.json({ success: false, message: "Doctor not found." });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        let image = req.body.image;

        // Find existing doctor
        const existingDoctor = await doctorModel.findById(id);
        if (!existingDoctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Handle password update if provided
        let hashedPassword = existingDoctor.password;
        if (password && password.length >= 8) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // Handle image update if a new file is uploaded
        if (req.file) {
            // Delete old image from Cloudinary
            const oldImageUrl = existingDoctor.image;
            if (oldImageUrl) {
                const publicId = oldImageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }

            // Upload new image to Cloudinary
            const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
            image = imageUpload.secure_url;
        } else {
            image = existingDoctor.image; // Keep old image if not updated
        }

        // Update the doctor record
        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            id,
            { name, email, password: hashedPassword, speciality, degree, experience, about, fees, address: JSON.parse(address), image },
            { new: true }
        );

        res.status(200).json({ success: true, message: 'Doctor updated successfully', updatedDoctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// API to add Health Info
const addHealtInfo = async (req, res) => {
    try {
        const { name, speciality, about } = req.body;
        const imageFile = req.file;

        // Check for missing details
        if (!name || !speciality || !about || !imageFile) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        // Create new HealthInfo
        const newHealtInfo = new healtInfoModel({
            name,
            image: imageUrl,
            speciality,
            about,
            date: Date.now()
        });

        await newHealtInfo.save();
        res.status(201).json({ success: true, message: 'Health Info Added', data: newHealtInfo });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to delete Health Info
const deleteHealtInfo = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the record to delete
        const healthInfo = await healtInfoModel.findById(id);
        if (!healthInfo) {
            return res.status(404).json({ success: false, message: "Health info not found." });
        }

        // Delete from Cloudinary (Optional: If you want to delete the image)
        const imageUrl = healthInfo.image;
        if (imageUrl) {
            const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID
            await cloudinary.uploader.destroy(publicId);
        }

        // Delete from Database
        await healtInfoModel.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Health info deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to update Health Info
const updateHealtInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, about, speciality } = req.body;
        let image = req.body.image;

        // Find existing Health Info
        const existingInfo = await healtInfoModel.findById(id);
        if (!existingInfo) {
            return res.status(404).json({ success: false, message: 'HealthInfo not found' });
        }

        // Handle image update if a new file is uploaded
        if (req.file) {
            // Delete old image from Cloudinary
            const oldImageUrl = existingInfo.image;
            if (oldImageUrl) {
                const publicId = oldImageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }

            // Upload new image to Cloudinary
            const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
            image = imageUpload.secure_url;
        } else {
            image = existingInfo.image; // Keep old image if not updated
        }

        // Update the HealthInfo record
        const updatedInfo = await healtInfoModel.findByIdAndUpdate(
            id,
            { name, about, speciality, image },
            { new: true }
        );

        res.status(200).json({ success: true, message: 'HealthInfo updated successfully', updatedInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};



// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}



// API to get all healtInfo list for admin panel
const allHealtInfo = async (req, res) => {
    try {

        const healtInfo = await healtInfoModel.find({}).select('-password')
        res.json({ success: true, healtInfo })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addHealtInfo,
    deleteHealtInfo,
    updateHealtInfo,
    allDoctors,
    allHealtInfo,
    adminDashboard
}