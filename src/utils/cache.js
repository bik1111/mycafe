import redis from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = redis.createClient({  host: `${process.env.REDIS_HOST}}` , port: 6379 });


//(async () => {
//  redisClient.connect();
//})();

redisClient.on('error', (err) => {
  console.log(`Redis error: ${err}`);
    redisClient.quit();
});


redisClient.on('connect', () => {
  console.log('✅ Redis client connected');
});







const set = (key, value) => {
    redisClient.set(key, JSON.stringify(value));
  };
  
const get = (req, res, next) => {
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
  export default {
    redisClient: redisClient,
    set: set,
    get: get
  };
  
