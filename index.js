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
  console.log(storage.getItemSync('user'));
  bot.removeTextListener(/\/login/);
  const chatId = msg.chat.id;
  const learn = messages.learn;
  bot.sendMessage(chatId, learn, {parse_mode: 'Markdown'})
  // bot.sendMessage
})


// axios.get('http://Karina-MacBookPro.local:3000/get-user')
//   .then(function (response) {
//   console.log(response);
//   })
//   .catch(function (error) {
//   console.log(error);
//   });
