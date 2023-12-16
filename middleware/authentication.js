var jwt=require('jsonwebtoken');
require('dotenv').config()
const key = process.env.JWT_SECRET;
const Auth=(async (req, res, next) => {

    if(req.headers.authorization){
        const token=req.headers.authorization;
        if(token){
            jwt.verify(token,key,async(err,decoded)=>{
                if(err){
                    return res.status(403).json({
                        status:"failed",
                        message:"not a valid token"
                    })
                }
                if(decoded){
                    req.user=decoded.user_id;
                    next()
                }
            })
        }
    }else{
        return res.status(403).json({
            status:"failed",
            message:"unauthorized"
        })
    }}
)


module.exports=Auth;
