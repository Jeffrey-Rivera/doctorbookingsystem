import express from 'express';
import { addDoctor } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js';

const adminRouter = express.Router()
//middleware process this image and form data
adminRouter.post('/add-doctor', upload.single('image'), addDoctor)

export default adminRouter