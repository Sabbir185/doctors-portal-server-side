const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const cors = require('cors');
const port = 5055;
require('dotenv').config()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b8lgl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const appointmentCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  // perform actions on the collection object
  app.post('/addAppointment',(req, res)=>{
      const appointment = req.body;
      appointmentCollection.insertOne(appointment)
      .then(result=>{
        res.send(result.insertedCount > 0)
      })
  })

});

app.listen(process.env.PORT || port);