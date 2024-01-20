const express = require('express');
const fileUpload = require('express-fileupload');
const ipfsClient = require('ipfs-http-client');

const app = express();
app.use(fileUpload()); // Enable file uploads



// IPFS file upload endpoint
app.post('/ipfs/upload', async (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  try {
    const ipfs = ipfsClient({ host: 'localhost', port: 5001, protocol: 'https' });
    const added = await ipfs.add(req.files.file.data);
    res.json({ ipfsHash: added.path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload file to IPFS' });
  }
});


