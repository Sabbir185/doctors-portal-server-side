const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const port = 5055;
require('dotenv').config()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('doctors'));
app.use(fileUpload());


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
  });

  // show all appointment by date
  app.post('/appointmentByDate',(req, res)=>{
    const date = req.body;
    // console.log(date.dateApp);
    appointmentCollection.find({date: date.dateApp})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  });

  // get all patient data
  app.get("/appointments",(req, res)=>{
    appointmentCollection.find({})
    .toArray((err,doc)=>{
      res.send(doc);
      console.log(doc,err)
    })
  })

  // add a doctor as file
  app.post('/addADoctor',(req, res)=>{
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    console.log(file, name, email)
    file.mv(`${__dirname}/doctors/${file.name}`, err =>{
      if(err){
        console.log(err);
        return res.status(500).send({msg: 'failed to upload image'});
      }
      return res.send({name: file.name, path:`/${file.name}`});
    })

  })

});

app.listen(process.env.PORT || port);