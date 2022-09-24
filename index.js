const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmculsr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const serviceCollection = client.db("dragonWarehouse").collection("service");
    const userCollection = client.db("dragonWarehouse").collection("users");
    
    console.log('DB connection established')
    
    app.get('/service', async (req, res) => {
      console.log(req.headers);
      const query = {user: req.headers.email};
      const cursor = serviceCollection.find(query).sort({_id: -1});
      const services = await cursor.toArray();
      res.send(services);
    })
    
    // sort({_id: -1}) = for first position added services
    
    app.get("/service/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await serviceCollection.findOne(query);
			res.json(result);
		});
    
    // app.post('/service', async (req, res) =>{
		// 	const service = req.body;
		// 	const result = await serviceCollection.insertOne(service);
		// 	res.json(result);
		// });
    // POST
      app.post('/service', async (req, res) => {
        const newService = req.body;
        const result = await serviceCollection.insertOne(newService);
        res.send(result);
    });
		
		app.delete('/service/:id', async (req, res) =>{
			const id = req.params.id;
			const filter = {_id: ObjectId(id)}
			const result = await serviceCollection.deleteOne(filter);
			res.json(result);
		});
    
    // update items quantity or Restock
    app.put('/service/:id', async (req, res) => {
      const id = req.params.id;
      const {quantity} = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
          $set: {quantity}
      };
      const result = await serviceCollection.updateOne(filter, updatedDoc, options);
      console.log(result);
      res.send(result);
    })
    
    //add Item
    
  
    
    // users
		app.get("/user", async (req, res) => {
			const users = await userCollection.find().toArray();
			res.send(users);
		});
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