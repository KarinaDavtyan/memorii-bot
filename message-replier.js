const startReplier = require('./controllers');
const chainProcessor = require('./chain-processor');
const messages = require('./messages');


const repliers = [
  startReplier.reply,
];

const reply = async (message) => {
  if (message.text === '/start' || message.text === '/help') {
    switch (message.text) {
    case '/start':
      return [{
        text: messages.start,
        options: { parse_mode: 'Markdown' }
      }]
    case '/help':
      return [{
        text: messages.help,
        options: { parse_mode: 'Markdown' }
      }]
    default:
      return null;
    }
  } else {
    try {
      console.log(message, '!@#!#@!!');
      let replies = await chainProcessor.processAsync(repliers, message);

      console.log(replies, 'rep!!!');

      if (!Array.isArray(replies)) replies = [ replies ];

      replies = replies.map(reply => {
        if (typeof reply == 'string' && reply.length > 0) {
          return {
            text: reply,
            options: {}
          };
        }
        return reply;
      });

      return replies;
    } catch (ex) {
      console.error(ex);
      return 'An error occurred when calculating the reply';
    }
  }

}

exports.reply = reply;
