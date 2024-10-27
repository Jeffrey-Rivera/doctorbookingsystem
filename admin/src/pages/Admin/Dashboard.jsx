import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import doctorIcon from '../../assets/doctor_icon.svg'
import appointmentsIcon from '../../assets/appointments_icon.svg'
import patientsIcon from '../../assets/patients_icon.svg'


const Dashboard = () => {

  const {aToken,getDashData, cancelAppointment, dashData} = useContext(AdminContext)

  useEffect(() =>{
    if (aToken) {
      getDashData()
      
    }

  },[aToken])

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3 '>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all '>
          <img src={doctorIcon} alt='' />
          <div>
            <p>{dashData.doctors}</p>
            <p>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all '>
          <img src={appointmentsIcon} alt='' />
          <div>
            <p>{dashData.appointments}</p>
            <p>Appointment</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all '>
          <img src={patientsIcon} alt='' />
          <div>
            <p>{dashData.patients}</p>
            <p>Patients</p>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Dashboard