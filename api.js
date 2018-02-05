const axios = require('axios');
const redis = require('redis'),
  client = redis.createClient();

client.send_command('CLIENT', ['SETNAME', 'memorii'], (err, res) => {});


UserData = (username) => {
  axios.get('http://Karina-MacBookPro.local:3000/selections-bot', {
    data: {
      username
    }
  })
    .then(function (response) {
      console.log(response.data);
      client.sadd('selections', response.data, function (err, res) {});
    })
    .catch((e) => {
      e.response.status === 404
        ? client.hmset('errors', ['selections', 'no selections'], (err, res) => {})
        : console.log(e.response.status);
    })
}

UserData('Karina')
// client.hgetall('selections', function (err, reply) {
//   console.log(reply);
// })
client.hgetall('errors', (err, res) => console.log(res));
