import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { assets } from '../assets/assets'
import axios from 'axios';

const Careers = () => {
    const [selectedJob, setSelectedJob] = useState(null);

    const handleApplyClick = (jobTitle) => {
        setSelectedJob(jobTitle);
        document.getElementById(`resume-upload-${jobTitle}`).click(); // Trigger the file input click
    };

    const handleFileUpload = async (event, jobTitle) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type === 'application/pdf') {
                const formData = new FormData();
                formData.append('resume', file); // Attach the file
                formData.append('jobTitle', jobTitle); // Add the job title
    
                try {
                    console.log("Uploading file to /api/resumes/upload...");
                    const response = await axios.post('http://localhost:4000/api/resumes/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    console.log("Upload successful:", response.data);
                    toast.success(response.data.message || "PDF successfully submitted!");
                } catch (error) {
                    console.error("Upload error details:", error.response || error);
                    toast.error(error.response?.data?.message || "Failed to upload PDF.");
                }
            } else {
                toast.error("Please upload a PDF file.");
            }
        }
    };
    
    


    return (
        <div>
            <ToastContainer />

            {/* Available Positions Section */}
            <div className='text-center text-xl my-6'>
                <p>CURRENT <span className='text-gray-500 font-semibold'>OPENINGS</span></p>
            </div>

            <div className='flex flex-col gap-8 mb-12 px-4 md:px-16'>
                {/* Job Opening 1 */}
                <div className='border p-6 shadow-md rounded-lg flex justify-between items-center'>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-700'>Dermatologist</h3>
                        <p className='text-gray-500 mt-2'>Experience: 3+ years</p>
                        <p className='text-gray-500'>Annual Salary: $100,000 - $120,000</p>
                    </div>
                    <button
                        className='bg-pink-300 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-pink-400 transition duration-300'
                        onClick={() => handleApplyClick('Dermatologist')}
                    >
                        Apply
                    </button>
                    <input
                        type="file"
                        id="resume-upload-Dermatologist"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(e, 'Dermatologist')}
                    />
                </div>

                {/* Job Opening 2 */}
                <div className='border p-6 shadow-md rounded-lg flex justify-between items-center'>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-700'>Gynecologist</h3>
                        <p className='text-gray-500 mt-2'>Experience: 5+ years</p>
                        <p className='text-gray-500'>Annual Salary: $120,000 - $140,000</p>
                    </div>
                    <button
                        className='bg-pink-300 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-pink-400 transition duration-300'
                        onClick={() => handleApplyClick('Gynecologist')}
                    >
                        Apply
                    </button>
                    <input
                        type="file"
                        id="resume-upload-Gynecologist"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(e, 'Gynecologist')}
                    />
                </div>

                {/* Job Opening 3 */}
                <div className='border p-6 shadow-md rounded-lg flex justify-between items-center'>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-700'>Gastroenterologist</h3>
                        <p className='text-gray-500 mt-2'>Experience: 7+ years</p>
                        <p className='text-gray-500'>Annual Salary: $160,000 - $180,000</p>
                    </div>
                    <button
                        className='bg-pink-300 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-pink-400 transition duration-300'
                        onClick={() => handleApplyClick('Gastroenterologist')}
                    >
                        Apply
                    </button>
                    <input
                        type="file"
                        id="resume-upload-Gastroenterologist"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(e, 'Gastroenterologist')}
                    />
                </div>

                {/* Job Opening 4 */}
                <div className='border p-6 shadow-md rounded-lg flex justify-between items-center'>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-700'>Pediatrician</h3>
                        <p className='text-gray-500 mt-2'>Experience: 4+ years</p>
                        <p className='text-gray-500'>Annual Salary: $120,000 - $140,000</p>
                    </div>
                    <button
                        className='bg-pink-300 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-pink-400 transition duration-300'
                        onClick={() => handleApplyClick('Pediatrician')}
                    >
                        Apply
                    </button>
                    <input
                        type="file"
                        id="resume-upload-Pediatrician"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(e, 'Pediatrician')}
                    />
                </div>

                {/* Job Opening 5 */}
                <div className='border p-6 shadow-md rounded-lg flex justify-between items-center'>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-700'>Neurologist</h3>
                        <p className='text-gray-500 mt-2'>Experience: 5+ years</p>
                        <p className='text-gray-500'>Annual Salary: $150,000 - $170,000</p>
                    </div>
                    <button
                        className='bg-pink-300 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-pink-400 transition duration-300'
                        onClick={() => handleApplyClick('Neurologist')}
                    >
                        Apply
                    </button>
                    <input
                        type="file"
                        id="resume-upload-Neurologist"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(e, 'Neurologist')}
                    />
                </div>
            </div>
        </div>
    )
}

export default Careers
