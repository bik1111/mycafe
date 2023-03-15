import dotenv from 'dotenv';
import jwt from "jsonwebtoken";

dotenv.config();

export const localsMiddleware = (req,res,next) =>{
    res.locals.loggedIn = Boolean(req.cookies.jwt);
    res.locals.currentUser = req.cookies.jwt ? jwt.verify(req.cookies.jwt, process.env.JWT_SECRET) : null;
    next(); 
    
}


export default localsMiddleware