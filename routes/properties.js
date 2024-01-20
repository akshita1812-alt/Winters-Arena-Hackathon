// properties fetch through ipfs cid queue
//ipfsService
const express = require('express');
const router = express.Router();
const ipfsService = require('../services/ipfsService');

// IPFS data structure for property details
const propertySchema = {
  type: 'object',
  properties: {
    title,
    description,
    price,
    location
  },
  required: ['address', 'price', 'description'],
};

// GET endpoint to fetch all properties
router.get('/', async (req, res) => {
  try {
    
    const propertyCIDs = await ipfsService.getList('properties');

    const properties = [];
    for (const cid of propertyCIDs) {
      const propertyData = await ipfsService.get(cid);
      const property = JSON.parse(propertyData);
      properties.push(property);
    }

    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
});

//create a new property
router.post('/addproperty', async (req, res) => {
  try {
    const propertyData = req.body;

    //Validate property data against the schema
    if (!propertySchema.validate(propertyData)) {
      return res.status(400).json({ message: 'Invalid property data' });
    }

    //upload form data on IPFS
    const cid = await ipfsService.add(JSON.stringify(propertyData), 'properties');

    //add the CID to a list to track property CIDs
    await ipfsService.append('properties', cid);

    res.json({ cid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create property' });
  }
});

module.exports = router;
