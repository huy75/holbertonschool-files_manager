import redisClient from './redis';

async function getAuthToken(request) {
  const token = request.headers['x-token'];
  return `auth_${token}`;
}

// checks authentication against verified information
// returns userId of user
async function findUserIdByToken(request) {
  const key = await getAuthToken(request);
  const userId = await redisClient.get(key);
  return userId || null;
}

export {
  findUserIdByToken, getAuthToken,
};
