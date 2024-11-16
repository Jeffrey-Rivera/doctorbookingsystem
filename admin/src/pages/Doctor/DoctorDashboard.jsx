import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import appointmentsIcon from '../../assets/appointments_icon.svg';
import patientsIcon from '../../assets/patients_icon.svg';
import listIcon from '../../assets/list_icon.svg';
import { AppContext } from '../../context/AppContext';
import cancelIcon from '../../assets/cancel_icon.svg';
import tickIcon from '../../assets/tick_icon.svg';
import '@fortawesome/fontawesome-free/css/all.min.css';

const DoctorDashboard = () => {
  const { dToken, dashData, setDashData, getDashData, completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return dashData && (
    <div className='m-5'>
      {/* Dashboard Cards - Use grid layout here */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-24 mb-10">
        {/* Earnings Card with Pay Cheque Icon */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer">
          <i className="fas fa-money-check-alt text-primary text-3xl"></i> {/* Pay Cheque Icon */}
          <div>
            <p className="text-xl font-semibold text-gray-600">{currency} {dashData.earnings}</p>
            <p className="text-gray-400">Earnings</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer">
          <i className="fas fa-calendar-check text-primary text-3xl"></i>
          <div>
            <p className="text-xl font-bold text-gray-800">{dashData.appointments}</p>
            <p className="text-gray-500">Appointments</p>
          </div>
        </div>

        {/* Patients Card */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer">
          <i className="fas fa-users text-primary text-3xl"></i>
          <div>
            <p className="text-xl font-bold text-gray-800">{dashData.patients}</p>
            <p className="text-gray-500">Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className="mt-10 bg-white rounded-lg shadow-md">
        <div className="flex items-center gap-3 px-6 py-4 bg-gray-100 rounded-t-lg border-b">
          {/* Replaced the img tag with a Font Awesome icon */}
          <i className="fas fa-list text-primary text-4xl"></i>
          <p className="font-semibold text-gray-800">Latest Bookings</p>
        </div>
        <div className="divide-y">
          {dashData.latestAppointments.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-6 px-8 py-5 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-gray-100 transition`}
            >
              {/* Larger Photo */}
              <img
                className="rounded-full w-14 h-14 object-cover"
                src={item.userData.image} // or item.docData.image based on the available data
                alt={`${item.userData.name}'s profile`} // or item.docData.name based on the available data
              />

              {/* Larger Name and Date */}
              <div className="flex-1 text-base">
                <p className="font-semibold text-gray-800 text-med">{item.userData.name}</p>
                <p className="text-gray-600 text-sm">{slotDateFormat(item.slotDate)}</p>
              </div>

              {/* Larger Cancel/Status Button */}
              {item.cancelled ? (
                <span className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-full">
                  Cancelled
                </span>
              ) : item.isCompleted ? (
                <span className="px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-full">
                  Completed
                </span>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="transition"
                  >
                    <img
                      className="w-10 h-10 text-red-500 hover:text-red-700 transition"
                      src={cancelIcon}
                      alt="Cancel Appointment"
                    />
                  </button>
                  <button
                    onClick={() => completeAppointment(item._id)}
                    className="transition"
                  >
                    <img
                      className="w-10 h-10 text-green-500 hover:text-green-700 transition"
                      src={tickIcon}
                      alt="Complete Appointment"
                    />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DoctorDashboard;
