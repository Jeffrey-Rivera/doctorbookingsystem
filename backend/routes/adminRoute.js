import express from 'express';
import { addDoctor, allDoctors, loginAdmin } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';

const adminRouter = express.Router()
//middleware process this image and form data
adminRouter.post('/add-doctor',authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)

export default adminRouter