require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;
const axios = require('axios');

const bot = new TelegramBot(token, {polling: true});
const messages = require('./messages/index');

//not used now
const NodeCache = require('node-cache');
const myCache = new NodeCache();

let URL;
if (process.env.SERVER) {
  URL = process.env.SERVER;
} else {
  URL = 'http://Karina-MacBookPro.local:3000'
}

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
          text: select,
          callback_data: select
        }]
      });
      var options = { reply_markup: JSON.stringify({
        keyboard: list,
        force_reply:true
      })};
      bot.sendMessage(chatId, 'Selections', options);
    })
    .catch((e) => {
      e.response.status === 404
        ? bot.sendMessage(chatId, messages.errorAlert, {parse_mode: 'Markdown'})
        : console.log(e.response.status);
    })
})



bot.onText(/\S+/, (msg) => {
  let selections;
  try {
    selections = myCache.get('selections', true);
  } catch (err) {
    console.log(err);
  }
  // console.log(selections);
  // console.log(msg);
  // console.log(selections.includes(msg.text));
  if (selections.includes(msg.text)) {
    const chatId = msg.from.id;
    axios.get(`${URL}/all-words-bot`, {
      data: {
        title: msg.text
      }
    })
      .then((response) => {
        train = () => {
          const telegramId = response.data[2]
          // console.log('  --------------------');
          // console.log(msg.from.id, telegramId);
          if (msg.from.id == telegramId) {
            let first = response.data[0];
            let second = response.data[1];
            // console.log('first', first);
            if (first.length > 0) {
              bot.sendMessage(chatId, messages.question(first[0]), {parse_mode: 'Markdown'});
              let regex = new RegExp(`${second[0]}`);
              let excRegex = new RegExp(`(?![${second[0]}])\\S+`); //everything except second[0] or /selections
              console.log(excRegex);
              bot.onText(regex, (msg) => {
                // console.log(msg, 'heeere');
                //works same without setTimeout
                setTimeout(() => {
                  console.log(first.length, second.length);
                  console.log(msg.text, second[0],first.length,'correct');
                  bot.sendMessage(chatId, messages.correct, {parse_mode: 'Markdown'})
                  bot.removeTextListener(excRegex);
                  first.shift();
                  second.shift();
                  if (first.length === 0 ) {
                    bot.sendMessage(chatId, messages.stop, {parse_mode: 'Markdown'})
                  }
                  train();
                }, 500)
              })
              bot.onText(excRegex, (msg) => {
                // console.log(msg.text, second[0], first.length, 'incorrect');
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

  }
})

// bot.on('callback_query', (msg) => {
//   console.log('here');
//   // console.log('outside');
//   // console.log(msg);
//   const chatId = msg.from.id;
//   // bot.sendMessage(chatId, messages.selected(msg.data), {parse_mode: 'Markdown'});
//   axios.get('http://Karina-MacBookPro.local:3000/all-words-bot', {
//     data: {
//       title: msg.data
//     }
//   })
//     .then((response) => {
//       train = () => {
//         const telegramId = response.data[2]
//         // console.log('  --------------------');
//         // console.log(msg.from.id, telegramId);
//         if (msg.from.id == telegramId) {
//           let first = response.data[0];
//           let second = response.data[1];
//           console.log('first', first);
//           if (first.length > 0) {
//             bot.sendMessage(chatId, messages.question(first[0]), {parse_mode: 'Markdown'});
//             let regex = new RegExp(`${second[0]}`);
//             let excRegex = new RegExp(`(?![${second[0]}])\\S+`); //everything except second[0] or /selections
//             console.log(excRegex);
//             bot.onText(regex, (msg) => {
//               // console.log(msg, 'heeere');
//               //works same without setTimeout
//               setTimeout(() => {
//                 // console.log(first.length, second.length);
//                 // console.log(msg.text, second[0],first.length,'correct');
//                 bot.sendMessage(chatId, messages.correct, {parse_mode: 'Markdown'})
//                 bot.removeTextListener(excRegex);
//                 first.shift();
//                 second.shift();
//                 if (first.length === 0 ) {
//                   bot.sendMessage(chatId, messages.stop, {parse_mode: 'Markdown'})
//                 }
//                 train();
//               }, 500)
//             })
//             bot.onText(excRegex, (msg) => {
//               // console.log(msg.text, second[0], first.length, 'incorrect');
//               //for user to interrupt bot
//               if (msg.text == '-stop') {
//                 bot.removeTextListener(excRegex);
//                 first = [];
//                 bot.sendMessage(chatId, messages.stop, {parse_mode: 'Markdown'})
//               } else {
//                 bot.sendMessage(chatId, messages.incorrect, {parse_mode: 'Markdown'});
//               }
//             })
//           }
//         }
//       }
//       train();
//     })
//     .catch((e) => {
//       console.log('here error on callback_query');
//       console.log(e.response);
//
//       e.response.status === 404
//         ? bot.sendMessage(chatId, messages.emptySelection(msg.data), {parse_mode: 'Markdown'})
//         : console.log(e.response.status);
//     })
// })

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
  await axios.get(`${URL}/words-user`, {
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
