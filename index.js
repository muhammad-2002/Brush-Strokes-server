const express = require('express')
const cors =require('cors')
require('dotenv').config()
const port = process.env.PORT || 3000
const  app = express();
//middleware 

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.iwngqer.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
   
    // await client.connect();
    const database = client.db("Brush_Stokes");
    const item = database.collection("Craft_Item");
    const catagories = database.collection("catagories");
//get route
app.get('/catagories',async(req,res)=>{
  const cursor = catagories.find()
  const result = await cursor.toArray()
  res.send(result)
})
app.get('/items', async (req, res) => {
      try {
          const cursor = item.find();
          const result = await cursor.toArray();
          res.send(result);
      } catch (error) {
          console.error(error);
          res.status(500).send("Internal Server Error");
      }
  });
  
  app.get('/items-for-craft/:id',async(req,res)=>{
    const id = req.params.id
    const query= {_id:new ObjectId(id)}
    const result = await item.findOne(query)
    res.send(result)
  })
  app.get('/items-update/:id',async(req,res)=>{
    const id = req.params.id
    const query= {_id:new ObjectId(id)}
    const result = await item.findOne(query)
    res.send(result)

  })
  app.get('/ietm-by-Sub-catagory/:sub_cataogry',async(req,res)=>{
    const sub_category = req.params.sub_cataogry
    const query = { 
      subcategoryName: sub_category };
      const cursor = await item.find(query).toArray()
      res.send(cursor)
  })
  app.get('/items-by-email/:email', async (req, res) => {
      try {
          const email = req.params.email;
          const query = { email: email };
          const cursor = await item.find(query).toArray();
          if (cursor.length > 0) {
              res.send(cursor);
          } else {
              res.status(404).send("No items found for the provided email address");
          }
      } catch (error) {
          console.error(error);
          res.status(500).send("Internal Server Error");
      }
  });
  
app.get('/items/:id', async (req, res) => {
      try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const cursor = await item.findOne(query);
          res.send(cursor);
      } catch (error) {
          console.error(error);
          res.status(500).send("Internal Server Error");
      }
  });

//post route
  app.post('/items', async (req, res) => {
    try {
        const items = req.body;
        const result = await item.insertOne(items);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//put route
app.put('/items-update/:id',async(req,res)=>{
  try{
    const id = req.params.id
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateCraft = req.body
  const updateDoc ={
    $set:{
    ItemName:updateCraft.ItemName,
    subcategoryName:updateCraft.subcategoryName,
    description:updateCraft.description,
    price:updateCraft.price,
    stock:updateCraft.stock,
    customization:updateCraft.customization,
    image:updateCraft.image,
    rating:updateCraft.rating,
    processing_time:updateCraft.processing_time,
    }
  }
  const result = await item.updateOne(filter, updateDoc,options);
  res.send(result)
  }catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
}
})
//delete route

app.delete('/items/:id',async(req,res)=>{
    try{
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await item.deleteOne(query);
      res.send(result)
    }catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
  }
  })

  
  
  app.put('/items-update/:id',async(req,res)=>{
    try{
      const id = req.params.id
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateCraft = req.body
    const updateDoc ={
      $set:{
      ItemName:updateCraft.ItemName,
      subcategoryName:updateCraft.subcategoryName,
      description:updateCraft.description,
      price:updateCraft.price,
      stock:updateCraft.stock,
      customization:updateCraft.customization,
      image:updateCraft.image,
      rating:updateCraft.rating,
      processing_time:updateCraft.processing_time,
      }
    }
    const result = await item.updateOne(filter, updateDoc,options);
    res.send(result)
    }catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
  })
  
  
  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
 
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Hello Proggramer')
})

//listening 
app.listen(port,()=>console.log(`listening port ${port}`))