
import healtInfoModel from "../models/healtInfoModels.js";

// API to get all healtInfo list for Frontend
const healtInfoList = async (req, res) => {
    try {
        const healtInfo = await healtInfoModel.find({}).select(['-password', '-email'])
        res.json({ success: true, healtInfo })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    healtInfoList
}