import jwt from "jsonwebtoken";
import redisClient  from "../utils/cache.js"
import { promisify } from "util";


export default  {
  sign: (user) => {
    const payload = {
      id: user.id,
      role: user.role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '1h',
      issuer: 'jincheol',
    });
  },
  verify: (token) => {
    let decoded = null;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
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
  refresh: () => {
    return jwt.sign({}, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '14d',
      issuer: 'jincheol',
    });
  },
  refreshVerify: async (token, username) => {
    const getAsync = promisify(redisClient.get).bind(redisClient);
    try {
      const data = await getAsync(username);
      if (token === data) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
        };
      }
    } catch (err) {
      return {
        ok: false,
      };
    }
  },
};