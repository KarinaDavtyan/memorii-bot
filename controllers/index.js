const db = require('../db');
const messages = require('../messages');

const reply = async ({ userId, text }) => {

  if (text.match(/\/sign\/\w+/)) {
    let username = text.split(/\/sign\//)[1];
    const { userNotCreated, userIsHere, noSelections, errorAlert } = messages;
    const userOptions = await UserData(username, userIsHere, userNotCreated, userId, errorAlert);
    return userOptions;
  }

  if (text === '/collections') {
    const collections = await db.getCollections(userId);

    const list = collections.map(select => {
      return [{
        text: select.title
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
