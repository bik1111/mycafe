import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import flash from "connect-flash";

dotenv.config();

export const localsMiddleware = (req,res,next) =>{
    res.locals.loggedIn = Boolean(req.cookies.jwt);
    res.locals.currentUser = req.cookies.jwt ? jwt.verify(req.cookies.jwt, process.env.JWT_SECRET) : null;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next(); 
    
}


export default localsMiddleware