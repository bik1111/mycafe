import redis from "ioredis"
import dotenv from 'dotenv';
dotenv.config();

export const redisClient =  redis.createClient({
  host: '127.0.0.1',
  port: 6379,
});

redisClient.on('error', (err) => {
  console.log(`Redis error: ${err}`);
    redisClient.quit();
});


redisClient.on('connect', () => {
  console.log('✅ Redis client connected');
});

//redis에 데이터 저장.
export const set = (key, value) => {
    redisClient.set(key, JSON.stringify(value));
  };


// 데이터 가져오기.
export const get = (req, res, next) => {
   let key = req.originalUrl;

    redisClient.get(key, (error, data) => {
    if (error) {
        res.status(400).send({
          ok: false,
          message: error,
        });
    }
      if (data !== null) {
       console.log('data from redis!');
      res.status(200).send({
       ok: true,
       data: JSON.parse(data),
        });
      } else next();
    });
  };
