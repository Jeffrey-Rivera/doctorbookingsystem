import React from 'react'
import { Link } from 'react-router-dom'  // Import Link for navigation
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-2 flex flex-col md:flex-row gap-10'>
        <img className='w-full md:max-w-[369px]' src={assets.about_image} alt="Healthcare Technology" />
        <div className='flex flex-col justify-center gap-4 md:w-2/4 text-sm text-gray-500 text-justify'>
          <p>Welcome to <b>Doctor Booking</b> – the innovative platform that connects patients with healthcare professionals through modern technology, making it easier to schedule appointments anytime, anywhere.</p>
          <p>We aim to streamline healthcare services by providing a seamless experience for users, eliminating long wait times, and enabling quick access to trusted doctors and specialists.</p>

          <b className='text-gray-500'>Our Mission</b>
          <p>Our mission is to revolutionize healthcare accessibility by leveraging technology to simplify the process of finding and booking medical appointments. We strive to provide a user-friendly platform that saves time, improves efficiency, and enhances the patient experience.</p>

          <b className='text-gray-500'>Our Vision</b>
          <p>Our vision is to be the leading platform in healthcare technology, empowering individuals to make informed healthcare decisions and providing them with the tools to connect with the best medical professionals in their area. We aim to create a world where healthcare services are just a click away.</p>
        </div>
      </div>

      <div className='text-center text-2xl my-6 mt-12'>
        <p>Why <span className='text-gray-500 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-6 md:px-12 py-6 sm:py-6 flex flex-col gap-5 text-[14px] hover:bg-pink-200 hover:text-white transition-all duration-300 text-gray-500 cursor-pointer'>
          <b>Experience</b>
          <p className='text-justify'>With years of experience in healthcare and technology, our team is committed to providing an efficient, reliable, and secure platform. Our seamless interface makes booking healthcare appointments easy for anyone, anywhere.</p>
          <Link to='/doctors'>
            <button className='mt-4 px-4 py-2 bg-pink-300 text-white rounded hover:bg-pink-400 transition-all'>Visit Our Doctors</button></Link>
        </div>
        <div className='border px-6 md:px-12 py-6 sm:py-6 flex flex-col gap-5 text-[14px] hover:bg-pink-200 hover:text-white transition-all duration-300 text-gray-500 cursor-pointer'>
          <b>Location</b>
          <p className='text-justify'>We offer our services across a wide network of healthcare providers in multiple locations, ensuring that you can access the best doctors near you. Our platform connects you with professionals in your area for convenient in-person or virtual consultations.</p>

          {/* Button to Open Google Maps */}
          <a href='https://www.google.com/maps?q=4448+Front+St+SE,+Calgary,+AB+T3M+1M4' target='_blank' rel='noopener noreferrer'>
            <button className='mt-4 px-4 py-2 bg-pink-300 text-white rounded hover:bg-pink-400 transition-all'>Visit Our Location</button>
          </a>
        </div>
        <div className='border px-6 md:px-12 py-6 sm:py-6 flex flex-col gap-5 text-[14px] hover:bg-pink-200 hover:text-white transition-all duration-300 text-gray-500 cursor-pointer'>
          <b>Community</b>
          <p className='text-justify'>We are committed to building a strong, supportive community for patients and healthcare professionals. By creating an ecosystem that fosters trust and collaboration, we ensure the best possible healthcare experience for everyone.</p>

          {/* Anchor link to navigate to the main page */}
          <a href="/">
            <button className='mt-4 px-4 py-2 bg-pink-300 text-white rounded hover:bg-pink-400 transition-all'>
              Join Our Community
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default About
