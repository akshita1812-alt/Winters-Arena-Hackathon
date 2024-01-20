// const ipfsClient = require('ipfs-http-client');

// const {create} = require("ipfs-http-client");

// async function ipfsClient(){
//     const ipfs= await create(
//         {
//             host:"ipfs.infura.io",
//             port:5001,
//             protocol:"https"
//         }
//     );

//     return ipfs 
// }

// async function saveText(){

//     let ipfs = await ipfsClient();

//    let res = await ipfs.add("hello");
//    console.log(res);
// }



// ---------------------------------------------------
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const fs=require('fs');

//connectiong to local ipfs node
// const ipfs = new ipfsClient({ host : 'ipfs.infura.io', port: '5001', protocol: 'http'});

const app = express();

//basic configurations
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
app.use(express.text());
app.use(express.json());
app.use(express.static(__dirname+ '/public'));
app.use(express.static(__dirname));

app.use('/transactions', transactionsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

////Mongo//////
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


  const mongoose = require('mongoose');
////SCHEMA/////
  const propertySchema = new mongoose.Schema({
    property: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  });
  
  const Property = mongoose.model('Property', propertySchema);
  
  module.exports = Property;
  
//routes
app.get('/', (req,res)=>{  
    res.render('./home.hbs');
});
app.get('/addProperty', (req,res)=>{  
    res.render('./form.hbs');
});
app.get('/listedProperty', (req,res)=>{  
    res.render('./buyer.hbs');
});
app.get('/Property/:id', (req,res)=>{ 
    // const propertyId = req.params.id;
    // const property = Property.findById(propertyId) 
    res.render('./property.hbs');
});

/////POST////
app.post('/api/properties', async (req, res) => {
    try {
      const { title, description, price, location, sellerId } = req.body;
  
      
      const existingUser = await User.findById(sellerId);
  
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const newProperty = new Property({
        title,
        description,
        price,
        location,
        seller: sellerId,
      });
  
      const savedProperty = await newProperty.save();
      res.status(201).json(savedProperty);
    } catch (error) {
      console.error('Error adding property:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// app.post('/upload', (req,res)=>{
//     const file = req.files.file;
//     const fileName = req.body.filename; //from gtml body
//     const filePath = 'files/' + fileName;

//     //downloading the file onto our server
//     file.mv(filePath, async(err) => {
//         if(err){
//             console.log('Error : failed to download the file');
//             return res.status(500).send(err);
//         }

//         const  fileHash = await addFile(filename, filePath);
//         //now that we have uploaded the file on IPFS, we can delete from our server

//         fs.unlink(filePath, (err)=>{
//             if(err) console.log(err);
//         })

//         res.render('upload', {fileName, filehash});
//     })
// });

//function to add the uploaded file to IPFS
// const addFile = async (fileName, filePath)=> {
//     const file = fs.readFileSync(filePath);
//     const fileAdded = await ipfs.add({path: fileName, content: file});
//     const fileHash = fileAdded[0].hash;

//     return fileHash;
// }


//making the server listen

app.listen(4000, ()=>{
    console.log('Server is listening on port: 4000');
})