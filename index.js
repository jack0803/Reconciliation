require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const contactRoute = require('./routes/contactRoute');

const app = express();
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use(contactRoute);
const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log('Error: ' + err);
  });
