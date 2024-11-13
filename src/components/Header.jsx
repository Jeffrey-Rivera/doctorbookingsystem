import React, { useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Pagination } from 'swiper/modules'; // Removed Navigation
import '@fortawesome/fontawesome-free/css/all.min.css';
import career from "../assets/career.png";
import community1 from "../assets/community1.png";
import community2 from "../assets/community2.png";
import community3 from "../assets/community3.png";


const Header = () => {
    const swiperRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);

    const toggleAutoplay = () => {
        if (swiperRef.current) {
            const swiper = swiperRef.current.swiper;
            if (isPlaying) {
                swiper.autoplay.stop(); // Stop autoplay
            } else {
                swiper.autoplay.start(); // Start autoplay
            }
            setIsPlaying(!isPlaying); // Toggle play state
        }
    };

    return (
        <div className='bg-primary rounded-lg relative w-full h-[420px]'>
            <Swiper
                ref={swiperRef}
                modules={[Autoplay, Pagination]} // Removed Navigation here
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 8000,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                loop={true}
                slidesPerView={1}  // Ensure it's set to a number compatible with your slide count
                speed={4000}  // Reduced speed for smoother transition
                className="w-full h-full"
            >
                {/* Slide 1 */}
                <SwiperSlide>
                    <div className='w-full h-full flex flex-col md:flex-row flex-wrap bg-primary bg-center'>
                        <div className='md:w-1/2 flex flex-col items-start justify-center gap-8 p-8 text-white'>
                            <p className='text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight'>
                                Book with us... <br /> Free Consultation!
                            </p>
                            <div className='flex flex-col md:flex-row items-center gap-3 text-sm font-light'>
                                <p className='text-base md:text-lg lg:text-xl font-light'>
                                    Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
                                </p>
                            </div>
                            <a href="#speciality" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm hover:scale-105 transition-all duration-300'>
                                Request an appointment <img className='w-3' src={assets.arrow_icon} alt="Arrow Icon" />
                            </a>
                        </div>
                        <div className='md:w-1/2 relative flex justify-center items-center'>
                            <img className='w-9/10 h-auto object-cover rounded-lg absolute bottom-3' src={assets.header_img} alt="Header Image" />
                        </div>
                    </div>
                </SwiperSlide>

                {/* Slide 2 */}
                <SwiperSlide>
                    <div className='w-full h-full flex flex-col md:flex-row flex-wrap bg-gray-300 bg-center bg-cover bg-left transition-all duration-1000 transform scale-105'>
                        <div className='md:w-3/5 relative'>
                            <img
                                className='w-[87%] h-[80%] object-cover rounded-lg mx-auto'
                                src={career}
                                alt="Career Image"
                                style={{ transform: 'translateY(10%) translateX(18px)' }}
                            />
                        </div>
                        <div className='md:w-2/5 flex flex-col items-start justify-center gap-8 p-8 text-white'>
                            <p className='text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight' style={{ transform: 'translateY(-20%)' }}>
                                Join Our Team!
                            </p>
                            <p className='text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight'>
                                Explore Career Opportunities...
                            </p>
                            <div className='text-sm font-light'>
                                <p className='text-sm md:text-base font-light'>
                                    We are always looking for talented individuals to join our team. Check out the available positions and apply today!
                                </p>
                            </div>
                            <a href="/careers" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm hover:scale-105 transition-all duration-300'>
                                View Career Opportunities <img className='w-3' src={assets.arrow_icon} alt="Arrow Icon" />
                            </a>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Slide 3 */}
                <SwiperSlide>
                    <div className='w-full h-full relative bg-gradient-to-r from-purple-300 via-purple-200 to-purple-100 bg-center transition-all duration-1000'>
                        {/* Left Section with Text - Centered with background color for contrast */}
                        <div className='absolute inset-0 flex flex-col items-center justify-start gap-8 p-8 text-white z-10 bg-black bg-opacity-20'>
                            <p className='text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-center top-1/4'>
                                Our Community
                            </p>
                            <p className='text-lg md:text-xl lg:text-2xl font-light text-center mt-24'>
                                We are proud to help communities from all walks of life. Whether it's providing healthcare, educational support, or professional services, we are committed to making a positive impact and empowering individuals in every community we serve.
                            </p>
                        </div>

                        {/* Right Section with Images Positioned Absolutely */}
                        <div className='absolute top-0 left-0 w-full h-full'>
                            {/* Left Image (Image 1) */}
                            <div className='absolute top-0 left-0 w-1/3 h-full p-2'>
                                <img className='w-full h-full object-cover rounded-lg' src={community1} alt="Community Image 1" />
                            </div>
                            {/* Middle Image (Image 2) */}
                            <div className='absolute top-0 left-1/3 w-1/3 h-full p-2'>
                                <img className='w-full h-full object-cover rounded-lg' src={community2} alt="Community Image 2" />
                            </div>

                            {/* Right Image (Image 3) */}
                            <div className='absolute top-0 right-0 w-1/3 h-full p-2'>
                                <img className='w-full h-full object-cover rounded-lg' src={community3} alt="Community Image 3" />
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>

            {/* Play/Pause Button */}
            <button
                onClick={toggleAutoplay}
                className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-md text-gray-600 hover:bg-gray-200 transition-all z-50"
                style={{
                    fontSize: '12px', // Adjust font size if needed
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {isPlaying ? (
                    <i className="fas fa-pause"></i> // Font Awesome Pause Icon
                ) : (
                    <i className="fas fa-play"></i> // Font Awesome Play Icon
                )}
            </button>
        </div>
    );
};

export default Header;
