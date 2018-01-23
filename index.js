require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;
const axios = require('axios');
const storage = require('node-persist');

const bot = new TelegramBot(token, {polling: true});

const messages = require('./messages/index');

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const startMsg = messages.start
  bot.sendMessage(chatId, startMsg, {parse_mode: 'Markdown'});
})

bot.onText(/\/login/, async (msg) => {
  const chatId = msg.chat.id;
  const login = messages.login;
  bot.sendMessage(chatId, login, {parse_mode: 'Markdown'});
})

bot.onText(/\/sign\/\w+/, (msg) => {
  const chatId = msg.chat.id;
  const noUser = messages.userNotCreated;
  const yesUser = messages.userIsHere;
  let username = msg.text.split(/\/sign\//)[1];
  axios.get('http://Karina-MacBookPro.local:3000/get-user', {
    data: {
      username
    }
  })
    .then(function (response) {
      storage.initSync();
      storage.setItemSync('user', response.data.username)
      bot.sendMessage(chatId, yesUser, {parse_mode: 'Markdown'})
    })
    .catch(function (error) {
      console.log('login error');
      bot.sendMessage(chatId, noUser, {parse_mode: 'Markdown'})
    });
})

bot.onText(/\/learn/, async (msg) => {
  storage.initSync();
  let username = storage.getItemSync('user');
  const chatId = msg.chat.id;
  const learn = messages.learn;
  const correct = messages.correct;
  const incorrect = messages.incorrect;
  const finished = messages.finished;
  await bot.sendMessage(chatId, learn, {parse_mode: 'Markdown'})
  await axios.get('http://Karina-MacBookPro.local:3000/words-user', {
    data: {
      username
    }
  })
    .then(function (response) {
      storage.initSync();
      for (let i = 0; i < response.data.length; i++) {
        let key = 'key' + i;
        storage.setItemSync(key, response.data[i])
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  let object = storage.valuesWithKeyMatch(/key/);
  let counter = 1;
  doQuestion = async (object) => {
    if (object.length > 0) {
      bot.sendMessage(chatId, Object.keys(object[0])[0]);
      let regex = new RegExp(counter + '\\w+');
      bot.onText(regex, async (msg) => {
        let regex2 = new RegExp(counter)
        let word = msg.text.split(regex2)[1];
        if (word === Object.values(object[0])[0]) {
          await bot.sendMessage(chatId, correct, {parse_mode: 'Markdown'})
          await object.shift();
          counter++;
          doQuestion(object);
        } else {
          bot.sendMessage(chatId, incorrect, {parse_mode: 'Markdown'})
        }
      })
    } else {
      bot.sendMessage(chatId, finished, {parse_mode: 'Markdown'})
      storage.clearSync();
    }
  }
  doQuestion(object);
})

bot.onText(/\/stop/, async (msg) => {
  const chatId = msg.chat.id;
  const stop = messages.stop;
  storage.initSync();
  bot.sendMessage(chatId, stop, {parse_mode: 'Markdown'})
  storage.clearSync();
})
