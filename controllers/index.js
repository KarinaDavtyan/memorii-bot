const axios = require('axios');
const db = require('../db');

const messages = require('../messages');
let URL = process.env.API || 'http://Karina-MacBookPro.local:3000';


const reply = async ({ userId, text }) => {
  console.log(text);

  if (text.match(/\/sign\/\w+/)) {
    let username = text.split(/\/sign\//)[1];
    const { userNotCreated, userIsHere, noSelections, errorAlert } = messages;
    const userOptions = await UserData(username, userIsHere, userNotCreated, userId, errorAlert);
    return userOptions;
  }

  if (text === '/collections') {
    const response = await axios.get(`${URL}/selections-bot`, {
      data: {
        telegramId: userId
      }
    })

    const list = response.data.map(select => {
      return [{
        text: select
      }]
    });
    const options = {
      reply_markup: JSON.stringify({
        keyboard: list,
        one_time_keyboard: true,
        force_reply:true
      })
    };

    return {
      text: 'Choose👇',
      options
    }

  }

  return null;
}

const UserData = async (username, userIsHere, userNotCreated, chatId, errorAlert) => {
  try {
    const user = await db.handleUserId(username, chatId);
    console.log(user);
    if (user) {
      return {
        text: userIsHere,
        options: { parse_mode: 'Markdown' }
      }
    } else {
      return { text: userNotCreated, options: { parse_mode: 'Markdown' } };
    }
  } catch (e) {
    return { text: errorAlert, options: { parse_mode: 'Markdown' } };
  }
}

exports.reply = reply;
