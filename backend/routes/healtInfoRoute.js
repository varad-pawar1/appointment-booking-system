import express from 'express';
import { healtInfoList } from '../controllers/healtInfoController.js';
const healtInfoRouter = express.Router();

healtInfoRouter.get("/list", healtInfoList);

export default healtInfoRouter;