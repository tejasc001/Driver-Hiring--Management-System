const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('Database connected'))
  .catch((e) => console.log(e.message));

app.listen(process.env.PORT || 5000, () =>
  console.log('App is Listening on port')
);
