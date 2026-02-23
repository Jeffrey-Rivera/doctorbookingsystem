import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctor.Route.js'
import userRouter from './routes/userRoute.js'
import resumeRouter from './routes/resumeRoute.js'

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// ✅ Allow both frontend + admin origins
const allowedOrigins = [
  "http://16.52.37.174",
  "http://16.52.37.174:81",
  "http://16.52.37.174:82",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS: " + origin));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "token",
    "atoken"   // ✅ ADD THIS
  ],
  credentials: true,
}));

app.options("*", cors());

app.use(express.json());

app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);
app.use('/api/resumes', resumeRouter);

app.get('/', (req, res) => res.send('API WORKING'));

app.listen(port, () => console.log('Server Started on port', port));