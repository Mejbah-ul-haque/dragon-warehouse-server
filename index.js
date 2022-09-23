const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmculsr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const serviceCollection = client.db("dragonWarehouse").collection("service");
    console.log('DB connection established')
    
    app.get('/service', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    })
    
    app.get("/service/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await serviceCollection.findOne(query);
			res.json(result);
		});
    
    // update items quantity or Restock
    // app.put('/service/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const updatedQuantity = req.body;
    //   const filter = { _id: ObjectId(id) };
    //   const options = { upsert: true };
    //   const updatedDoc = {
    //       $set: {
    //           updatedQuantity
    //       }
    //   };
    //   const result = await serviceCollection.updateOne(filter, updatedDoc, options);
    //   res.send(result);
    // })
    
    
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