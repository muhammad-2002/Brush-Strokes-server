const express = require('express')
const cors =require('cors')
require('dotenv').config()
const port = process.env.PORT || 3000
const  app = express();



//middleware 

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
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
   
    await client.connect();
    app.post('/items',(req,res)=>{
        console.log(req.body)
        res.send(req.body)
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