const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send({ hey: 'MemoriiBot' });
});


const server = app.listen(process.env.PORT || 3002, () =>  {
  const port = server.address().port;
  console.log(`Bot server listens on ${port} port`);
});
