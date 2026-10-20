import jwt from "jsonwebtoken"

const authMiddleware = async(req,res,next)=>{
    // Check for token in Authorization header or token field
    let token = req.headers.authorization?.split(' ')[1] || req.headers.token;
    
    if(!token){
        return res.json({success:false,message:"not authorized .Login again."})
    }
    try{
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        
        // Ensure req.body exists before setting properties
        if (!req.body) {
            req.body = {};
        }
        
        req.body.userId = token_decode.id;
        req.userId = token_decode.id; // Also set it directly on req for easier access
        next();
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error."})
    }
}

export default authMiddleware;