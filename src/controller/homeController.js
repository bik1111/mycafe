import bcrypt from 'bcryptjs';
import jwt from '../auth/auth-jwt.js';
import { redisClient } from "../utils/cache.js"
import { findUser, registerUser, 
        editUserNameResult, editUserPassword, 
        saveTokenInUserInfo, verifyToken, 
        updateStatus } from "../service/cafeService.js"

import { smtpTransport } from "../config/email.js";
import crypto from "crypto";

export const home = (req, res) => {
    res.render('home')
}

export const loginPage = (req, res) => {
    res.render('users/login')
}

export const registerPage = (req, res) => {
    res.render('users/register')
}

export const login = async (req, res) => {
    try {
        const { email , password } = req.body;

        //해당 하는 Id를 가진 유저 존재유무와 이메일 인증을 성공적으로 마쳤는지 확인.
        const user = await findUser(email);

        console.log(user)

        //if (user.length > 0) {

        //   const pwCheck = await bcrypt.compare(password, user[0].password);

            if (user) {
                //jwt 토큰 발급.
                const accessToken = jwt.sign(user[0]);


                const refreshToken = jwt.refresh();
                redisClient.set(email, refreshToken);
                

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
        //} else {
        //    res.status(401).send({
        //        ok: false,
        //        msg: 'user not exist.'

       //     })
    //    }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });

    }
};



export const register = async (req, res) => {

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {

        const newUser = await registerUser(username, email, hashedPassword);

        const token = jwt.sign(newUser);
        console.log(token);
        res.redirect('/home')


    } catch (e) {
        console.log('error', e.message);
        res.redirect('/register')
    }
};


export const logout = async (req, res) => {

    //로그아웃은 간단하게 클라이언트 쿠키를 삭제하여 처리.
    // token 값을 null로 전달하는 것과 함께, cookie의 만료시간을 0으로 설정
    try {
        res.cookie('jwt', null, {
            maxAge: 0,
        });
        res.redirect('home');
    } catch (err) {
        console.log(err);
    }
}


export const editUserNamePage = (req, res) => {
    res.render('users/editUsername')
}

export const editUserName = async (req, res) => {

    try {

        const { oldUsername, newUsername } = req.body;

        const user = await findUser(oldUsername);
        if (!user) {
            res.send(" User does not exist. ")
        }

        const editeduser = await editUserNameResult(newUsername, oldUsername);

        return res.redirect('/logout')

    } catch (err) {
        console.log(err);
    }

}


export const editPasswordPage = (req, res) => {
    res.render('users/editPassword')
}

export const editPassword = async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    const user = await findUser(username);

    if (!user) {
        res.send(" user does not exist. ")
    }

    const ok = await bcrypt.compare(oldPassword, user[0].password);

    if (!ok) {
        res.send(" The current password is incorrect ")
    }

    const hasedNewPassword = await bcrypt.hash(newPassword, 10);

    const editPassword = await editUserPassword(hasedNewPassword, username);

    return res.redirect('/logout')


}



var generateRandomNumber = function (min, max) {
    var randNum = Math.floor(Math.random() * (max - min + 1)) + min;

    return randNum;
}


export const emailAuth = (req, res) => {
    const number = generateRandomNumber(111111, 999999)

    const { email } = req.body; //사용자가 입력한 이메일

    const mailOptions = {
        from: "bik1111@naver.com ", // 발신자 이메일 주소.
        to: email, //사용자가 입력한 이메일 -> 목적지 주소 이메일
        subject: " 인증 관련 메일 입니다. ",
        html: '<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>' + number
    }
    smtpTransport.sendMail(mailOptions, (err, response) => {
        console.log(response);
        //첫번째 인자는 위에서 설정한 mailOption을 넣어주고 두번째 인자로는 콜백함수.
        if (response) {
            res.json({ ok: true, msg: ' 메일 전송에 성공하였습니다. 인증과정을 마쳐 주세요. ' })
            smtpTransport.close() //전송종료
            return
        } else {
            res.json({ ok: false, msg: ' 메일 전송에 실패하였습니다. ' })
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

export const emailLinkauth = async (req, res) => {

    const result = generateEmailVerificationToken();
    let token = result.token;


    // 그리고 유저가 이메일 인증 링크 클릭하면 쿼리로 심어진 토큰값을 get 함수로 받아와서 status를 1로 변경.

    // 이메일 중복 확인 필요하고, password 암호화 필요!!
    const { email, password } = req.body;

    // const password = bcrypt....


    // 데이터베이스에 토큰,이메일, 비빌번호 저장.
    const waitingUser = await saveTokenInUserInfo(token, email, password);

    const mailOptions = {
        from: "bik1111@naver.com ", // 발신자 이메일 주소.
        to: email, //사용자가 입력한 이메일 -> 목적지 주소 이메일
        subject: 'Verify your email address',
        html: `<p>Please click the following link to verify your email address:</p>
        <p> <a href="http://localhost:3000/verify-email?email=${email}&token=${result.token}">Verify email</a></p>
        <p>This link will expire on ${result.expires}.</p>`
    }

    smtpTransport.sendMail(mailOptions, (err, response) => {
        console.log(response);
        //첫번째 인자는 위에서 설정한 mailOption을 넣어주고 두번째 인자로는 콜백함수.
        if (response) {
            res.json({ ok: true, msg: ' 메일 전송에 성공하였습니다. 메시지함을 확인해주세요.' })
            smtpTransport.close() //전송종료
            return
        } else {
            res.json({ ok: false, msg: ' 메일 전송에 실패하였습니다.. ' })
            smtpTransport.close() //전송종료
            return

        }
    })
}

export const verifyEmailAndToken = async (req,res) =>  {
    const token = req.query.token;
    const email = req.query.email;

    const verifiedToken = await verifyToken(token,email);

    if(verifiedToken[0].token && verifiedToken[0].email) {

        // status 0 -> 1 로 업데이트. (1이 되면 로그인이 가능해짐.)
       await updateStatus(token,email);
       res.json({msg : "이메일 인증이 완료되었습니다. " });
    } else {
        res.json({ msg : " 이메일 인증이 필요합니다. "})
    }
}