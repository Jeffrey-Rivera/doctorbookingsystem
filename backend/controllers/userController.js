import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import nodemailer from 'nodemailer'; 
import { format } from 'date-fns'; 
import stripe from 'stripe';

// Setting up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// API to register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email, thank you!" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password, thank you!" });
        }

        // Hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select('-password');
        res.json({ success: true, userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file; // Adjusted to use req.file if using multer

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" });
        }

        // Update user profile without image
        await userModel.findByIdAndUpdate(userId, {
            name, phone, address: JSON.parse(address), dob, gender
        });

        // Check if image file is provided
        if (imageFile) {
            try {
                // Upload image to Cloudinary
                console.log('Uploading image to Cloudinary:', imageFile.path);
                const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                    resource_type: 'image'
                });
                const imageURL = imageUpload.secure_url;

                // Update user image in database
                await userModel.findByIdAndUpdate(userId, { image: imageURL });
                console.log('Image uploaded successfully:', imageURL);
            } catch (err) {
                console.error('Cloudinary upload failed:', err);
                return res.json({ success: false, message: 'Image upload failed' });
            }
        }

        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.error('Update profile failed:', error);
        res.json({ success: false, message: error.message });
    }
};

// API to book an appointment
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;
        const docData = await doctorModel.findById(docId).select('-password');

        if (!docData.available) {
            return res.json({ success: false, message: 'Sorry, Doctor not available' });
        }

        let slots_booked = docData.slots_booked;

        // Check for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Oops sorry, Slot not available' });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await userModel.findById(userId).select('-password');

        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        // Format the slotDate for the email
        const [day, month, year] = slotDate.split('_');
        const formattedSlotDate = format(new Date(year, month - 1, day), 'EEEE, MMMM do, yyyy');

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userData.email,
            subject: 'Appointment Confirmation',
            text: `Dear ${userData.name}, your appointment with Dr. ${docData.name} on ${formattedSlotDate} at ${slotTime} has been successfully booked. Thank you for using our service!`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email sending failed:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.json({ success: true, message: 'Appointment Booked!' });
    } catch (error) {
        console.error('error', error);
        res.json({ success: false, message: error.message });
    }
};

// API to list user appointments for the frontend
const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel.find({ userId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.error('error', error);
        res.json({ success: false, message: error.message });
    }
};

// API to cancel an appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        // Verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action!' });
        }
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // Release doctor slot
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        let slots_booked = doctorData.slots_booked;
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        // Get user data for email
        const userData = await userModel.findById(userId).select('-password');

        // Format the slotDate for the email
        const [day, month, year] = slotDate.split('_');
        const formattedSlotDate = format(new Date(year, month - 1, day), 'EEEE, MMMM do, yyyy');

        // Send cancellation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userData.email,
            subject: 'Appointment Cancellation',
            text: `Dear ${userData.name}, your appointment with Dr. ${doctorData.name} on ${formattedSlotDate} at ${slotTime} has been cancelled. If you have any questions, please contact us. Thank you!`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email sending failed:', error);
            } else {
                console.log('Cancellation email sent:', info.response);
            }
        });

        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const stripeInstance = stripe(process.env.STRIPE_KEY_SECRET);

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' });
        }

        // Create a Checkout Session
        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'cad',
                        product_data: {
                            name: `Appointment with Dr. ${appointmentData.docData.name}`,
                        },
                        unit_amount: appointmentData.amount * 100, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        res.json({ success: true, sessionId: session.id });
    } catch (error) {
        console.log('Error in paymentStripe API:', error);
        res.json({ success: false, message: error.message });
    }
};




export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentStripe };
