require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;
const axios = require('axios');

const bot = new TelegramBot(token, {polling: true});

const messages = require('./messages/index');

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const startMsg = messages.start
  bot.sendMessage(chatId, startMsg, {parse_mode: 'Markdown'});
})

bot.onText(/\/login/, (msg) => {
  const chatId = msg.chat.id;
  const login = messages.login;
  const noUser = messages.userNotCreated;
  bot.sendMessage(chatId, login, {parse_mode: 'Markdown'});
  bot.on('message', (msg) => {
    bot.sendMessage(chatId, noUser, {parse_mode: 'Markdown'})
  })
})


// axios.get('http://Karina-MacBookPro.local:3000/everything')
//   .then(function (response) {
//   console.log(response);
//   })
//   .catch(function (error) {
//   console.log(error);
//   });
