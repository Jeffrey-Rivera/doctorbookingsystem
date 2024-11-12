// routes/resumeRoute.js
import express from 'express';
import multer from 'multer';
import { uploadResume, getAllResumes } from '../controllers/resumeController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/all', getAllResumes);  // Ensure this route is set correctly

export default router;
