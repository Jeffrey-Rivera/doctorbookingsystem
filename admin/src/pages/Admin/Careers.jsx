import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminCareers = () => {
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const response = await axios.get('/api/resumes/all');
                console.log("Fetched resumes:", response.data);
                setResumes(response.data);
            } catch (error) {
                console.error("Failed to fetch resumes", error);
            }
        };
        fetchResumes();
    }, []);

    console.log("Rendering AdminCareers with resumes:", resumes);

    return (
        <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Job Applications</h2>
            <table className="min-w-full border-collapse border">
                <thead>
                    <tr>
                        <th className="border p-2">Job Title</th>
                        <th className="border p-2">Upload Date</th>
                        <th className="border p-2">Resume</th>
                    </tr>
                </thead>
                <tbody>
                    {resumes.length > 0 ? (
                        resumes.map((resume) => (
                            <tr key={resume._id}>
                                <td className="border p-2">{resume.jobTitle}</td>
                                <td className="border p-2">{new Date(resume.uploadDate).toLocaleDateString()}</td>
                                <td className="border p-2">
                                    <a href={resume.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Download</a>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="border p-2 text-center">No resumes available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCareers;
