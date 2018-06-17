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
    console.log(err.stack);
  }
  client.close();
}

module.exports = {
  handleUserId,
  getCollections
}
