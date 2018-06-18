const startReplier = require('./controllers');
const questionFlow = require('./controllers/questions-flow');

const chainProcessor = require('./chain-processor');
const messages = require('./messages');
const db = require('./db');

const repliers = [
  startReplier.reply,
  questionFlow.reply
];

const reply = async (message) => {
  if (message.text === '/start' || message.text === '/help' || message.text === '/stop') {
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
    case '/stop':
      await db.reset(message.userId);
      return [{
        text: messages.stop,
        options: { parse_mode: 'Markdown' }
      }]
    default:
      return null;
    }
  } else {
    try {
      let replies = await chainProcessor.processAsync(repliers, message);
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
      //eslint-disable-next-line
      console.error(ex);
      return 'An error occurred when calculating the reply';
    }
  }

}

exports.reply = reply;
