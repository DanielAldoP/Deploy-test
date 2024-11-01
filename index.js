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

app.get('/pokemon/:name', (req, res) => {
  const name = req.params.name
  axios.get(`https://ex.traction.one/pokedex/pokemon/${name}`)
  .then((response) => {
  // handle success
      const pokemons = response.data;
      res.status(200).json(pokemons)
  })
  .catch((error) => {
  // handle error
      res.send(error.response.data.detail)
  });
})

app.get('/check-digit', (req, res) => {
  try {
    if (!req.query.pan) throw new Error('PAN query parameter is missing');
    const pan = req.query.pan;
    
    function checkDigit(number) {
      let stack = 0;
      number = ("" + number).split('').reverse();
      let tempn, tempsum = 0;
      for (const [key, value] of Object.entries(number)) {
        if (key % 2 == 0) {
          tempn = ("" + (parseInt(value) * 2)).split('');
          tempsum = tempn.reduce((sum, tjum) => sum + parseInt(tjum), 0);
          stack += tempsum;
        } else {
          stack += parseInt(value);
        }
      }
      
      const temp = stack;
      stack %= 10;
      
      if (stack !== 0) stack -= 10;
      
      return (temp + Math.abs(stack)) % 10 === 0 ? Math.abs(stack) : false;
    }

    const result = checkDigit(pan);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});



module.exports = app