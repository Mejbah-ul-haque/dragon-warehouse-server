const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, MongoRuntimeError } = require('mongodb');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmculsr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const userConnection = client.db("dragonWarehouse").collection("service");
    
    const result = await userConnection.insertOne({name: 'Kabul', email: 'kabul@gmail.com'});
    
    console.log(`User inserted: ${result.insertedId}`);
  }
  finally{
    // await client.close();
  }
}
run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => {  
  console.log('Express server listening on port ', port); 
});