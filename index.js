require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;
const axios = require('axios');

const bot = new TelegramBot(token, {polling: true});
const messages = require('./messages/index');

UserData = (username, yes, no, noSelections, chatId, errorAlert) => {
  axios.get('http://Karina-MacBookPro.local:3000/user-bot', {
    data: {
      username
    }
  })
    .then(response => {
      bot.sendMessage(chatId, yes, {parse_mode: 'Markdown'});
      return axios.post('http://Karina-MacBookPro.local:3000/id-bot', {
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
  console.log(msg);
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
  axios.get('http://Karina-MacBookPro.local:3000/selections-bot', {
    data: {
      telegramId: chatId
    }
  })
    .then(function (response) {
      let list = response.data.map(select => {
        return [{
          text: select,
          callback_data: select
        }]
      });
      var options = { reply_markup: JSON.stringify({
        keyboard: list
      })};
      bot.sendMessage(chatId, 'Selections', options);
      bot.on('callback_query', function (msg) {
        bot.answerCallbackQuery(msg.id, msg.data, true);
      })
    })
    .catch((e) => {
      e.response.status === 404
        ? client.hmset('errors', ['selections', 'no selections'], (err, res) => {})
        : console.log(e.response.status);
    })

})

bot.onText(/\/learn/, async (msg) => {
  storage.initSync();
  let username = storage.getItemSync('user');
  const chatId = msg.chat.id;
  const learn = messages.learn;
  const correct = messages.correct;
  const incorrect = messages.incorrect;
  const finished = messages.finished;
  const invalid = messages.invalid;
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
  console.log(username);

  let counter = 1;
  doQuestion = async (object) => {
    if (object.length > 0) {
      bot.sendMessage(chatId, Object.keys(object[0])[0]);
      let regex;
      regex = new RegExp(counter + '\\w+');
      bot.onText(regex, async (msg) => {
        console.log(msg.text);
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

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMsg = messages.help
  bot.sendMessage(chatId, helpMsg, {parse_mode: 'Markdown'});
})

// bot.onText(/[A-Za-z]+/, async (msg) => {
//   bot.sendMessage(chatId, invalid,{parse_mode: 'Markdown'});
// })
// bot.onText(/[^A-Za-z]+/, async (msg) => {
//   bot.sendMessage(chatId, invalid,{parse_mode: 'Markdown'});
// })
