const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ojnnavp.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    const userCollection = client.db("TrendZenDB").collection("users");
    const productCollection = client.db("TrendZenDB").collection("products");
    const summerCollection = client.db("TrendZenDB").collection("summer");
    const myCartCollection = client.db("TrendZenDB").collection("myCart");

    // POST > User
    app.post('/users',async(req,res)=>{
        const user = req.body;
        const result =await userCollection.insertOne(user);
        res.send(result)
    })
    
    // POST > Product
    app.post('/products',async(req,res)=>{
        const product = req.body;
        const result =await productCollection.insertOne(product);
        res.send(result)
    })

    //POST > Cart
    app.post('/myCart',async(req,res)=>{
        const cart = req.body;
        const result =await myCartCollection.insertOne(cart);
        res.send(result)
    })

    //Get > summer product
    app.get('/summer',async(req,res)=>{
        const result =await summerCollection.find().toArray();
        res.send(result);
    })
    app.get('/products',async(req,res)=>{
        const result =await productCollection.find().toArray();
        res.send(result);
    })
    app.get('/myCart',async(req,res)=>{
        const result =await myCartCollection.find().toArray();
        res.send(result);
    })
    app.get('/products/:id',async(req,res)=>{
        const id =req.params.id;
        const query={_id: new ObjectId(id)}
        const result =await productCollection.findOne(query);
        res.send(result);
    })

    //Update Product
    app.put("/products/:id",async(req,res)=>{
        try{
          const id=req.params.id;
          // res.send(id)
          const query = { _id: new ObjectId(id) }
          const body = req.body;
          // console.log(body)
          const updateProduct = {
              $set: {
                ...body,
              },
            };
            const options = { upsert: true };

            const result = await productCollection.updateOne(query,updateProduct,options)
            res.send(result);

        }
        catch(err){res.send(err)}

      })


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('TrendZen Website is running .....')
  })
  
  app.listen(port, () => {
    console.log(`TrendZen Website  is running on port ${port}`)
  })