// controllers/resumeController.js
import Resume from '../models/resumeModel.js';
import { v2 as cloudinary } from 'cloudinary';

export const uploadResume = async (req, res) => {
    try {
        console.log("Request received in uploadResume controller...");
        console.log("Uploaded file data:", req.file);
        console.log("Request body:", req.body);

        const { jobTitle } = req.body;
        const file = req.file?.path;

        if (!file) {
            console.error("No file uploaded");
            return res.status(400).json({ message: "No file uploaded" });
        }

        console.log("Uploading file to Cloudinary...");
        const uploadResult = await cloudinary.uploader.upload(file, {
            folder: "resumes",
            resource_type: "auto",
        });
        console.log("Cloudinary upload result:", uploadResult);

        if (!uploadResult || !uploadResult.secure_url) {
            console.error("Cloudinary upload failed");
            return res.status(500).json({ message: "Cloudinary upload failed" });
        }

        console.log("Saving resume to MongoDB...");
        const newResume = new Resume({
            jobTitle,
            resumeUrl: uploadResult.secure_url,
            uploadDate: new Date(),
        });

        await newResume.save();
        console.log("Resume saved:", newResume);

        res.status(201).json({ message: "Resume uploaded successfully", resume: newResume });
    } catch (error) {
        console.error("Error in uploadResume controller:", error.message);
        res.status(500).json({ message: "Failed to upload resume", error: error.message });
    }
};

export const getAllResumes = async (req, res) => {
    try {
        console.log("Fetching all resumes...");
        const resumes = await Resume.find();
        console.log("Resumes fetched successfully:", resumes);

        res.status(200).json(resumes);
    } catch (error) {
        console.error("Error fetching resumes:", error);
        res.status(500).json({ message: "Failed to fetch resumes", error: error.message });
    }
};

