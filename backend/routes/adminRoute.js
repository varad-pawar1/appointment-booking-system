import express from 'express';
import { loginAdmin, appointmentsAdmin, appointmentCancel, addDoctor, deleteDoctor, updateDoctor, allDoctors, adminDashboard, addHealtInfo, deleteHealtInfo, updateHealtInfo, allHealtInfo } from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/doctorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor)
adminRouter.delete("/delete-doctor/:id", authAdmin, deleteDoctor)
adminRouter.put("/update-doctor/:id", authAdmin, upload.single('image'), updateDoctor);

adminRouter.post("/add-healtInfo", authAdmin, upload.single('image'), addHealtInfo)
adminRouter.delete("/delete-healtInfo/:id", authAdmin, deleteHealtInfo)
adminRouter.put("/update-healtInfo/:id", authAdmin, upload.single('image'), updateHealtInfo);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-doctors", authAdmin, allDoctors)
adminRouter.get("/all-healtInfo", authAdmin, allHealtInfo)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)

export default adminRouter;