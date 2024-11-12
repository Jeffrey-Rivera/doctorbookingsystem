// models/resumeModel.js
import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    jobTitle: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    resumeUrl: { type: String, required: true }
});

export default mongoose.model('Resume', resumeSchema);
