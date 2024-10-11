import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div>
            <div>
                {/* ---Left side--- */}
                <div>
                    <img src={assets.logo} alt="" />
                    <p>About here</p>
                </div>

                {/* ---Center side--- */}
                <div>
                    <p>COMPANY</p>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>

                {/* ---Right side--- */}
                <div>
                    <p>GET IN TOUCH</p>
                    <ul>
                        <li>+1 587 1234567</li>
                        <li>doctorbooking@gmail.com</li>
                    </ul>
                </div>
            </div>

            {/* ---Right side--- */}
            <div>
                <hr />
                <p>Copyright 2024@ DoctorBooking - All Right Reserved.</p>
            </div>
        </div>
    )
}

export default Footer