const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const toys = require("./data.json");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json())


// app.get("/toys", (req, res) => {
//     res.send(toys);
// });


// mongodb codes..
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yqivy75.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
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
     client.connect();
    // Send a ping to confirm a successful connection


    const toyCollection = client.db("toyCarUser").collection("toyCollection");
    const toyApi = client.db("toyCarUser").collection("toyApi");
    
  

    app.get("/toys", async (req, res) => {
      const result = await toyApi.find().toArray();
      res.send(result);
    });

  
    app.get("/allToys", async (req, res) => {
      const result = await toyCollection.find({}).limit(20).toArray();
      res.send(result);
    });

    app.get('/my-toys', async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    })

// add a toy
    
    app.post("/addToys", async (req, res) => {
      const toyData = req.body;
      const result = await toyCollection.insertOne(toyData);
      res.send(result);
    });


  //Delete a toy
    app.delete("/my-toys/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    });

    





    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`toy market place is running on port: ${port}`);
});
