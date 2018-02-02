const axios = require('axios');
const redis = require('redis'),
  client = redis.createClient();

UserData = (username) => {
  axios.get('http://Karina-MacBookPro.local:3000/selections-bot', {
    data: {
      username
    }
  })
    .then(function (response) {
      console.log(response.data);
      //append selections to SET
      // client.hmset('selections', response.data, function (err, res) {});
    })
    .catch((e) => {
      e.response.status === 404
        ? client.hmset('errors', ['selections', 'no selections'], (err, res) => {})
        : console.log(e.response.status);
    })
}

UserData('test')
// client.hgetall('selections', function (err, reply) {
//   console.log(reply);
// })
client.hgetall('errors', (err, res) => console.log(res));
