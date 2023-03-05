export const localsMiddleware = (req,res,next) =>{
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.currentUser= req.session.user || null;
    next();
    

}


export default localsMiddleware