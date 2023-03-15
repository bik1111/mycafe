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
            const accessToken = jwt.sign(user[0]);

            

            const refreshToken = jwt.refresh();
            redisClient.set(username, refreshToken);

            

            //클라이언트에게 쿠키단에 JWT 심어주기.
            res.cookie('jwt', accessToken, {
                httpOnly: true,
                
            })
            

            

    
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
    res.status(500).json({ message: 'Internal server error' });

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

    //로그아웃은 간단하게 클라이언트 쿠키를 삭제하여 처리.
    // token 값을 null로 전달하는 것과 함께, cookie의 만료시간을 0으로 설정
    try {
    res.cookie('jwt', null, {
        maxAge : 0,
    });
    res.redirect('home');
} catch(err) {
    console.log(err);
}
}