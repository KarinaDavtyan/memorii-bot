module.exports = {
  start: `
  I am going to help you with words memorizing!

Go to the website to create your account If you still haven't done so.
Introduce this words to me so I can memorize them and then make you memorize them 😊.

When you ready send type your username to enter your account

Use following syntax -> /sign/*username*
  `,
  userNotCreated: `
Oops you didnt create user yet.
Go [here](https://github.com/) to create one
  `,
  noSelections: `
Oops seems that you dont have any learning selections yet
  `,
  userIsHere: `
    Hey I remember you! Thanks for creating profile earlier.
You are ready to start learning🤓
Send /selections to see your selections list
  `,
  selected: (selected) => {
    return `${selected}`
  },
  emptySelection: (selected) => {
    return `*${selected}* is empty`
  },
  question: (word) => {
    return `-*${word}*-`
  },
  learn: `
    It's happening!🔥🔥🔥
Now you can show me what you've learned
Counter the words with the translation.
Don't worry I'll let you know when you are wrong🙊

In current version *CurrentNumber+Answer* (1hello) is the only valid format.
  `,
  stop: `
    Byeee✌️
  `,
  correct: `
    It was correct👌
    `,
  incorrect: `
    Nope 🙅
  `,
  finished: `
    Sprint done!
  `,
  invalid: `
    Ooops invalid format😢
Unfortunatelly *CurrentNumber+Answer* (1hello) is the only available format for now
  `,
  help: `
MemoriiBot commands:
/start - get started with the Bot,
/sign/*username* - log in to your account,
/learn - start learning sprint,
/stop - stop sprint and clear current session
  `,
  errorAlert: `
Something went wrong. There might be problems on the server
Try again later.
  `
}
