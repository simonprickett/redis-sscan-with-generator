const bluebird = require('bluebird');
const redis = require('redis');

// Promisify all functions exposed by redis to we can use
// async / await.
bluebird.promisifyAll(redis);

// Connect to local Redis server.
const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379
});

const createSampleData = async () => {
  // Create a Redis set called usernames with some example data, 
  // delete anything that was there before.
  const redisKeyName = 'usernames';

  await redisClient.delAsync(redisKeyName);
  await redisClient.saddAsync(redisKeyName, 
    'phantom', 'ghost', 'sierra', 'phoenix', 'shark', 'astronaut', 'shepherd',
    'viper', 'iceman', 'maverick', 'ripley', 'crockett', 'tubbs', 'geordie', 
    'mule', 'bear', 'panther', 'tiger', 'rocky', 'vader', 'wolf', 'charlie', 
    'rico', 'herbie', 'mcqueen');
};

// Generator function.  Iterates over the members 
// of the Redis set stored at key keyName.  
async function* setMembersGenerator(keyName) {
  // Start cursor at 0, when Redis returns a cursor
  // position of 0 from the SSCAN command, there are 
  // no more set members to return.
  let cursor = '0';

  do {
    // Get the next few set members.
    const response = await redisClient.sscanAsync(keyName, cursor);

    // Reponse [0] contains the new cursor position from Redis.
    cursor = response[0];

    // Response [1] contains the set members.
    yield response[1];
  } while (cursor !== '0'); // Stop when Redis returns '0' for the cursor value.
}

const runApplication = async () => {
  // Put some sample data into a set in Redis.
  await createSampleData();

  // Get an instance of our generator and give it a Redis key name.
  const userNamesIterator = setMembersGenerator('usernames');
  let finished = false;

  do {
    // Get values from the generator.  Anyone using the generator is 
    // shielded from the Redis implementation details.
    const { value: userNames, done } = await userNamesIterator.next();

    if (!done) {
      console.log(`Retrieved: ${userNames}`);
    }

    finished = done;
  } while (!finished);

  // Close connection to Redis.
  redisClient.quit();
};

try {
  runApplication();
} catch (e) {
  console.log(e);
}