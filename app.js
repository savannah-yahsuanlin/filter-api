require('./db/connect');
const express = require('express');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
const app = express();
const client = require('./db/connect')

const productsRouter = require('./routes/products');

app.use(express.json());

app.use('/api/v1/products', productsRouter)

app.get('/hello', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000

async function init() {
  try {
    app.listen(port, console.log(`listening on ${port}`));
  } finally {
    await client.close();
  }
}


init().catch(console.dir);
