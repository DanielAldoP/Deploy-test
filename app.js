require("dotenv").config()

const cors = require('cors')
const axios = require('axios')
const express = require('express');
const app = express();
const port = process.env.TEST_PORT || 3000;

app.use(cors())

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('testing deploy API!');
});

app.get('/waifu', (req, res) => {
    axios.get('https://api.waifu.im/search')
    .then((response) => {
    // handle success
        const waifus = response.data;
        res.status(200).json(waifus)
    })
    .catch((error) => {
    // handle error
        res.send(error.response.data.detail)
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});



module.exports = app