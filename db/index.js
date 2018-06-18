const { MongoClient } = require('mongodb');
const url = process.env.MONGOLAB_MEMORII;
const dbName = 'memorii';

const handleUserId = async (username, telegramId) => {
  let client;
  try {
    client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection('users');

    let user = await collection.findOneAndUpdate({ username}, {
      $set: { telegramId }
    })
    return user.value;
  } catch (err) {
    //eslint-disable-next-line
    console.log(err.stack);
  }
  client.close();
}

const getCollections = async (telegramId) => {
  let client;
  try {
    client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const users = db.collection('users');
    const selections = db.collection('selections');


    let { _id } = await users.findOne({ telegramId });
    let selectionArray = await selections.find({ owner: _id }).limit(8).toArray();
    return selectionArray;
  } catch (err) {
    //eslint-disable-next-line
    console.log(err.stack);
  }
  client.close();
}

const getCollection = async (telegramId, title) => {
  let client;
  try {
    client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const users = db.collection('users');
    const selections = db.collection('selections');


    let { _id } = await users.findOne({ telegramId });
    let selection = await selections.findOne({ owner: _id, title });
    return selection;
  } catch (err) {
    //eslint-disable-next-line
    console.log(err.stack);
  }
  client.close();
}

const checkActiveChallenge = async (telegramId) => {
  let client;
  try {
    client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const users = db.collection('users');

    let user = await users.findOne({ telegramId });
    const { challenge, currentQuestion } = user.activeChallenge;
    return challenge ? { challenge, currentQuestion } : false;
  } catch (err) {
    //eslint-disable-next-line
    console.log(err.stack);
  }
  client.close();
}

const setActiveChallenge = async (telegramId, title) => {
  let client;
  try {
    client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const users = db.collection('users');

    return await users.updateOne({ telegramId },
      {$set: {
        activeChallenge: {
          challenge: title,
          currentQuestion: 0
        }
      }}
    );
  } catch (err) {
    //eslint-disable-next-line
    console.log(err.stack);
  }
  client.close();
}

const getWords = async (telegramId) => {
  let client;
  try {
    client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const users = db.collection('users');
    const selections = db.collection('selections');
    const words = db.collection('words');

    let user = await users.findOne({ telegramId });

    const { challenge, currentQuestion } = user.activeChallenge;
    let { _id } = await selections.findOne({ title: challenge });
    const wordArray = await words.find({selection: _id}).limit(10).toArray();
    return wordArray[currentQuestion];
  } catch (err) {
    //eslint-disable-next-line
    console.log(err.stack);
  }
  client.close();
}

const nextQuestion = async (telegramId) => {
  let client;
  try {
    client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const users = db.collection('users');
    const selections = db.collection('selections');
    const words = db.collection('words');

    const user = await users.findOneAndUpdate({ telegramId },
      {
        $inc: {
          'activeChallenge.currentQuestion': 1
        }
      },
      {returnOriginal: false}
    );
    const { challenge, currentQuestion } = user.value.activeChallenge;
    let { _id } = await selections.findOne({ title: challenge });
    const wordArray = await words.find({selection: _id}).limit(10).toArray();
    if (!wordArray[currentQuestion]) {
      await users.findOneAndUpdate({ telegramId },
        {$set: {
          activeChallenge: {
            challenge: '',
            currentQuestion: 0
          }
        }}
      );
      return null;
    }
    return wordArray[currentQuestion];
  } catch (err) {
    //eslint-disable-next-line
    console.log(err.stack);
  }
  client.close();
}

const reset = async (telegramId) => {
  let client;
  try {
    client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const users = db.collection('users');

    const user = await users.findOneAndUpdate({ telegramId },
      {$set: {
        activeChallenge: {
          challenge: '',
          currentQuestion: 0
        }
      }}
    );
    return;
  } catch (err) {
    //eslint-disable-next-line
    console.log(err.stack);
  }
  client.close();
}


module.exports = {
  handleUserId,
  getCollections,
  getCollection,
  checkActiveChallenge,
  setActiveChallenge,
  getWords,
  nextQuestion,
  reset,
}
