import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminCareers = () => {
    const [resumes, setResumes] = useState([]); // Initialize resumes as an empty array

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/resumes/all'); // Explicit backend URL
                console.log("Fetched resumes:", response.data);

                if (Array.isArray(response.data)) {
                    setResumes(response.data);
                } else {
                    console.error("Unexpected API response format:", response.data);
                    setResumes([]);
                }
            } catch (error) {
                console.error("Failed to fetch resumes", error);
                setResumes([]);
            }
        };

        fetchResumes();
    }, []);

    console.log("Rendering AdminCareers with resumes:", resumes);

    return (
        <div className="p-8 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Job Applications</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 bg-white rounded-lg">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="border border-gray-300 p-4 text-left font-semibold">Job Title</th>
                            <th className="border border-gray-300 p-4 text-left font-semibold">Upload Date</th>
                            <th className="border border-gray-300 p-4 text-left font-semibold">Resume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(resumes) && resumes.length > 0 ? (
                            resumes.map((resume, index) => (
                                <tr
                                    key={resume._id}
                                    className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        }`}
                                >
                                    <td className="border border-gray-300 p-4 text-gray-700">
                                        {resume.jobTitle}
                                    </td>
                                    <td className="border border-gray-300 p-4 text-gray-700">
                                        {new Date(resume.uploadDate).toLocaleDateString()}
                                    </td>
                                    <td className="border border-gray-300 p-4">
                                        <a
                                            href={resume.resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                            Download
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="border border-gray-300 p-4 text-center text-gray-500"
                                >
                                    No resumes available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default AdminCareers;
