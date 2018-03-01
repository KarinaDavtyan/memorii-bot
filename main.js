require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;
const axios = require('axios');

const bot = new TelegramBot(token, {polling: true});
const messages = require('./messages/index');

//not used now
const NodeCache = require('node-cache');
const myCache = new NodeCache();

let URL = process.env.API || 'http://Karina-MacBookPro.local:3000';

bot.on('polling_error', (error) => {
  console.log(error, 'error');
});

UserData = (username, yes, no, noSelections, chatId, errorAlert) => {
  axios.get(`${URL}/user-bot`, {
    data: {
      username
    }
  })
    .then(response => {
      bot.sendMessage(chatId, yes, {parse_mode: 'Markdown'});
      return axios.post(`${URL}/id-bot`, {
        data: {
          telegramId: chatId,
          username
        }
      })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log('error');
        });
    })
    .catch((e) => {
      e.response.status === 404
        ? bot.sendMessage(chatId, no, {parse_mode: 'Markdown'})
        : bot.sendMessage(chatId, errorAlert, {parse_mode: 'Markdown'})
    })

}


bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const startMsg = messages.start
  bot.sendMessage(chatId, startMsg, {parse_mode: 'Markdown'});
})

bot.onText(/\/sign\/\w+/, (msg) => {
  const chatId = msg.chat.id;
  const noUser = messages.userNotCreated;
  const yesUser = messages.userIsHere;
  const noSelections = messages.noSelections;
  const errorAlert = messages.errorAlert;
  let username = msg.text.split(/\/sign\//)[1];
  UserData(username, yesUser, noUser, noSelections, chatId, errorAlert);
})

bot.onText(/\/selections/, (msg) => {
  const chatId = msg.chat.id;
  axios.get(`${URL}/selections-bot`, {
    data: {
      telegramId: chatId
    }
  })
    .then(function (response) {
      myCache.set('selections', response.data)
      let list = response.data.map(select => {
        return [{
          text: select
        }]
      });
      var options = { reply_markup: JSON.stringify({
        keyboard: list,
        one_time_keyboard: true,
        force_reply:true
      })};
      bot.sendMessage(chatId, 'Choose👇', options)
        .then(() => {
          answerCallbacks[chatId] = (selection) => {
            axios.get(`${URL}/all-words-bot`, {
              data: {
                title: selection.text
              }
            })
              .then((response) => {
                train = () => {
                  const telegramId = response.data[2]
                  if (msg.from.id == telegramId) {
                    let first = response.data[0];
                    let second = response.data[1];
                    if (first.length > 0) {
                      let regex = new RegExp(`${second[0]}`);
                      let excRegex = new RegExp(`(?![${second[0]}])\\S+`); //everything except second[0] or /selections
                      bot.sendMessage(chatId, messages.question(first[0]), {parse_mode: 'Markdown'});
                      bot.onText(regex, (msg) => {
                        bot.sendMessage(chatId, messages.correct, {parse_mode: 'Markdown'})
                        bot.removeTextListener(excRegex);
                        first.shift();
                        second.shift();
                        if (first.length === 0 ) {
                          bot.sendMessage(chatId, messages.stop, {parse_mode: 'Markdown'})
                        }
                        train();
                      })
                      bot.onText(excRegex, (msg) => {
                        //for user to interrupt bot
                        if (msg.text == '-stop') {
                          bot.removeTextListener(excRegex);
                          first = [];
                          bot.sendMessage(chatId, messages.stop, {parse_mode: 'Markdown'})
                        } else {
                          bot.sendMessage(chatId, messages.incorrect, {parse_mode: 'Markdown'});
                        }
                      })
                    }
                  }
                }
                train();
              })
              .catch((e) => {
                console.log('here error');
                console.log(e.response);

                e.response.status === 404
                  ? bot.sendMessage(chatId, messages.emptySelection(msg.data), {parse_mode: 'Markdown'})
                  : console.log(e.response.status);
              })
          };
        })
    })
    .catch((e) => {
      e.response.status === 404
        ? bot.sendMessage(chatId, messages.errorAlert, {parse_mode: 'Markdown'})
        : console.log(e.response.status);
    })
})

const answerCallbacks = {};

bot.on('message', function (msg) {
  const callback = answerCallbacks[msg.chat.id];
  if (callback) {
    delete answerCallbacks[msg.chat.id];
    return callback(msg);
  }
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMsg = messages.help
  bot.sendMessage(chatId, helpMsg, {parse_mode: 'Markdown'});
})
