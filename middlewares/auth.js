const jwt =require('jsonwebtoken');
require('dotenv').config();
var verifytoken=(req,res,next)=>{
    // extract token from headers of req object
    // console.log("req header is",req.headers.authorization);
    var tokenwithBearer = req.headers.authorization;
    // if token is found
    if(tokenwithBearer)
    {

    //   get signed token by removing first 7 chars from "tokenwithBearer"
    var signedToken = tokenwithBearer.slice(7,tokenwithBearer.length);
    // verify the sign token
    jwt.verify(signedToken,process.env.AUTH_KEY,(err,decodedToken)=>{

        if(err)
        {
           res.send({message:"relogin this page"});
        }
        else
        {
        
        next();
        }
    });
    }
    else
    {
      // context.res.status(200).json({ data: result });
       //res.status(200).json({ success: true, message:"Employe Saved Successfully",response});
       
        res.send({status:"success",message:"login",});
        
    }
    
}
// export function
module.exports = verifytoken;
