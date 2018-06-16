module.exports = {
  start: `
  I am going to help you with words memorizing!

Go to the [website](https://memorii.herokuapp.com) to create your account If you still haven't done so.

When you ready send type your username to enter your account

Use following syntax -> /sign/*username*
  `,
  userNotCreated: `
Oops you didnt create user yet.
Go [here](https://memorii.herokuapp.com/register) to create one
  `,
  noSelections: `
Oops seems that you dont have any learning collections yet
  `,
  userIsHere: `
    Hey I remember you! Thanks for creating profile earlier.
You are ready to start learning🤓
Send /collections to see your collections list
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
  help: `
MemoriiBot commands:
/start - get started with the Bot,
/sign/*username* - log in to your account
/collections - show list of all your collections
  `,
  errorAlert: `
Something went wrong. There might be problems on the server
Try again later.
  `
}
