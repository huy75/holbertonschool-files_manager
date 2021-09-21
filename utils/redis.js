import redis from 'redis';
import { promisify } from 'util';

/**
 * Class for performing operations with Redis service
 */
class RedisClient {
    constructor() {
        this.client = redis.createClient();
        this.client.on('error', (error) => {
            console.log(`Redis client not connected to the server: ${error.message}`);
        });
        this.client.on('connect', () => {
        //   console.log('Redis client connected to the server');
        });
    }

/**
 * Checks if connection to Redis is Alive
 * @return true if connection alive or false if not
 */
    isAlive() {
        return this.client.connected;
    }

/**
 * gets value corresponding to key in redis
 * @key {string} key to search for in redis
 * @return {string}  value of key
 */
    async get(key) {
        const aGet = promisify(this.client.get).bind(this.client);
        const value = await aGet(key).catch(console.error);
        return value;
    }

/**
 * Creates a new key in redis with a specific TTL
 * @key {string} key to be saved in redis
 * @value {string} value to be asigned to key
 * @duration {number} TTL of key
 * @return {undefined}  No return
 */
    async set(key, value, duration) {
        const aSet = promisify(this.client.set).bind(this.client);
        await aSet(key, value, 'EX', duration).catch(console.error);
        // this.client.setex(key, duration, value);
    }

/**
 * Deletes key in redis service
 * @key {string} key to be deleted
 * @return {undefined}  No return
 */
    async del(key) {
        const aDel = promisify(this.client.del).bind(this.client);
        await aDel(key).catch(console.error);
        // this.client.del(key);
    }

/**
 * Gets a user id and key of redis from request
 * @request {request_object} express request obj
 * @return {object} object containing userId and
 * redis key for token
 */
    async getUserIdAndKey(request) {
        const obj = { userId: null, key: null };
        const xToken = request.header('X-Token');
        if (!xToken) return obj;
        obj.key = `auth_${xToken}`;
        obj.userId = await redisClient.get(obj.key);
        return obj;
    }
}

const redisClient = new RedisClient();
module.exports = redisClient;
