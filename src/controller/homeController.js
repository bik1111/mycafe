import bcrypt from 'bcrypt';
import jwt from '../auth/auth-jwt.js';
import redisClient  from "../utils/cache.js"
import { findUser, registerUser } from "../service/cafeService.js"

export const home = (req,res) => {
    res.render('home')
}

export const loginPage = (req,res) => {
    res.render('users/login')
}

export const registerPage = (req,res) => {
    res.render('users/register')
}

export const login =  async (req,res) => {
    try {
    const { username , password } = req.body;
    
    //해당 하는 Id를 가진 유저 존재유무 조회.
    const user = await findUser(username);


    if(user.length > 0) {

        const pwCheck = await bcrypt.compare(password, user[0].password);

        if (pwCheck) {
            //jwt 토큰 발급.
            const accessToken = jwt.sign(user);
            const refreshToken = jwt.refresh();
            redisClient.set(username, refreshToken);
            req.session.loggedIn = true;
            req.session.user = user;

            return res.redirect('home')

        } else {
            res.status(401).send({
                ok: false,
                msg: 'password is not corret.'
            })
        } 
    } else {
    res.status(401).send({
    ok : false,
    msg: 'user not exist.'
    
})
    }
} catch (err) {
    console.log(err);
}
};



export const register = async (req,res) => {

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {

    const newUser = await registerUser(username,email,hashedPassword);

    const token = jwt.sign(newUser);
    console.log(token);
    res.redirect('/home')


    } catch(e) {
    console.log('error', e.message);
    res.redirect('/register')
    }
};


export const logout = async(req,res) => {
    try{
    req.session.destroy();
    res.redirect('home');
    } catch(err) {
        console.log(err);
    }

}