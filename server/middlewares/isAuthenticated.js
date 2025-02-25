import  jwt from "jsonwebtoken"

const isAutheticated = async (req,res) =>{
    try {
        const token  = req.cookie.token;
        if(!token)
        {
            return res.status(401).json({success:false,message :"User is Not Authenticated !"});

        }
    } catch (error) {
        console.log(error);
        
    }
}