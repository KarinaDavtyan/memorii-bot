const db = require('../db');
const messages = require('../messages');

const reply = async ({ userId, text }) => {
  if (!text) return null;

  const collection = await db.getCollection(userId, text);
  const active = await db.checkActiveChallenge(userId);

  if (!collection && !active) return null;
  if (!active) {
    await db.setActiveChallenge(userId, text);
  }
  if (active) {
    const words = await db.getWords(userId);
    if (text.toLowerCase() === words.secondWord) {
      const newWord = await db.nextQuestion(userId);
      if (!newWord) return [messages.correct, messages.finished]
      return [messages.correct, newWord.firstWord]
    } else {
      return messages.incorrect;
    }
  }
  const words = await db.getWords(userId);

  return words.firstWord;
}

exports.reply = reply;
