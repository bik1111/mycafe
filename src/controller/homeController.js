import bcrypt from 'bcrypt';
import jwt from '../auth/auth-jwt.js';
import redisClient from "../utils/cache.js";
import { findUser } from "../service/cafeService.js"

export const home = (req,res) => {
    res.render('home')
}

export const loginPage = (req,res) => {
    res.render('users/login')
}

export const login = (req,res) => {
    const { username , password } = req.body;

    //해당 하는 Id를 가진 유저 존재유무 조회.
    const user = findUser(username);

    if(user.length > 0) {
        const pwCheck = bcrypt.compare(password, user.password);

        if (pwCheck.length > 0 ) {
            //jwt 토큰 발급.
            const accessToken = jwt.sign(user);
            const refreshToken = jwt.refresh();

            redisClient.set(username, refreshToken);

            res.status(200).send({
                ok: true,
                data: {
                  accessToken,
                  refreshToken,
                },
              });
              return;        } else {
            res.status(401).send({
                ok: false,
                msg: 'password is not corret.'
            })
        }
        res.status(401).send({
            ok : false,
            msg: 'user not exist.'
        })
    }

};