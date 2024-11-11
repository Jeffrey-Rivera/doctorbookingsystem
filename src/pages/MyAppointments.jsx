import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import stripePromise from '../utils/stripe';

const MyAppointments = () => {
    const { backendUrl, token, getDoctorsData } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);
    const [searchParams] = useSearchParams(); // Capture query parameters

    const months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_');
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
    };

    const getUserAppointments = async () => {
        if (!token) return;
        try {
            console.log("Fetching user appointments...");
            const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } });
            if (data.success) {
                setAppointments(data.appointments.reverse());
                console.log("Appointments fetched:", data.appointments);
            } else {
                toast.error('Failed to fetch appointments');
            }
        } catch (error) {
            console.log("Error fetching appointments:", error);
            toast.error(error.message);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                getUserAppointments();
                getDoctorsData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error cancelling appointment:", error);
            toast.error(error.message);
        }
    };

    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/payment-stripe`, { appointmentId }, { headers: { token } });
            if (data.success) {
                const stripe = await stripePromise;
                await stripe.redirectToCheckout({ sessionId: data.sessionId });
            } else {
                console.error('Payment failed:', data.message);
            }
        } catch (error) {
            console.error('Error during payment:', error.message);
        }
    };

    // Verify payment on load if there's a session_id in the URL
    useEffect(() => {
        const sessionId = searchParams.get('session_id'); // Get session_id from URL
        if (sessionId) {
            console.log("Verifying payment with session ID:", sessionId);
            verifyPayment(sessionId);
        }
    }, [searchParams]);

    const verifyPayment = async (sessionId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/verify-stripe`, { sessionId }, { headers: { token } });
            if (data.success) {
                getUserAppointments(); // Refresh appointments to reflect payment status
            } else {
                toast.error('Payment verification failed');
            }
        } catch (error) {
            console.error('Error verifying payment:', error.message);
        }
    };

    // Fetch appointments when the token is available
    useEffect(() => {
        if (token) {
            console.log("Token available, fetching appointments...");
            getUserAppointments();
        }
    }, [token]);

    return (
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-800 border-b'>My Appointments:</p>
            <div>
                {appointments.map((item, index) => (
                    <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
                        <div>
                            <img className='w-32 bg-pink-100' src={item.docData.image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-zinc-600'>
                            <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className='text-neutral-800 font-medium mt-1'>Address</p>
                            <p className='text-xs'>{item.docData.address.line1}</p>
                            <p className='text-xs'>{item.docData.address.line2}</p>
                            <p className='text-xs mt-1'><span className='text-sm text-neutral-800 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end'>
                            {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
                            {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => appointmentStripe(item._id)} className='text-sm text-stone-600 text-center sm:min-w-48 py-2 border hover:bg-pink-200 hover:text-white transition-all duration-500'>Pay Online</button>}
                            {!item.cancelled && !item.payment && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-600 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-500'>Cancel My Appointment</button>}
                            {item.cancelled && !item.payment && <button className='sm:min-w-48 py-3 border border-red-600 rounded text-red-500'>Appointment Cancelled</button>}
                            {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-400 rounded text-green-400'>Completed</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyAppointments;
