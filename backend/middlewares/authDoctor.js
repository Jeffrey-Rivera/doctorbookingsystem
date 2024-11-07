import jwt from 'jsonwebtoken';

// Doctor authentication middleware
const authDoctor =async (req,res,next) => {
    try {

        const {token} = req.headers
        if (!token) {
            return res.json({ success: false, message: "Not Authorized Login Again" })
        }
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.body.docId = token_decoded.id
        next()
        // console.log(token_decoded);
            
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message:error.message})
    }
}

export default authDoctor