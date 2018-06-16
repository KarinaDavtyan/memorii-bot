const reply = async ({ userId, text }) => {
  if (!text) return null;

  const collection = await axios.get(`${URL}/all-words-bot`, {
    data: {
      title: text
    }
  })

  if (!collection) return null;

  var firstQuestion = challenge.questions[0];
  var questionMessage = questionMessageFormatter.format(firstQuestion);

  return [ introMessage, questionMessage ];
}

exports.reply = reply;
