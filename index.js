const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => {  
  console.log('Express server listening on port ', port); 
});