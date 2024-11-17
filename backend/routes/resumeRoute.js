import express from 'express';
import multer from 'multer';
import { uploadResume, getAllResumes } from '../controllers/resumeController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', (req, res, next) => {
    console.log("POST /upload route hit");
    next();
}, upload.single('resume'), uploadResume);

router.get('/all', (req, res) => {
    console.log("GET /all route hit");
    getAllResumes(req, res);
});

export default router;
