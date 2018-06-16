const { MongoClient } = require('mongodb');

const handleUserId = async (username, telegramId) => {
  let db_;
  await MongoClient.connect(process.env.MONGOLAB_MEMORII, (e, db) => {
    if (e) console.log(e, 'error');
    db_ = db;
  });
  try {
    const user = db
      .collection('users')
      .findOneAndUpdate(
        { username: username },
        {
          $set: { telegramId: telegramId }
        }
      )
      .then(res => console.log(res))
    console.log(user);
    return user;
  } finally {
    db.close();
  }
}

module.exports = {
  handleUserId
}
