import mongoose from "mongoose";

const healtInfoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    about: { type: String, required: true },
    date: { type: Number, required: true },
}, { minimize: false })

const healtInfoModel = mongoose.models.healtInfo || mongoose.model("healtInfo", healtInfoSchema);
export default healtInfoModel;