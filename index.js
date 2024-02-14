const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// midlware
app.use(cors());
app.use(express.json())


// console.log(process.env.db_user);

const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_user_pass}@cluster0.oenz0rl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db('carDoctor').collection('services');
    const checkOutCollection = client.db('carDoctor').collection('checkOut');

    //to get the service data collection this operation
    app.get('/services', async(req,res)=>{
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //this operation create for get the data about a specific id
    app.get('/services/:id', async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)};
      const options ={
        projection:{title:1,img:1,price:1,description:1},
      }
      const result = await serviceCollection.findOne(query,options);
      res.send(result);
    })

    // this operation for get the checkout data from database and create a api
    app.get('/checkOut', async(req,res)=>{
      console.log(req)
      let query = {};
      if(req.query.customar_email){
        query = {
          customar_email : req.query.customar_email
        }
      }
      const cursor = checkOutCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    //for check out
    app.post('/checkOut', async(req,res)=>{
      const checkOut = req.body;
      console.log(checkOut)
      const result = await checkOutCollection.insertOne(checkOut);
      res.send(result);
    })

    // for delete the orders data
    app.delete('/checkOut/:id', async(req,res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await checkOutCollection.deleteOne(query);
      res.send(result); 
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req,res)=>{
  res.send('Doctor is running');
})

app.listen(port, ()=>{
  console.log(`Car doctor is running on port : ${port}`)
})