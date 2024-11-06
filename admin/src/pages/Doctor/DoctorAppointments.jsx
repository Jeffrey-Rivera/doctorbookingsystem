import React, { useEffect, useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'

export const DoctorAppointments = () => {

  const {dToken, appointments, getAppointments} = useContext(DoctorContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div>DoctorAppointments</div>
  )
}


export default DoctorAppointments