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

app.post('/check-digit', (req, res) => {
  try {
    if(!req.body) throw new Error('body empty')
    if(!req.body.pan) throw new Error('pan empty')
    const pan = req.body.pan
    
    function checkDigit (number) {
      var stack = 0;
      number = ("" + number).split('').reverse();
      var tempn;
      var tempsum = 0;
      for (var [key, value] of Object.entries(number)) {
          if (key % 2 == 0) {
              tempn = ("" + (parseInt(value) * 2)).split('');
              tempsum = 0;
              for (tjum of tempn) tempsum += parseInt(tjum);
              value = tempsum;
          }
          stack += parseInt(value);
      }
    
      var temp = stack;
      stack %= 10;
    
      if (stack != 0) stack -= 10;
    
      if ((temp + Math.abs(stack)) % 10 != 0) return false;
      else return Math.abs(stack);
    }

    const result = checkDigit(pan)
    res.status(200).json(result)
  } catch (error) {
    res.send(error)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});



module.exports = app