require("dotenv").config();
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const secret = process.env.JWT_SECRET




module.exports = {
  sign: async (user) => { // access token 발급
    const payload = { // access token에 들어갈 payload
      id: user.id,
      role: user.role,
    };
    
    // sign 함수는 payload를 이용하여 jwt 토큰을 발급합니다. 
    // 발급된 토큰은 result 객체의 accessToken 속성에 저장되어 반환됩니다. 
    // 이후 클라이언트는 해당 accessToken을 이용하여 서버에 요청을 보냅니다. 
    // 서버는 요청에서 전달된 accessToken을 이용하여 사용자를 인증하고, 요청에 대한 처리를 수행합니다.
    const result = {  
    accessToken: jwt.sign(payload, secret, {// secret으로 sign하여 발급하고 return
      algorithm: 'HS256', // 암호화 알고리즘
      expiresIn: '1h',	  // 유효기간
    },
    
    )};

    return result
    
  },
  verify: async (token) => { // access token 검증
    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
      
      return {
        ok: true,
        id: decoded.id,
        role: decoded.role,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },
  refresh: () => { // refresh token 발급
    return jwt.sign({}, secret, { // refresh token은 payload 없이 발급
      algorithm: 'HS256',
      expiresIn: '14d',
    });
  },
  refreshVerify: async (token, userId) => { // refresh token 검증
    /* redis 모듈은 기본적으로 promise를 반환하지 않으므로,
       promisify를 이용하여 promise를 반환하게 해줍니다.*/
    const getAsync = promisify(redisClient.get).bind(redisClient);
    
    try {
      const data = await getAsync(userId); // refresh token 가져오기
      if (token === data) {
        try {
          return true;
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      return false;t
    }
  },
};

export const authenticate = (req,res,next) => {

    try {
    const token = req.cookies.accessToken || ''; // 쿠키에서 토큰을 가져옵니다.

    if(token) {
        const decoded = jwt.verify(token, secret);


        //인증된 사용자의 정보를 res.locals.loggedInUser에 할당.
        res.locals.loggedInUser = {
            id : decoded.id,
            role: decoded.role,
        };
    }

    } catch(err) {
        console.log(err);
    }
    next(); // 다음 미들웨어 함수로 제어를 넘깁니다.


}