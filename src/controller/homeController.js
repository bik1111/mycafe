import bcrypt from 'bcryptjs';
import jwt from '../auth/auth-jwt.js';
import redisClient  from "../utils/cache.js"
import { findUser, registerUser, editUserNameResult, editUserPassword } from "../service/cafeService.js"
import { smtpTransport } from "../config/email.js";
import crypto from "crypto";

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


export const editUserNamePage = (req,res) => {
    res.render('users/editUsername')
}

export const editUserName = async (req,res) => {

try {

    const { oldUsername, newUsername } = req.body;
    
    const user = await findUser(oldUsername);
    if(!user) {
        res.send(" User does not exist. ")
    }

    const editeduser = await editUserNameResult(newUsername, oldUsername);
    
    return res.redirect('/logout')

} catch(err) {
    console.log(err);
}

}


export const editPasswordPage = (req,res) => {
    res.render('users/editPassword')
}

export const editPassword = async(req,res) => {
    const { username, oldPassword, newPassword } = req.body;

    const user = await findUser(username);

    if(!user) {
        res.send(" user does not exist. ")
    }

    const ok =  await bcrypt.compare(oldPassword, user[0].password);
    
    if(!ok) {
        res.send( " The current password is incorrect ")
    }

    const hasedNewPassword = await bcrypt.hash(newPassword, 10);

    const editPassword = await editUserPassword(hasedNewPassword, username);

    return res.redirect('/logout')


}



var generateRandomNumber = function (min,max) {
    var randNum = Math.floor(Math.random() * (max - min + 1)) + min;

    return randNum;
}


export const emailAuth = (req,res) => {
    const number = generateRandomNumber(111111, 999999)

    const { email } = req.body; //사용자가 입력한 이메일

    const mailOptions = {
        from : "bik1111@naver.com ", // 발신자 이메일 주소.
        to : email, //사용자가 입력한 이메일 -> 목적지 주소 이메일
        subject : " 인증 관련 메일 입니다. ",
        html : '<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>' + number
    }
    smtpTransport.sendMail(mailOptions, (err, response) => {
        console.log(response);
        //첫번째 인자는 위에서 설정한 mailOption을 넣어주고 두번째 인자로는 콜백함수.
        if(err) {
            res.json({ok : false , msg : ' 메일 전송에 실패하였습니다. '})
            smtpTransport.close() //전송종료
            return
        } else {
            res.json({ok: true, msg: ' 메일 전송에 성공하였습니다. ', authNum : number})
            smtpTransport.close() //전송종료
            return 

        }
    })
}


const generateEmailVerificationToken = () => {
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24시간 후 만료
    return { token, expires };
  };

export const emailLinkauth = (req,res) => {

    const result = generateEmailVerificationToken();

    const { email } = req.body;
    const mailOptions = {
        from : "bik1111@naver.com ", // 발신자 이메일 주소.
        to : email, //사용자가 입력한 이메일 -> 목적지 주소 이메일
        subject : 'Verify your email address',
        html: `<p>Please click the following link to verify your email address:</p>
        <p> <a href="http://localhost:3000/verify-email/?email=${email}?token=${result.token}">Verify email</a></p>
        <p>This link will expire on ${result.expires}.</p>`
    }

        smtpTransport.sendMail(mailOptions, (err, response) => {
            console.log(response);
            //첫번째 인자는 위에서 설정한 mailOption을 넣어주고 두번째 인자로는 콜백함수.
            if(err) {
                res.json({ok : false , msg : ' 메일 전송에 실패하였습니다. '})
                smtpTransport.close() //전송종료
                return
            } else {
                res.json({ok: true, msg: ' 메일 전송에 성공하였습니다. ', authNum : number})
                smtpTransport.close() //전송종료
                return 
    
            }
        })
    
    
    }

