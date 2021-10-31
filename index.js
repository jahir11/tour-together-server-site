const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

const app = express()
const cors = require('cors')
const port =process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tjkgo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();

        const database = client.db('tourTogether')
        const servicesCollection = database.collection('services')
        const ordersCollection = database.collection('orders')
        const blogsCollection = database.collection('blogs')

        // GET API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })
        // GET SINGLE SERVICE
        app.get('/service/:id',async(req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)}
          const service = await servicesCollection.findOne(query)
          res.json(service)

        })
        app.get('/booking/:id',async(req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)}
          const service = await servicesCollection.findOne(query)
          res.json(service)

        })
        // GET Blogs API
        app.get('/blogs', async(req, res) => {
          const cursor = blogsCollection.find({})
          const services = await cursor.toArray()
          res.send(services)
      })
        
        // POST API
        app.post('/addblog', async(req, res) => {
          const newBlog = req.body;
          const result = await blogsCollection.insertOne(newBlog)
          res.json(result)
        })
        // Add Orders API
        app.post('/orders', async(req, res) => {
          const order = req.body;
          const result = await ordersCollection.insertOne(order)
          res.json(result)
        })
        // GET Order API
        app.get('/orders', async(req, res) => {
          const cursor = ordersCollection.find({})
          const orders = await cursor.toArray()
          res.send(orders)
      })
      // DELETE API
      app.delete('/orders/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await ordersCollection.deleteOne(query)
        res.json(result)


      })

    }
    finally{
      // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Tour-Together server')
})

app.listen(port, () => {
  console.log(`tour-together listening port :${port}`)
})