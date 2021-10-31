const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors')
const app = express()

const port = process.env.PORT || 5000

//MIDDLEWARE

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1hb6l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run () {
    try{
        await client.connect()
        const database = client.db('travle_egency')
        const destinationCollection = database.collection('destination')
        const detailCollection = database.collection('detail')
        
        //  GET DESTINATION API
        app.get('/destination', async(req, res)=>{
          const cursor = destinationCollection.find({})
          const destination = await cursor.toArray()
          res.send(destination)
        })

        //GET DESTINATIONS API
        app.get('/destinations', async(req, res)=>{
          const cursor = detailCollection.find({})
          const detail = await cursor.toArray()
          res.send(detail)
        })

        //GET A SINGLE DETAIL
        app.get('/details/:id', async(req, res)=>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)}
          const detail = await detailCollection.findOne(query)
          res.json(detail)
        })

      
        
        // POST API

        app.post('/destinations', async (req, res)=>{
          const destination = req.body;
          console.log('hit the api', destination);
          
          const result = await detailCollection.insertOne(destination)
          res.json(result)
          // res.send('hit this to you')
          
          
        })

          //DELETE API
  
        app.delete('/destinations/:id',async(req, res)=>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)}
          const result = await detailCollection.deleteOne(query)
          res.json(result)
        })
    }
    finally{
        // await client.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})