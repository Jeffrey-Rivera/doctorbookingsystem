// controllers/resumeController.js
import Resume from '../models/resumeModel.js';
import { v2 as cloudinary } from 'cloudinary';

export const uploadResume = async (req, res) => {
    try {
        console.log("Uploaded file data:", req.file);

        const { jobTitle } = req.body;
        const file = req.file?.path;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(file, {
            folder: "resumes",
            resource_type: "auto"
        });

        if (!uploadResult || !uploadResult.secure_url) {
            return res.status(500).json({ message: "Cloudinary upload failed" });
        }

        // Save resume info to MongoDB
        const newResume = new Resume({
            jobTitle,
            resumeUrl: uploadResult.secure_url,
            uploadDate: new Date(),
        });

        await newResume.save();
        res.status(201).json({ message: "Resume uploaded successfully", resume: newResume });
    } catch (error) {
        console.error("Upload error:", error); 
        res.status(500).json({ message: "Failed to upload resume", error: error.message });
    }
};

// Adding the getAllResumes function
export const getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find(); // Fetch all resumes
        res.status(200).json(resumes);
    } catch (error) {
        console.error("Error fetching resumes:", error);
        res.status(500).json({ message: "Failed to fetch resumes", error: error.message });
    }
};
