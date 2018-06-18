require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;
const axios = require('axios');

const bot = new TelegramBot(token, {polling: {interval: 500}});
const messages = require('./messages/index');

const messageReplier = require('./message-replier');

//not used now
const NodeCache = require('node-cache');
const myCache = new NodeCache();

let URL = process.env.API || process.env.LOCAL;

bot.on('polling_error', (error) => {
  //eslint-disable-next-line
  console.log(error, 'error');
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  handleMessage(chatId, msg.text);
});

handleMessage = async (chatId, text)  => {
  const replies = await messageReplier.reply({
    userId: chatId,
    text,
  });
  const sendPromise = replies.reduce((promise, reply) => {
    return promise.then(() => bot.sendMessage(chatId, reply.text, reply.options));
  }, Promise.resolve());

  try {
    await sendPromise;
  } catch (ex) {
    //eslint-disable-next-line
    console.log(ex.body);
    try {
      bot.sendMessage(chatId, 'An error occurred when sending the reply');
    }
    catch (ex) {
      //eslint-disable-next-line
      console.log(ex.body);
    }
  }
}
